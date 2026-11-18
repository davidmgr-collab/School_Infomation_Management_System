const db = require('../config/db');

const SELECT_STUDENTS = `
  SELECT s.id, s.admission_number, s.first_name, s.last_name, s.gender,
         s.date_of_birth, s.phone, s.guardian_name, s.guardian_phone,
         s.address, s.status, e.id AS enrollment_id, e.academic_year_id,
         e.combination_id, ay.year_name, l.id AS level_id, l.level_name,
         c.combination_name
  FROM students s
  LEFT JOIN student_enrollments e ON e.student_id = s.id AND e.status = 'active'
  LEFT JOIN academic_years ay ON ay.id = e.academic_year_id
  LEFT JOIN combinations c ON c.id = e.combination_id
  LEFT JOIN levels l ON l.id = c.level_id`;

exports.list = async (req, res, next) => {
  try {
    const { search = '', level_id, combination_id, academic_year_id } = req.query;
    let sql = SELECT_STUDENTS + ` WHERE s.status <> 'inactive'`;
    const params = [];
    if (search) {
      sql += ` AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.admission_number LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (level_id) { sql += ' AND l.id = ?'; params.push(level_id); }
    if (combination_id) { sql += ' AND c.id = ?'; params.push(combination_id); }
    if (academic_year_id) { sql += ' AND e.academic_year_id = ?'; params.push(academic_year_id); }
    sql += ' ORDER BY s.first_name, s.last_name';
    const [rows] = await db.execute(sql, params);
    res.json({ data: rows });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    const {
      admission_number, first_name, last_name, gender, date_of_birth, phone,
      guardian_name, guardian_phone, address, academic_year_id, combination_id
    } = req.body;
    if (!admission_number || !first_name || !last_name || !gender || !academic_year_id || !combination_id) {
      return res.status(400).json({ message: 'Admission number, names, gender, academic year and combination are required.' });
    }
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO students (admission_number, first_name, last_name, gender, date_of_birth, phone, guardian_name, guardian_phone, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [admission_number, first_name, last_name, gender, date_of_birth || null, phone || null, guardian_name || null, guardian_phone || null, address || null]
    );
    await connection.execute(
      `INSERT INTO student_enrollments (student_id, academic_year_id, combination_id, enrollment_date)
       VALUES (?, ?, ?, CURDATE())`,
      [result.insertId, academic_year_id, combination_id]
    );
    await connection.commit();
    res.status(201).json({ message: 'Student created successfully.' });
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Admission number or enrollment already exists.' });
    next(error);
  } finally { connection.release(); }
};

exports.update = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    const id = Number(req.params.id);
    const {
      admission_number, first_name, last_name, gender, date_of_birth, phone,
      guardian_name, guardian_phone, address, academic_year_id, combination_id
    } = req.body;
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `UPDATE students SET admission_number=?, first_name=?, last_name=?, gender=?, date_of_birth=?,
       phone=?, guardian_name=?, guardian_phone=?, address=? WHERE id=?`,
      [admission_number, first_name, last_name, gender, date_of_birth || null, phone || null,
       guardian_name || null, guardian_phone || null, address || null, id]
    );
    if (!result.affectedRows) {
      await connection.rollback();
      return res.status(404).json({ message: 'Student not found.' });
    }
    if (academic_year_id && combination_id) {
      await connection.execute(
        `INSERT INTO student_enrollments (student_id, academic_year_id, combination_id, enrollment_date)
         VALUES (?, ?, ?, CURDATE())
         ON DUPLICATE KEY UPDATE combination_id=VALUES(combination_id), status='active'`,
        [id, academic_year_id, combination_id]
      );
    }
    await connection.commit();
    res.json({ message: 'Student updated successfully.' });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally { connection.release(); }
};

exports.remove = async (req, res, next) => {
  try {
    const [result] = await db.execute(`UPDATE students SET status='inactive' WHERE id=?`, [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Student not found.' });
    res.json({ message: 'Student deactivated.' });
  } catch (error) { next(error); }
};
