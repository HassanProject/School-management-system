const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper function to calculate grade based on score
const calculateGrade = (score, maxScore = 100) => {
    const percentage = (score / maxScore) * 100;

    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
};

// Helper function to get grade points for ranking
const getGradePoints = (grade) => {
    const gradePoints = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
    return gradePoints[grade] || 0;
};

// Enter or update score for a student
const enterScore = async (req, res) => {
    try {
        const { studentId, subjectId, teacherId, term, year, score, maxScore, comments } = req.body;

        // Validate required fields
        if (!studentId || !subjectId || !teacherId || !term || !year || score === undefined) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        // Validate score
        const finalMaxScore = maxScore || 100;
        if (score < 0 || score > finalMaxScore) {
            return res.status(400).json({ error: `Score must be between 0 and ${finalMaxScore}` });
        }

        // Check if student, subject, and teacher exist
        const [student, subject, teacher] = await Promise.all([
            prisma.studentProfile.findUnique({ where: { id: studentId } }),
            prisma.subject.findUnique({ where: { id: subjectId } }),
            prisma.teacherProfile.findUnique({ where: { id: teacherId } })
        ]);

        if (!student) return res.status(404).json({ error: 'Student not found' });
        if (!subject) return res.status(404).json({ error: 'Subject not found' });
        if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

        // Calculate grade
        const grade = calculateGrade(score, finalMaxScore);

        // Check if score already exists
        const existingScore = await prisma.score.findUnique({
            where: {
                studentId_subjectId_term_year: {
                    studentId,
                    subjectId,
                    term,
                    year
                }
            }
        });

        let scoreRecord;
        if (existingScore) {
            // Update existing score
            scoreRecord = await prisma.score.update({
                where: { id: existingScore.id },
                data: {
                    score,
                    maxScore: finalMaxScore,
                    grade,
                    comments
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
                    },
                    subject: true,
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
        } else {
            // Create new score
            scoreRecord = await prisma.score.create({
                data: {
                    studentId,
                    subjectId,
                    teacherId,
                    term,
                    year,
                    score
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
                    },
                    subject: true,
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
        }

        res.json({
            message: 'Score entered successfully',
            score: scoreRecord
        });
    } catch (error) {
        console.error('Enter score error:', error);
        res.status(500).json({ error: 'Failed to enter score' });
    }
};

// Get scores for a student in a specific term
const getStudentScores = async (req, res) => {
    try {
        const { studentId, term, year } = req.params;

        const scores = await prisma.score.findMany({
            where: {
                studentId,
                term,
                year: parseInt(year)
            },
            include: {
                subject: true,
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
            },
            orderBy: {
                subject: {
                    name: 'asc'
                }
            }
        });

        // Calculate total and average
        const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
        const totalMaxScore = scores.reduce((sum, score) => sum + score.maxScore, 0);
        const average = scores.length > 0 ? (totalScore / totalMaxScore * 100).toFixed(1) : 0;
        const overallGrade = calculateGrade(parseFloat(average));

        res.json({
            studentId,
            term,
            year: parseInt(year),
            scores,
            summary: {
                totalSubjects: scores.length,
                totalScore,
                totalMaxScore,
                average: `${average}%`,
                overallGrade
            }
        });
    } catch (error) {
        console.error('Get student scores error:', error);
        res.status(500).json({ error: 'Failed to get student scores' });
    }
};

// Get class scores for a specific term with rankings
const getClassScores = async (req, res) => {
    try {
        const { classId, term, year } = req.params;

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
                scores: {
                    where: {
                        term,
                        year: parseInt(year)
                    },
                    include: {
                        subject: true
                    }
                }
            }
        });

        // Calculate totals and averages for each student
        const studentResults = students.map(student => {
            const totalScore = student.scores.reduce((sum, score) => sum + score.score, 0);
            const totalMaxScore = student.scores.reduce((sum, score) => sum + score.maxScore, 0);
            const average = student.scores.length > 0 ? (totalScore / totalMaxScore * 100) : 0;
            const overallGrade = calculateGrade(average);

            return {
                studentId: student.id,
                studentName: `${student.user.firstName} ${student.user.lastName}`,
                studentNumber: student.studentId,
                totalScore,
                totalMaxScore,
                average: parseFloat(average.toFixed(1)),
                overallGrade,
                subjectCount: student.scores.length,
                scores: student.scores
            };
        });

        // Sort by average (descending) for ranking
        studentResults.sort((a, b) => b.average - a.average);

        // Add position rankings
        studentResults.forEach((student, index) => {
            student.position = index + 1;
        });

        // Calculate class statistics
        const classAverage = studentResults.length > 0
            ? (studentResults.reduce((sum, student) => sum + student.average, 0) / studentResults.length).toFixed(1)
            : 0;

        const gradeDistribution = studentResults.reduce((dist, student) => {
            dist[student.overallGrade] = (dist[student.overallGrade] || 0) + 1;
            return dist;
        }, {});

        res.json({
            classId,
            term,
            year: parseInt(year),
            totalStudents: studentResults.length,
            classStatistics: {
                classAverage: `${classAverage}%`,
                gradeDistribution,
                highestScore: studentResults[0]?.average || 0,
                lowestScore: studentResults[studentResults.length - 1]?.average || 0
            },
            studentResults
        });
    } catch (error) {
        console.error('Get class scores error:', error);
        res.status(500).json({ error: 'Failed to get class scores' });
    }
};

// Generate comprehensive report card for a student
const generateReportCard = async (req, res) => {
    try {
        const { studentId, term, year } = req.params;

        // Get student information
        const student = await prisma.studentProfile.findUnique({
            where: { id: studentId },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                class: {
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
                }
            }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Get student scores for the term
        const scores = await prisma.score.findMany({
            where: {
                studentId,
                term,
                year: parseInt(year)
            },
            include: {
                subject: true,
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
            },
            orderBy: {
                subject: {
                    name: 'asc'
                }
            }
        });

        // Calculate student's totals
        const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
        const totalMaxScore = scores.reduce((sum, score) => sum + score.maxScore, 0);
        const average = scores.length > 0 ? (totalScore / totalMaxScore * 100) : 0;
        const overallGrade = calculateGrade(average);

        // Get class ranking
        const classStudents = await prisma.studentProfile.findMany({
            where: { classId: student.classId },
            include: {
                scores: {
                    where: {
                        term,
                        year: parseInt(year)
                    }
                }
            }
        });

        // Calculate averages for all students in class
        const classAverages = classStudents.map(classStudent => {
            const studentTotal = classStudent.scores.reduce((sum, score) => sum + score.score, 0);
            const studentMaxTotal = classStudent.scores.reduce((sum, score) => sum + score.maxScore, 0);
            const studentAverage = classStudent.scores.length > 0 ? (studentTotal / studentMaxTotal * 100) : 0;

            return {
                studentId: classStudent.id,
                average: studentAverage
            };
        });

        // Sort and find position
        classAverages.sort((a, b) => b.average - a.average);
        const position = classAverages.findIndex(s => s.studentId === studentId) + 1;
        const totalStudentsInClass = classAverages.length;

        // Get attendance summary for the term
        const attendanceRecords = await prisma.attendance.findMany({
            where: {
                studentId,
                // You might want to add date range for the specific term
            },
            orderBy: {
                date: 'desc'
            },
            take: 30 // Last 30 days
        });

        const attendanceSummary = {
            totalDays: attendanceRecords.length,
            presentDays: attendanceRecords.filter(a => a.status === 'PRESENT').length,
            absentDays: attendanceRecords.filter(a => a.status === 'ABSENT').length,
            lateDays: attendanceRecords.filter(a => a.status === 'LATE').length
        };

        attendanceSummary.attendancePercentage = attendanceSummary.totalDays > 0
            ? ((attendanceSummary.presentDays + attendanceSummary.lateDays) / attendanceSummary.totalDays * 100).toFixed(1)
            : 0;

        // Generate comprehensive report card
        const reportCard = {
            studentInfo: {
                name: `${student.user.firstName} ${student.user.lastName}`,
                studentId: student.studentId,
                class: student.class.name,
                year: student.year,
                dateOfBirth: student.dateOfBirth,
                gender: student.gender
            },
            termInfo: {
                term,
                year: parseInt(year),
                generatedDate: new Date().toISOString()
            },
            classInfo: {
                className: student.class.name,
                classTeacher: student.class.teacher
                    ? `${student.class.teacher.user.firstName} ${student.class.teacher.user.lastName}`
                    : 'Not assigned'
            },
            parentInfo: student.parent ? {
                name: `${student.parent.user.firstName} ${student.parent.user.lastName}`,
                phone: student.parent.user.phone,
                email: student.parent.user.email
            } : null,
            academicPerformance: {
                subjects: scores.map(score => ({
                    subject: score.subject.name,
                    subjectCode: score.subject.code,
                    score: score.score,
                    maxScore: score.maxScore,
                    percentage: ((score.score / score.maxScore) * 100).toFixed(1),
                    grade: score.grade,
                    teacher: `${score.teacher.user.firstName} ${score.teacher.user.lastName}`,
                    comments: score.comments
                })),
                summary: {
                    totalSubjects: scores.length,
                    totalScore,
                    totalMaxScore,
                    overallAverage: average.toFixed(1),
                    overallGrade,
                    classPosition: position,
                    totalStudentsInClass,
                    positionSuffix: getPositionSuffix(position)
                }
            },
            attendanceSummary,
            remarks: {
                academicRemarks: generateAcademicRemarks(average, position, totalStudentsInClass),
                attendanceRemarks: generateAttendanceRemarks(parseFloat(attendanceSummary.attendancePercentage)),
                generalRemarks: generateGeneralRemarks(average, parseFloat(attendanceSummary.attendancePercentage))
            }
        };

        res.json({
            message: 'Report card generated successfully',
            reportCard
        });
    } catch (error) {
        console.error('Generate report card error:', error);
        res.status(500).json({ error: 'Failed to generate report card' });
    }
};

// Helper functions for report card generation
const getPositionSuffix = (position) => {
    if (position % 10 === 1 && position % 100 !== 11) return `${position}st`;
    if (position % 10 === 2 && position % 100 !== 12) return `${position}nd`;
    if (position % 10 === 3 && position % 100 !== 13) return `${position}rd`;
    return `${position}th`;
};

const generateAcademicRemarks = (average, position, totalStudents) => {
    if (average >= 90) return 'Excellent performance! Keep up the outstanding work.';
    if (average >= 80) return 'Very good performance. Continue working hard.';
    if (average >= 70) return 'Good performance. There is room for improvement.';
    if (average >= 60) return 'Satisfactory performance. More effort needed.';
    return 'Needs significant improvement. Please seek additional support.';
};

const generateAttendanceRemarks = (attendancePercentage) => {
    if (attendancePercentage >= 95) return 'Excellent attendance record.';
    if (attendancePercentage >= 85) return 'Good attendance record.';
    if (attendancePercentage >= 75) return 'Satisfactory attendance. Improvement needed.';
    return 'Poor attendance. This affects academic performance.';
};

const generateGeneralRemarks = (average, attendancePercentage) => {
    if (average >= 80 && attendancePercentage >= 90) {
        return 'Excellent student with strong academic performance and attendance.';
    }
    if (average >= 70 && attendancePercentage >= 80) {
        return 'Good student showing consistent effort and attendance.';
    }
    if (average < 60 || attendancePercentage < 75) {
        return 'Student needs additional support and improved attendance.';
    }
    return 'Student showing steady progress. Continue encouraging effort.';
};

module.exports = {
    enterScore,
    getStudentScores,
    getClassScores,
    generateReportCard
};
