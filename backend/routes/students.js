const express = require('express');
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { authenticateToken, requireAdmin, requireTeacher } = require('../middleware/auth');

const router = express.Router();

// Public route for student search by ID (you might want to protect this later)
router.get('/search/:studentId', getStudentById);

// Protected routes - require authentication
router.use(authenticateToken);

// Admin and Teacher can view all students
router.get('/', requireTeacher, getAllStudents);

// Admin only routes
router.post('/', requireAdmin, createStudent);
router.put('/:id', requireAdmin, updateStudent);
router.delete('/:id', requireAdmin, deleteStudent);

module.exports = router;
