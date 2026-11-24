
const mysql = require('mysql2/promise');

async function main() {
  let password = '';
  let connection;

  // Request password without displaying it.
  process.stdout.write('Enter your NEW Railway MySQL password: ');

  if (!process.stdin.isTTY) {
    console.log('\nPlease run this script directly in Windows CMD.');
    return;
  }

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  try {
    await new Promise((resolve, reject) => {
      process.stdin.on('data', function readPassword(key) {
        if (key === '\u0003') {
          process.stdin.removeListener('data', readPassword);
          reject(new Error('Password entry cancelled.'));
          return;
        }

        if (key === '\r' || key === '\n') {
          process.stdin.removeListener('data', readPassword);
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\n');
          resolve();
        } else if (key === '\u007f' || key === '\b') {
          password = password.slice(0, -1);
        } else {
          password += key;
        }
      });
    });

    if (!password.trim()) {
      console.log('Password was empty. Please try again.');
      return;
    }

    console.log('Connecting to Railway MySQL...');

    connection = await mysql.createConnection({
      host: 'centerbeam.proxy.rlwy.net',
      port: 36535,
      user: 'root',
      password: password,
      database: 'railway',

      // TLS encryption enabled.
      // Certificate verification is disabled for this diagnostic test.
      ssl: {
        rejectUnauthorized: false
      },

      connectTimeout: 15000
    });

    console.log('\nRailway database connected successfully!');

    const [rows] = await connection.query('SHOW TABLES');

    console.log('\nDatabase:', 'railway');
    console.log('Tables found:', rows.length);

    if (rows.length > 0) {
      console.table(rows);
    } else {
      console.log('The Railway database is empty. Ready for SIMS import.');
    }

  } catch (error) {
    console.log('\nConnection failed:', error.message);

  } finally {
    process.stdin.pause();

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }

    if (connection) {
      await connection.end();
    }

    password = '';
  }
}

main();
