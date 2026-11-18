
const express = require('express');

const auth = require('../controllers/authController');
const students = require('../controllers/studentController');
const academic = require('../controllers/academicController');
const attendance = require('../controllers/attendanceController');
const materialsChecking = require('../controllers/materialsCheckingController');
const users = require('../controllers/userController');

const {
  authenticate,
  allowRoles
} = require('../middleware/auth');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SIMS API is running.'
  });
});

// Authentication
router.post('/auth/login', auth.login);
router.get('/auth/profile', authenticate, auth.profile);

// Students
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

// Academic information
router.get('/academic/years', academic.years);
router.get('/academic/terms', academic.terms);
router.get('/academic/levels', academic.levels);
router.get('/academic/combinations', academic.combinations);

// Attendance
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

// Materials checking
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

// Users
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
