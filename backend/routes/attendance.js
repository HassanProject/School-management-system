const express = require('express');
const {
  markAttendance,
  markBulkAttendance,
  getClassAttendance,
  getStudentAttendanceSummary,
  getClassAttendanceReport
} = require('../controllers/attendanceController');
const { authenticateToken, requireTeacher, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All attendance routes require authentication
router.use(authenticateToken);

// Mark individual student attendance (Teachers and Admins)
router.post('/mark', requireTeacher, markAttendance);

// Mark bulk attendance for a class (Teachers and Admins)
router.post('/bulk', requireTeacher, markBulkAttendance);

// Get attendance for a specific class and date (Teachers and Admins)
router.get('/class/:classId/date/:date', requireTeacher, getClassAttendance);

// Get student attendance summary (Teachers and Admins)
router.get('/student/:studentId/summary', requireTeacher, getStudentAttendanceSummary);

// Get class attendance report (Teachers and Admins)
router.get('/class/:classId/report', requireTeacher, getClassAttendanceReport);

module.exports = router;
