const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });

    const [rows] = await db.execute(
      `SELECT u.id, u.full_name, u.username, u.email, u.password, u.status, r.role_name
       FROM users u JOIN roles r ON r.id = u.role_id WHERE u.username = ? LIMIT 1`,
      [username.trim()]
    );
    const user = rows[0];
    if (!user || user.status !== 'active' || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      message: 'Login successful.',
      data: {
        token,
        user: { id: user.id, full_name: user.full_name, username: user.username, email: user.email, role: user.role_name }
      }
    });
  } catch (error) { next(error); }
};

exports.profile = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      `SELECT u.id, u.full_name, u.username, u.email, r.role_name AS role
       FROM users u JOIN roles r ON r.id = u.role_id WHERE u.id = ?`,
      [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'User not found.' });
    res.json({ data: rows[0] });
  } catch (error) { next(error); }
};
