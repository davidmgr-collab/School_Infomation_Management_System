
const db = require('../config/db');

const {
  TICKET_PRICES,
  TERM_MATERIALS,
  MATERIAL_PRICES,
  TERM_TOTALS
} = require('../config/materialConfig');

// Public academic information.
exports.academic = async (req, res, next) => {
  try {
    const [years] = await db.execute(
      `SELECT id, year_name, status
       FROM academic_years
       ORDER BY id DESC`
    );

    const [terms] = await db.execute(
      `SELECT id, academic_year_id, term_number,
              term_name, status
       FROM terms
       ORDER BY academic_year_id DESC, term_number ASC`
    );

    const [levels] = await db.execute(
      `SELECT id, level_name
       FROM levels
       ORDER BY id`
    );

    res.json({
      data: {
        years,
        terms,
        levels
      }
    });
  } catch (error) {
    next(error);
  }
};

// Public student directory.
// Never return phone numbers, addresses or guardian details.
exports.students = async (req, res, next) => {
  try {
    const {
      search = '',
      level_id,
      academic_year_id
    } = req.query;

    const conditions = [
      "s.status = 'active'",
      "e.status = 'active'"
    ];

    const values = [];

    if (search.trim()) {
      conditions.push(`(
        s.first_name LIKE ?
        OR s.last_name LIKE ?
        OR s.admission_number LIKE ?
      )`);

      const term = `%${search.trim()}%`;
      values.push(term, term, term);
    }

    if (level_id) {
      conditions.push('l.id = ?');
      values.push(Number(level_id));
    }

    if (academic_year_id) {
      conditions.push('e.academic_year_id = ?');
      values.push(Number(academic_year_id));
    }

    const [students] = await db.execute(
      `SELECT
          s.id,
          s.admission_number,
          s.first_name,
          s.last_name,
          s.gender,
          l.level_name,
          c.combination_name

       FROM students s

       INNER JOIN student_enrollments e
          ON e.student_id = s.id

       INNER JOIN combinations c
          ON c.id = e.combination_id

       INNER JOIN levels l
          ON l.id = c.level_id

       WHERE ${conditions.join(' AND ')}

       ORDER BY s.first_name, s.last_name
       LIMIT 200`,
      values
    );

    res.json({
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// Public school statistics.
exports.statistics = async (req, res, next) => {
  try {
    const [studentRows] = await db.execute(
      `SELECT COUNT(DISTINCT s.id) AS total_students
       FROM students s
       INNER JOIN student_enrollments e
          ON e.student_id = s.id
       WHERE s.status = 'active'
         AND e.status = 'active'`
    );

    const [levelRows] = await db.execute(
      `SELECT COUNT(*) AS total_levels
       FROM levels`
    );

    const [combinationRows] = await db.execute(
      `SELECT COUNT(*) AS total_combinations
       FROM combinations`
    );

    res.json({
      data: {
        total_students: Number(studentRows[0].total_students),
        total_levels: Number(levelRows[0].total_levels),
        total_combinations: Number(combinationRows[0].total_combinations)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Public term materials and prices.
exports.materials = async (req, res, next) => {
  try {
    const termId = Number(req.params.term_id);

    if (!Number.isInteger(termId) || termId <= 0) {
      return res.status(400).json({
        message: 'Invalid term selected.'
      });
    }

    const [terms] = await db.execute(
      `SELECT id, term_number, term_name
       FROM terms
       WHERE id = ?`,
      [termId]
    );

    if (!terms.length) {
      return res.status(404).json({
        message: 'Term not found.'
      });
    }

    const term = terms[0];
    const termNumber = Number(term.term_number);

    const materials = TERM_MATERIALS[termNumber] || [];
    const materialPrices = MATERIAL_PRICES[termNumber] || {};

    // Build a detailed list without changing the original materials array.
    const materialDetails = materials.map((material) => ({
      material_key: material,
      amount: Number(materialPrices[material] || 0)
    }));

    res.json({
      data: {
        term_id: term.id,
        term_number: termNumber,
        term_name: term.term_name,

        // Preserve the original response format.
        materials,

        // New price information.
        material_prices: materialPrices,
        material_details: materialDetails,
        total_material_amount: Number(TERM_TOTALS[termNumber] || 0),

        // Tickets remain separate from material totals.
        ticket_prices: TICKET_PRICES
      }
    });
  } catch (error) {
    next(error);
  }
};

// Public ticket price information only.
// Individual student payment records remain private.
exports.tickets = async (req, res) => {
  res.json({
    data: Object.entries(TICKET_PRICES).map(
      ([location, amount]) => ({
        location,
        amount
      })
    )
  });
};
