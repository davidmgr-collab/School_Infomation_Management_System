require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./config/db');
const routes = require('./routes');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error.' });
});

const PORT = Number(process.env.PORT || 5000);
(async () => {
  try {
    await db.query('SELECT 1');
    console.log('Database connected successfully.');
    app.listen(PORT, () => console.log(`SIMS API running at http://localhost:${PORT}/api`));
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
})();
