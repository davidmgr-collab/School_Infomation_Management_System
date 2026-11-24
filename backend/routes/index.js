
const express = require('express');

const auth = require('../controllers/authController');
const students = require('../controllers/studentController');
const academic = require('../controllers/academicController');
const attendance = require('../controllers/attendanceController');
const materialsChecking = require('../controllers/materialsCheckingController');
const tickets = require('../controllers/ticketsController');
const users = require('../controllers/userController');
const publicController = require('../controllers/publicController');

const {
  authenticate,
  allowRoles
} = require('../middleware/auth');

const router = express.Router();

// ==========================================
// HEALTH CHECK
// ==========================================

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SIMS API is running.'
  });
});

// ==========================================
// PUBLIC PARENT DASHBOARD
// Read-only endpoints (no login required)
// ==========================================

router.get(
  '/public/academic',
  publicController.academic
);

router.get(
  '/public/students',
  publicController.students
);

router.get(
  '/public/statistics',
  publicController.statistics
);

router.get(
  '/public/materials/:term_id',
  publicController.materials
);

router.get(
  '/public/tickets',
  publicController.tickets
);

// ==========================================
// AUTHENTICATION
// ==========================================

router.post('/auth/login', auth.login);

router.get(
  '/auth/profile',
  authenticate,
  auth.profile
);

// ==========================================
// STUDENTS
// ==========================================

// Existing endpoint
router.get('/students', students.list);

router.post(
  '/students',
  authenticate,
  allowRoles('admin', 'secretary'),
  students.create
);

router.put(
  '/students/:id',
  authenticate,
  allowRoles('admin', 'secretary'),
  students.update
);

router.delete(
  '/students/:id',
  authenticate,
  allowRoles('admin', 'secretary'),
  students.remove
);

// ==========================================
// ACADEMIC INFORMATION
// ==========================================

router.get('/academic/years', academic.years);

router.get('/academic/terms', academic.terms);

router.get('/academic/levels', academic.levels);

router.get('/academic/combinations', academic.combinations);

// ==========================================
// ATTENDANCE
// ==========================================

router.get(
  '/attendance',
  authenticate,
  allowRoles('admin', 'animation'),
  attendance.list
);

router.post(
  '/attendance',
  authenticate,
  allowRoles('admin', 'animation'),
  attendance.save
);

// ==========================================
// MATERIALS CHECKING
// ==========================================

router.get(
  '/materials-checking',
  authenticate,
  allowRoles('admin', 'animation'),
  materialsChecking.list
);

router.post(
  '/materials-checking',
  authenticate,
  allowRoles('admin', 'animation'),
  materialsChecking.save
);

// ==========================================
// STUDENT TICKETS
// ==========================================

router.get(
  '/tickets',
  authenticate,
  allowRoles('admin', 'animation'),
  tickets.list
);

// ==========================================
// USERS
// ==========================================

router.get(
  '/users',
  authenticate,
  allowRoles('admin'),
  users.list
);

router.post(
  '/users',
  authenticate,
  allowRoles('admin'),
  users.create
);

router.patch(
  '/users/:id/status',
  authenticate,
  allowRoles('admin'),
  users.setStatus
);

module.exports = router;
