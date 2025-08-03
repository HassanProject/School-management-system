const express = require('express');
const {
  enterScore,
  getStudentScores,
  getClassScores,
  generateReportCard
} = require('../controllers/scoreController');
const { authenticateToken, requireTeacher, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All score routes require authentication
router.use(authenticateToken);

// Enter or update score (Teachers and Admins)
router.post('/enter', requireTeacher, enterScore);

// Get student scores for a specific term (Teachers and Admins)
router.get('/student/:studentId/term/:term/year/:year', requireTeacher, getStudentScores);

// Get class scores with rankings (Teachers and Admins)
router.get('/class/:classId/term/:term/year/:year', requireTeacher, getClassScores);

// Generate comprehensive report card (Teachers and Admins)
router.get('/report/:studentId/term/:term/year/:year', requireTeacher, generateReportCard);

module.exports = router;
