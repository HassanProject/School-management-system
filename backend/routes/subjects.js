const express = require('express');
const {
    createSubject,
    updateSubject,
    deleteSubject
} = require('../controllers/subjectController');
const { authenticateToken, requireAdmin, requireTeacher } = require('../middleware/auth');

const router = express.Router();

// All subject routes require authentication
router.use(authenticateToken);

// Get all subjects (Teachers and Admins) - Comment out since getAllSubjects doesn't exist
// router.get('/', requireTeacher, getAllSubjects);

// Admin only routes
router.post('/', requireAdmin, createSubject);
router.put('/:id', requireAdmin, updateSubject);
router.delete('/:id', requireAdmin, deleteSubject);

module.exports = router;
