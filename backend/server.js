const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

// Import routes
// ============================================================================
// ROUTE IMPORTS
// ============================================================================
// Import all route modules for different API endpoints

const authRoutes = require('./routes/auth');           // Authentication & user management
const studentRoutes = require('./routes/students');   // Student CRUD operations
const classRoutes = require('./routes/classes');      // Class management
const attendanceRoutes = require('./routes/attendance'); // Attendance tracking
const subjectRoutes = require('./routes/subjects');   // Subject management
const scoreRoutes = require('./routes/scores');       // Score entry & report cards
const testDataRoutes = require('./routes/testData');  // Development test data

const userRoutes = require('./routes/users');





// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (THESE MUST BE AFTER app IS CREATED)
// ============================================================================
// API ROUTES CONFIGURATION
// ============================================================================
// All routes are prefixed with their respective paths and include middleware
// for authentication, validation, and error handling

// Authentication routes - handles user registration, login, and profile management
// Endpoints: POST /api/auth/register, POST /api/auth/login, GET /api/auth/profile
app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

// Student management routes - CRUD operations for student records
// Endpoints: GET /api/students, POST /api/students, PUT /api/students/:id, DELETE /api/students/:id
// Includes student search by ID functionality
app.use('/api/students', studentRoutes);

// Class management routes - handles class creation, assignment, and management
// Endpoints: GET /api/classes, POST /api/classes, PUT /api/classes/:id, DELETE /api/classes/:id
app.use('/api/classes', classRoutes);

// Attendance tracking routes - daily attendance marking and reporting
// Endpoints: POST /api/attendance/mark, GET /api/attendance/class/:classId, GET /api/attendance/student/:studentId
app.use('/api/attendance', attendanceRoutes);

// Subject management routes - handles academic subjects (Math, English, etc.)
// Endpoints: GET /api/subjects, POST /api/subjects, PUT /api/subjects/:id, DELETE /api/subjects/:id
// Admin-only for create/update/delete, Teachers can view
app.use('/api/subjects', subjectRoutes);

// Score entry and report card routes - core academic functionality
// Endpoints: POST /api/scores/enter, GET /api/scores/student/:id/term/:term/year/:year
// GET /api/scores/class/:classId/term/:term/year/:year, GET /api/scores/report/:studentId/term/:term/year/:year
// Includes automatic grade calculation and mandatory position ranking
app.use('/api/scores', scoreRoutes);

// Test data routes - development helper endpoints for creating sample data
// Endpoints: POST /api/test-data/create, GET /api/test-data/ids
// Admin-only, used for testing and development purposes
app.use('/api/test-data', testDataRoutes);




// Basic route to test server
app.get('/', (req, res) => {
  res.json({ message: 'School Management System API is running!' });
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ message: 'Database connection successful!' });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
