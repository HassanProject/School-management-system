const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new student
const createStudent = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      studentId, 
      dateOfBirth, 
      gender, 
      classId, 
      year, 
      parentId 
    } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !studentId || !dateOfBirth || !gender || !classId || !year) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if student ID already exists
    const existingStudent = await prisma.studentProfile.findUnique({
      where: { studentId }
    });

    if (existingStudent) {
      return res.status(400).json({ error: 'Student ID already exists' });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Check if class exists
    const classExists = await prisma.class.findUnique({
      where: { id: classId }
    });

    if (!classExists) {
      return res.status(400).json({ error: 'Class not found' });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and student profile in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'STUDENT',
          firstName,
          lastName,
          phone
        }
      });

      // Create student profile
      const studentProfile = await prisma.studentProfile.create({
        data: {
          userId: user.id,
          studentId,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          classId,
          year,
          parentId
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              role: true,
              createdAt: true
            }
          },
          class: true,
          parent: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true,
                  email: true
                }
              }
            }
          }
        }
      });

      return studentProfile;
    });

    res.status(201).json({
      message: 'Student created successfully',
      student: result
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, classId, year, search } = req.query;
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where = {};
    if (classId) where.classId = classId;
    if (year) where.year = parseInt(year);
    if (search) {
      where.OR = [
        { studentId: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [students, total] = await Promise.all([
      prisma.studentProfile.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              createdAt: true
            }
          },
          class: true,
          parent: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true,
                  email: true
                }
              }
            }
          }
        },
      orderBy: {
  user: {
    createdAt: 'desc'
  }
}
      }),
      prisma.studentProfile.count({ where })
    ]);

    res.json({
      students,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to get students' });
  }
};

// Get student by ID (the special search feature you requested)
const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await prisma.studentProfile.findUnique({
      where: { studentId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            createdAt: true
          }
        },
        class: {
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true
                  }
                }
              }
            }
          }
        },
        parent: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                email: true
              }
            }
          }
        },
        attendances: {
          where: {
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // Current month
            }
          },
          orderBy: {
            date: 'desc'
          },
          take: 10
        },
        scores: {
          where: {
            term: 'FIRST', // Current term - you can make this dynamic
            year: new Date().getFullYear()
          },
          include: {
            subject: true
          }
        },
        feeRecords: {
          where: {
            term: 'FIRST', // Current term
            year: new Date().getFullYear()
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Calculate attendance summary
    const totalDays = student.attendances.length;
    const presentDays = student.attendances.filter(a => a.status === 'PRESENT').length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays * 100).toFixed(1) : 0;

    // Calculate fee balance
    const feeRecord = student.feeRecords[0];
    const feeBalance = feeRecord ? feeRecord.balance : 0;

    // Format response with all requested information
    const response = {
      studentInfo: {
        studentId: student.studentId,
        fullName: `${student.user.firstName} ${student.user.lastName}`,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        class: student.class.name,
        year: student.year
      },
      contactInfo: {
        email: student.user.email,
        phone: student.user.phone,
        parentContact: student.parent ? {
          name: `${student.parent.user.firstName} ${student.parent.user.lastName}`,
          phone: student.parent.user.phone,
          email: student.parent.user.email
        } : null
      },
      attendanceSummary: {
        totalDays,
        presentDays,
        absentDays: totalDays - presentDays,
        attendancePercentage: `${attendancePercentage}%`,
        recentAttendance: student.attendances.slice(0, 5)
      },
      feeStatus: {
        currentTermBalance: feeBalance,
        paymentStatus: feeBalance > 0 ? 'Outstanding' : 'Paid',
        feeRecord: feeRecord
      },
      academicRecords: {
        currentTermScores: student.scores,
        averageScore: student.scores.length > 0 
          ? (student.scores.reduce((sum, score) => sum + score.score, 0) / student.scores.length).toFixed(1)
          : 0
      },
      classInfo: {
        className: student.class.name,
        classTeacher: student.class.teacher ? {
          name: `${student.class.teacher.user.firstName} ${student.class.teacher.user.lastName}`,
          email: student.class.teacher.user.email,
          phone: student.class.teacher.user.phone
        } : null
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get student by ID error:', error);
    res.status(500).json({ error: 'Failed to get student information' });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Separate user data from student profile data
    const { email, firstName, lastName, phone, ...studentData } = updateData;

    const result = await prisma.$transaction(async (prisma) => {
      // Update user information if provided
      if (email || firstName || lastName || phone) {
        await prisma.user.update({
          where: { id: id },
          data: {
            ...(email && { email }),
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(phone && { phone })
          }
        });
      }

      // Update student profile
      const updatedStudent = await prisma.studentProfile.update({
        where: { userId: id },
        data: {
          ...studentData,
          ...(studentData.dateOfBirth && { dateOfBirth: new Date(studentData.dateOfBirth) })
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          },
          class: true,
          parent: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true,
                  email: true
                }
              }
            }
          }
        }
      });

      return updatedStudent;
    });

    res.json({
      message: 'Student updated successfully',
      student: result
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete user (this will cascade delete the student profile)
    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};
