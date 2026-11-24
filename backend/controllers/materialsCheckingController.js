
const db = require('../config/db');

const {
  TICKET_PRICES,
  TERM_MATERIALS,
  MATERIAL_PRICES,
  MINES_REQUIRED_AMOUNT,
  TERM_TOTALS
} = require('../config/materialConfig');

const VALID_STATUS = ['OK', 'NYC'];

// GET: Load students, material checking and ticket records.
exports.list = async (req, res, next) => {
  try {
    const {
      term_id,
      checking_date,
      combination_id
    } = req.query;

    if (!term_id || !checking_date || !combination_id) {
      return res.status(400).json({
        message: 'Term, checking date and combination are required.'
      });
    }

    const [termRows] = await db.execute(
      `SELECT id, academic_year_id, term_number
       FROM terms
       WHERE id = ?`,
      [term_id]
    );

    if (!termRows.length) {
      return res.status(404).json({
        message: 'Selected term was not found.'
      });
    }

    const term = termRows[0];
    const termNumber = Number(term.term_number);
    const materials = TERM_MATERIALS[termNumber] || [];

    if (!materials.length) {
      return res.status(400).json({
        message: 'No materials are configured for this term.'
      });
    }

    const [rows] = await db.execute(
      `SELECT
          e.id AS enrollment_id,
          s.id AS student_id,
          s.admission_number,
          s.first_name,
          s.last_name,

          mcs.id AS check_id,
          mcs.checked_at,
          checker.full_name AS checked_by_name,

          mci.material_key,
          mci.material_status,
          mci.paid_amount,

          st.location AS ticket_location,
          st.amount AS ticket_amount

       FROM student_enrollments e

       INNER JOIN students s
          ON s.id = e.student_id

       LEFT JOIN student_material_check_sessions mcs
          ON mcs.enrollment_id = e.id
          AND mcs.term_id = ?
          AND mcs.checking_date = ?

       LEFT JOIN student_material_check_items mci
          ON mci.check_session_id = mcs.id

       LEFT JOIN users checker
          ON checker.id = mcs.checked_by

       LEFT JOIN student_tickets st
          ON st.enrollment_id = e.id
          AND st.term_id = ?

       WHERE e.academic_year_id = ?
         AND e.combination_id = ?
         AND e.status = 'active'
         AND s.status = 'active'

       ORDER BY s.first_name ASC, s.last_name ASC`,
      [
        term_id,
        checking_date,
        term_id,
        term.academic_year_id,
        combination_id
      ]
    );

    const studentsMap = new Map();

    for (const row of rows) {
      if (!studentsMap.has(row.enrollment_id)) {
        studentsMap.set(row.enrollment_id, {
          enrollment_id: row.enrollment_id,
          student_id: row.student_id,
          admission_number: row.admission_number,
          first_name: row.first_name,
          last_name: row.last_name,

          check_id: row.check_id,
          items: {},
          paid_amounts: {},

          ticket_location: row.ticket_location || '',
          ticket_amount:
            row.ticket_amount === null
              ? null
              : Number(row.ticket_amount),

          checked_at: row.checked_at,
          checked_by_name: row.checked_by_name
        });
      }

      const student = studentsMap.get(row.enrollment_id);

      if (row.material_key) {
        student.items[row.material_key] = row.material_status;

        if (row.material_key === 'enter_mines') {
          student.paid_amounts.enter_mines =
            row.paid_amount === null
              ? ''
              : Number(row.paid_amount);
        }
      }
    }

    res.json({
      data: Array.from(studentsMap.values()),
      term_number: termNumber,
      materials,

      // New price information for the administration dashboard.
      material_prices: MATERIAL_PRICES[termNumber] || {},
      total_material_amount: Number(TERM_TOTALS[termNumber] || 0),

      mines_required_amount: MINES_REQUIRED_AMOUNT,
      ticket_prices: TICKET_PRICES
    });

  } catch (error) {
    next(error);
  }
};

