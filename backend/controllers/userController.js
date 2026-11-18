const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.list = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      `SELECT u.id, u.full_name, u.username, u.email, u.status, r.role_name AS role
       FROM users u JOIN roles r ON r.id=u.role_id ORDER BY u.id DESC`
    );
    res.json({ data: rows });
  } catch (e) { next(e); }
};
exports.create = async (req, res, next) => {
  try {
    const { full_name, username, email, password, role } = req.body;
    if (!full_name || !username || !password || !['admin','animation','secretary'].includes(role)) {
      return res.status(400).json({ message: 'Name, username, password and a valid role are required.' });
    }
    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.execute(
      `INSERT INTO users (full_name, username, email, password, role_id)
       SELECT ?, ?, ?, ?, id FROM roles WHERE role_name=?`,
      [full_name, username, email || null, hash, role]
    );
    res.status(201).json({ message: 'User created.', id: result.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Username or email already exists.' });
    next(e);
  }
};
exports.setStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active','inactive'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });
    if (Number(req.params.id) === req.user.id) return res.status(400).json({ message: 'You cannot deactivate your own account.' });
    const [result] = await db.execute('UPDATE users SET status=? WHERE id=?', [status, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User status updated.' });
  } catch (e) { next(e); }
};
