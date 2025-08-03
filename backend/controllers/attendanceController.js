const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mark attendance for a single student
const markAttendance = async (req, res) => {
  try {
    const { studentId, classId, date, status } = req.body;

    // Validate required fields
    if (!studentId || !classId || !date || !status) {
      return res.status(400).json({ error: 'Student ID, class ID, date, and status are required' });
    }

    // Validate status
    const validStatuses = ['PRESENT', 'ABSENT', 'LATE'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status must be PRESENT, ABSENT, or LATE' });
    }

    // Check if student exists and belongs to the class
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: { class: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (student.classId !== classId) {
      return res.status(400).json({ error: 'Student does not belong to this class' });
    }

    // Check if attendance already exists for this date
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        studentId_date: {
          studentId,
          date: new Date(date)
        }
      }
    });

    let attendance;
    if (existingAttendance) {
      // Update existing attendance
      attendance = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: { status },
        include: {
          student: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });
    } else {
      // Create new attendance record
      attendance = await prisma.attendance.create({
        data: {
          studentId,
          classId,
          date: new Date(date),
          status
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });
    }

    res.json({
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
};

// Mark attendance for multiple students (bulk operation)
const markBulkAttendance = async (req, res) => {
  try {
    const { classId, date, attendanceRecords } = req.body;

    // Validate required fields
    if (!classId || !date || !attendanceRecords || !Array.isArray(attendanceRecords)) {
      return res.status(400).json({ error: 'Class ID, date, and attendance records array are required' });
    }

    // Validate each attendance record
    for (const record of attendanceRecords) {
      if (!record.studentId || !record.status) {
        return res.status(400).json({ error: 'Each attendance record must have studentId and status' });
      }
      
      const validStatuses = ['PRESENT', 'ABSENT', 'LATE'];
      if (!validStatuses.includes(record.status)) {
        return res.status(400).json({ error: 'Status must be PRESENT, ABSENT, or LATE' });
      }
    }

    // Process attendance records in a transaction
    const results = await prisma.$transaction(async (prisma) => {
      const attendanceResults = [];

      for (const record of attendanceRecords) {
        // Check if attendance already exists
        const existingAttendance = await prisma.attendance.findUnique({
          where: {
            studentId_date: {
              studentId: record.studentId,
              date: new Date(date)
            }
          }
        });

        let attendance;
        if (existingAttendance) {
          // Update existing attendance
          attendance = await prisma.attendance.update({
            where: { id: existingAttendance.id },
            data: { status: record.status }
          });
        } else {
          // Create new attendance record
          attendance = await prisma.attendance.create({
            data: {
              studentId: record.studentId,
              classId,
              date: new Date(date),
              status: record.status
            }
          });
        }

        attendanceResults.push(attendance);
      }

      return attendanceResults;
    });

    res.json({
      message: `Attendance marked for ${results.length} students`,
      attendanceRecords: results
    });
  } catch (error) {
    console.error('Bulk attendance error:', error);
    res.status(500).json({ error: 'Failed to mark bulk attendance' });
  }
};

// Get attendance for a specific class and date
const getClassAttendance = async (req, res) => {
  try {
    const { classId, date } = req.params;

    // Get all students in the class
    const students = await prisma.studentProfile.findMany({
      where: { classId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        attendances: {
          where: {
            date: new Date(date)
          }
        }
      },
      orderBy: {
        user: {
          firstName: 'asc'
        }
      }
    });

    // Format the response
    const attendanceData = students.map(student => ({
      studentId: student.id,
      studentName: `${student.user.firstName} ${student.user.lastName}`,
      studentNumber: student.studentId,
      status: student.attendances.length > 0 ? student.attendances[0].status : null,
      marked: student.attendances.length > 0
    }));

    res.json({
      classId,
      date,
      totalStudents: students.length,
      markedAttendance: attendanceData.filter(s => s.marked).length,
      attendanceData
    });
  } catch (error) {
    console.error('Get class attendance error:', error);
    res.status(500).json({ error: 'Failed to get class attendance' });
  }
};

// Get attendance summary for a student
const getStudentAttendanceSummary = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    // Get student attendance records
    const attendances = await prisma.attendance.findMany({
      where: {
        studentId,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
      },
      orderBy: {
        date: 'desc'
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    // Calculate summary statistics
    const totalDays = attendances.length;
    const presentDays = attendances.filter(a => a.status === 'PRESENT').length;
    const absentDays = attendances.filter(a => a.status === 'ABSENT').length;
    const lateDays = attendances.filter(a => a.status === 'LATE').length;
    const attendancePercentage = totalDays > 0 ? ((presentDays + lateDays) / totalDays * 100).toFixed(1) : 0;

    res.json({
      studentInfo: attendances.length > 0 ? {
        name: `${attendances[0].student.user.firstName} ${attendances[0].student.user.lastName}`,
        studentNumber: attendances[0].student.studentId
      } : null,
      summary: {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        attendancePercentage: `${attendancePercentage}%`
      },
      attendanceRecords: attendances.map(a => ({
        date: a.date,
        status: a.status,
        createdAt: a.createdAt
      }))
    });
  } catch (error) {
    console.error('Get student attendance summary error:', error);
    res.status(500).json({ error: 'Failed to get attendance summary' });
  }
};

// Get attendance report for a class over a period
const getClassAttendanceReport = async (req, res) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    // Get class information
    const classInfo = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!classInfo) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Get all students in the class with their attendance
    const students = await prisma.studentProfile.findMany({
      where: { classId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        attendances: {
          where: {
            ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
          },
          orderBy: {
            date: 'asc'
          }
        }
      },
      orderBy: {
        user: {
          firstName: 'asc'
        }
      }
    });

    // Calculate statistics for each student
    const studentReports = students.map(student => {
      const totalDays = student.attendances.length;
      const presentDays = student.attendances.filter(a => a.status === 'PRESENT').length;
      const absentDays = student.attendances.filter(a => a.status === 'ABSENT').length;
      const lateDays = student.attendances.filter(a => a.status === 'LATE').length;
      const attendancePercentage = totalDays > 0 ? ((presentDays + lateDays) / totalDays * 100).toFixed(1) : 0;

      return {
        studentId: student.id,
        studentName: `${student.user.firstName} ${student.user.lastName}`,
        studentNumber: student.studentId,
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        attendancePercentage: `${attendancePercentage}%`
      };
    });

    // Calculate class-wide statistics
    const totalStudents = students.length;
    const totalPossibleAttendance = studentReports.reduce((sum, s) => sum + s.totalDays, 0);
    const totalPresent = studentReports.reduce((sum, s) => sum + s.presentDays, 0);
    const totalAbsent = studentReports.reduce((sum, s) => sum + s.absentDays, 0);
    const totalLate = studentReports.reduce((sum, s) => sum + s.lateDays, 0);
    const classAttendancePercentage = totalPossibleAttendance > 0 ? 
      ((totalPresent + totalLate) / totalPossibleAttendance * 100).toFixed(1) : 0;

    res.json({
      classInfo: {
        name: classInfo.name,
        year: classInfo.year,
        teacher: classInfo.teacher ? 
          `${classInfo.teacher.user.firstName} ${classInfo.teacher.user.lastName}` : 'No teacher assigned'
      },
      reportPeriod: {
        startDate: startDate || 'All time',
        endDate: endDate || 'All time'
      },
      classSummary: {
        totalStudents,
        totalPossibleAttendance,
        totalPresent,
        totalAbsent,
        totalLate,
        classAttendancePercentage: `${classAttendancePercentage}%`
      },
      studentReports
    });
  } catch (error) {
    console.error('Get class attendance report error:', error);
    res.status(500).json({ error: 'Failed to generate attendance report' });
  }
};

module.exports = {
  markAttendance,
  markBulkAttendance,
  getClassAttendance,
  getStudentAttendanceSummary,
  getClassAttendanceReport
};