// POST: Save or update material checking and ticket records.
exports.save = async (req, res, next) => {
  let connection;

  try {
    const {
      term_id,
      checking_date,
      combination_id,
      records
    } = req.body;

    if (
      !term_id ||
      !checking_date ||
      !combination_id ||
      !Array.isArray(records) ||
      records.length === 0
    ) {
      return res.status(400).json({
        message: 'Term, date, combination and records are required.'
      });
    }

    const [termRows] = await db.execute(
      `SELECT id, academic_year_id, term_number
       FROM terms
       WHERE id = ?`,
      [term_id]
    );

    if (!termRows.length) {
      return res.status(404).json({
        message: 'Selected term was not found.'
      });
    }

    const term = termRows[0];
    const termNumber = Number(term.term_number);
    const allowedMaterials = TERM_MATERIALS[termNumber];

    if (!allowedMaterials) {
      return res.status(400).json({
        message: 'No material requirements are configured for this term.'
      });
    }

    const enrollmentIds = new Set();

    // Validate submitted records.
    for (const record of records) {
      if (
        !record.enrollment_id ||
        !record.items ||
        typeof record.items !== 'object'
      ) {
        return res.status(400).json({
          message: 'Each record must include enrollment_id and items.'
        });
      }

      if (enrollmentIds.has(String(record.enrollment_id))) {
        return res.status(400).json({
          message: 'Duplicate enrollment records are not allowed.'
        });
      }

      enrollmentIds.add(String(record.enrollment_id));

      const rawAmount = record.paid_amounts?.enter_mines ?? 0;
      const amount = Number(rawAmount);

      if (
        rawAmount === null ||
        !Number.isFinite(amount) ||
        amount < 0 ||
        amount > 9999999999.99
      ) {
        return res.status(400).json({
          message: 'ENTER MINES payment must be a valid non-negative amount.'
        });
      }

      // Validate ticket location.
      const ticketLocation = record.ticket_location || '';

      if (
        ticketLocation !== '' &&
        !Object.prototype.hasOwnProperty.call(
          TICKET_PRICES,
          ticketLocation
        )
      ) {
        return res.status(400).json({
          message: 'Invalid ticket location selected.'
        });
      }

      // Validate material statuses.
      for (const key of allowedMaterials) {
        if (key === 'enter_mines') {
          continue;
        }

        if (!VALID_STATUS.includes(record.items[key])) {
          return res.status(400).json({
            message: `Invalid status for ${key}. Use OK or NYC.`
          });
        }
      }
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    for (const record of records) {
      // Verify the student enrollment.
      const [enrollments] = await connection.execute(
        `SELECT id
         FROM student_enrollments
         WHERE id = ?
           AND academic_year_id = ?
           AND combination_id = ?
           AND status = 'active'`,
        [
          record.enrollment_id,
          term.academic_year_id,
          combination_id
        ]
      );

      if (!enrollments.length) {
        throw new Error(
          `Enrollment ${record.enrollment_id} does not belong to the selected combination.`
        );
      }

      const amount = Number(
        record.paid_amounts?.enter_mines ?? 0
      );

      // Calculate MINES status using the new 110,000 FRW requirement.
      const minesStatus =
        amount >= MINES_REQUIRED_AMOUNT ? 'OK' : 'NYC';

      // Create or retrieve the checking session.
      await connection.execute(
        `INSERT INTO student_material_check_sessions
          (term_id, checking_date, enrollment_id, checked_by)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           checked_by = VALUES(checked_by),
           checked_at = CURRENT_TIMESTAMP`,
        [
          term_id,
          checking_date,
          record.enrollment_id,
          req.user.id
        ]
      );

      const [sessions] = await connection.execute(
        `SELECT id
         FROM student_material_check_sessions
         WHERE term_id = ?
           AND checking_date = ?
           AND enrollment_id = ?`,
        [
          term_id,
          checking_date,
          record.enrollment_id
        ]
      );

      if (!sessions.length) {
        throw new Error('Unable to retrieve the checking session.');
      }

      const sessionId = sessions[0].id;

      // Save each material and its status.
      for (const key of allowedMaterials) {
        const status =
          key === 'enter_mines'
            ? minesStatus
            : record.items[key];

        const paidAmount =
          key === 'enter_mines' ? amount : null;

        await connection.execute(
          `INSERT INTO student_material_check_items
            (
              check_session_id,
              material_key,
              material_status,
              paid_amount
            )
           VALUES (?, ?, ?, ?)

           ON DUPLICATE KEY UPDATE
             material_status = VALUES(material_status),
             paid_amount = VALUES(paid_amount)`,
          [
            sessionId,
            key,
            status,
            paidAmount
          ]
        );
      }

      // Save or update the student's ticket.
      const ticketLocation = record.ticket_location || '';

      if (ticketLocation) {
        const ticketAmount = TICKET_PRICES[ticketLocation];

        await connection.execute(
          `INSERT INTO student_tickets
            (enrollment_id, term_id, location, amount)
           VALUES (?, ?, ?, ?)

           ON DUPLICATE KEY UPDATE
             location = VALUES(location),
             amount = VALUES(amount),
             updated_at = CURRENT_TIMESTAMP`,
          [
            record.enrollment_id,
            term_id,
            ticketLocation,
            ticketAmount
          ]
        );
      } else {
        await connection.execute(
          `DELETE FROM student_tickets
           WHERE enrollment_id = ?
             AND term_id = ?`,
          [
            record.enrollment_id,
            term_id
          ]
        );
      }
    }

    await connection.commit();

    res.json({
      message: 'Student materials checking and tickets saved successfully.',
      saved_records: records.length
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    next(error);

  } finally {
    if (connection) {
      connection.release();
    }
  }
};
