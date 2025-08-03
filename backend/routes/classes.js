const express = require('express');
const { createClass, getAllClasses } = require('../controllers/classController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(authenticateToken);

router.get('/', getAllClasses);
router.post('/', requireAdmin, createClass);

module.exports = router;
