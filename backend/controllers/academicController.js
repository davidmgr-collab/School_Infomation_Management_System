const db = require('../config/db');

exports.years = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT id, year_name, status FROM academic_years ORDER BY id DESC');
    res.json({ data: rows });
  } catch (e) { next(e); }
};
exports.terms = async (req, res, next) => {
  try {
    const { academic_year_id } = req.query;
    let sql = 'SELECT id, academic_year_id, term_number, term_name, status FROM terms';
    const params = [];
    if (academic_year_id) { sql += ' WHERE academic_year_id=?'; params.push(academic_year_id); }
    sql += ' ORDER BY term_number';
    const [rows] = await db.execute(sql, params);
    res.json({ data: rows });
  } catch (e) { next(e); }
};
exports.levels = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT id, level_name FROM levels ORDER BY id');
    res.json({ data: rows });
  } catch (e) { next(e); }
};
exports.combinations = async (req, res, next) => {
  try {
    const { level_id } = req.query;
    let sql = 'SELECT id, level_id, combination_name FROM combinations';
    const params = [];
    if (level_id) { sql += ' WHERE level_id=?'; params.push(level_id); }
    sql += ' ORDER BY combination_name';
    const [rows] = await db.execute(sql, params);
    res.json({ data: rows });
  } catch (e) { next(e); }
};
