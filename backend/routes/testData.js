const express = require('express');
const { createTestData, getTestDataIds } = require('../controllers/testDataController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Create test data (Admin only)
router.post('/create', authenticateToken, requireAdmin, createTestData);

// Get test data IDs for frontend
router.get('/ids', authenticateToken, requireAdmin, getTestDataIds);

module.exports = router;
