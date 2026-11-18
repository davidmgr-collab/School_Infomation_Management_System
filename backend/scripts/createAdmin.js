require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

(async () => {
  try {
    const fullName = await ask('Administrator full name: ');
    const username = await ask('Username: ');
    const email = await ask('Email (optional): ');
    const password = await ask('Password (minimum 8 characters): ');
    if (!fullName.trim() || !username.trim() || password.length < 8) {
      throw new Error('Name and username are required; password must be at least 8 characters.');
    }
    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.execute(
      `INSERT INTO users (full_name, username, email, password, role_id)
       SELECT ?, ?, ?, ?, id FROM roles WHERE role_name='admin'`,
      [fullName.trim(), username.trim(), email.trim() || null, hash]
    );
    console.log(`Administrator created. User ID: ${result.insertId}`);
  } catch (e) {
    console.error('Could not create administrator:', e.message);
  } finally {
    rl.close();
    await db.end();
  }
})();
