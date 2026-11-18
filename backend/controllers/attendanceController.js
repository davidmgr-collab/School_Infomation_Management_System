const db = require('../config/db');

exports.list = async (req, res, next) => {
  try {
    const { term_id, attendance_date, level_id, combination_id } = req.query;
    if (!term_id || !attendance_date || !combination_id) {
      return res.status(400).json({ message: 'term_id, attendance_date and combination_id are required.' });
    }
    const [rows] = await db.execute(
      `SELECT e.id AS enrollment_id, s.id AS student_id, s.admission_number,
              s.first_name, s.last_name, ar.attendance_status, ar.remarks
       FROM student_enrollments e
       JOIN students s ON s.id=e.student_id
       JOIN combinations c ON c.id=e.combination_id
       LEFT JOIN attendance_sessions ats ON ats.term_id=? AND ats.attendance_date=? AND ats.session_name='Full day'
       LEFT JOIN attendance_records ar ON ar.session_id=ats.id AND ar.enrollment_id=e.id
       WHERE e.academic_year_id=(SELECT academic_year_id FROM terms WHERE id=?)
         AND e.combination_id=? AND e.status='active' AND s.status='active'
       ORDER BY s.first_name, s.last_name`,
      [term_id, attendance_date, term_id, combination_id]
    );
    res.json({ data: rows });
  } catch (e) { next(e); }
};

exports.save = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    const { term_id, attendance_date, records } = req.body;
    if (!term_id || !attendance_date || !Array.isArray(records) || !records.length) {
      return res.status(400).json({ message: 'Term, date and attendance records are required.' });
    }
    await connection.beginTransaction();
    const [session] = await connection.execute(
      `INSERT INTO attendance_sessions (term_id, attendance_date, session_name, recorded_by)
       VALUES (?, ?, 'Full day', ?)
       ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id), recorded_by=VALUES(recorded_by)`,
      [term_id, attendance_date, req.user.id]
    );
    const sessionId = session.insertId;
    for (const record of records) {
      if (!record.enrollment_id || !['Present', 'Absent', 'Late', 'Excused'].includes(record.attendance_status)) {
        throw new Error('Each record must have a valid enrollment and attendance status.');
      }
      await connection.execute(
        `INSERT INTO attendance_records (session_id, enrollment_id, attendance_status, remarks)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE attendance_status=VALUES(attendance_status), remarks=VALUES(remarks)`,
        [sessionId, record.enrollment_id, record.attendance_status, record.remarks || null]
      );
    }
    await connection.commit();
    res.json({ message: 'Attendance saved successfully.' });
  } catch (e) {
    await connection.rollback();
    next(e);
  } finally { connection.release(); }
};
