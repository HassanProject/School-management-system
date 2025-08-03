const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../utils/auth');

const prisma = new PrismaClient();

// Create comprehensive test data
const createTestData = async (req, res) => {
  try {
    // Check if test data already exists
    let testClass = await prisma.class.findFirst({
      where: { name: 'Grade 5A' }
    });

    // Create class only if it doesn't exist
    if (!testClass) {
      testClass = await prisma.class.create({
        data: {
          name: 'Grade 5A',
          year: 2025
        }
      });
    }

    // Check if teacher already exists
    let teacherUser = await prisma.user.findFirst({
      where: { email: 'teacher@school.com' }
    });

    let teacherProfile;
    if (!teacherUser) {
      // Create teacher user
      teacherUser = await prisma.user.create({
        data: {
          email: 'teacher@school.com',
          password: await hashPassword('teacher123'),
          role: 'TEACHER',
          firstName: 'John',
          lastName: 'Teacher',
          phone: '+23276654321'
        }
      });

      // Create teacher profile
      teacherProfile = await prisma.teacherProfile.create({
        data: {
          userId: teacherUser.id
        }
      });
    } else {
      // Get existing teacher profile
      teacherProfile = await prisma.teacherProfile.findFirst({
        where: { userId: teacherUser.id }
      });
    }

    // Update class with teacher if not already assigned
    if (!testClass.teacherId) {
      await prisma.class.update({
        where: { id: testClass.id },
        data: { teacherId: teacherProfile.id }
      });
    }

    // Create student users and profiles (check if they exist first)
   const students = [];
for (let i = 1; i <= 3; i++) {
  let studentUser = await prisma.user.findFirst({
    where: { email: `student${i}@school.com` }
  });

  let studentProfile;
  if (!studentUser) {
    // Create new student user
    studentUser = await prisma.user.create({
      data: {
        email: `student${i}@school.com`,
        password: await hashPassword('student123'),
        role: 'STUDENT',
        firstName: `Student${i}`,
        lastName: 'Test',
        phone: `+2327698765${i}`
      }
    });

    // Create new student profile
    studentProfile = await prisma.studentProfile.create({
      data: {
        userId: studentUser.id,
        studentId: `STU00${i}`,
        dateOfBirth: new Date('2010-01-01'),
        gender: i % 2 === 0 ? 'FEMALE' : 'MALE',
        classId: testClass.id,
        year: 2025
      }
    });
  } else {
    // Get existing student profile by userId OR by studentId
    studentProfile = await prisma.studentProfile.findFirst({
      where: { 
        OR: [
          { userId: studentUser.id },
          { studentId: `STU00${i}` }
        ]
      }
    });

    // Only create profile if it truly doesn't exist
    if (!studentProfile) {
      studentProfile = await prisma.studentProfile.create({
        data: {
          userId: studentUser.id,
          studentId: `STU00${i}`,
          dateOfBirth: new Date('2010-01-01'),
          gender: i % 2 === 0 ? 'FEMALE' : 'MALE',
          classId: testClass.id,
          year: 2025
        }
      });
    }
  }

  students.push(studentProfile);
}



    res.json({
      message: 'Test data created/verified successfully!',
      data: {
        class: testClass,
        teacher: {
          user: teacherUser,
          profile: teacherProfile
        },
        students: students
      }
    });

  } catch (error) {
    console.error('Create test data error:', error);
    res.status(500).json({ error: 'Failed to create test data', details: error.message });
  }
};


// Get test data IDs for the frontend
const getTestDataIds = async (req, res) => {
  try {
    const teacher = await prisma.teacherProfile.findFirst({
      include: { user: true }
    });
    
    const students = await prisma.studentProfile.findMany({
      include: { user: true, class: true },
      take: 3
    });

    const subjects = await prisma.subject.findMany();

    res.json({
      teacherId: teacher?.id,
      students: students.map(s => ({
        id: s.id,
        name: `${s.user.firstName} ${s.user.lastName}`,
        studentId: s.studentId,
        classId: s.classId
      })),
      classId: students[0]?.classId,
      subjects: subjects.map(s => ({
        id: s.id,
        name: s.name,
        code: s.code
      }))
    });
  } catch (error) {
    console.error('Get test data error:', error);
    res.status(500).json({ error: 'Failed to get test data' });
  }
};

module.exports = {
  createTestData,
  getTestDataIds
};
