// ============================================================================
// USER MANAGEMENT CONTROLLER - COMPREHENSIVE CRUD OPERATIONS
// ============================================================================
// This controller handles all user management operations for the admin dashboard
// Supports all user types: ADMIN, TEACHER, STUDENT, PARENT
// Features:
// - Full CRUD operations (Create, Read, Update, Delete)
// - Search and filtering capabilities
// - Role-based user creation with specific fields
// - Proper authentication and authorization
// - Input validation and error handling
// - User statistics and analytics
//
// Author: School Management System Team
// Dependencies: Prisma Client, bcrypt, validation utilities
// ============================================================================

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../utils/auth');

const router = express.Router();
const prisma = new PrismaClient();

// ============================================================================
// GET ALL USERS - WITH SEARCH AND FILTERING
// ============================================================================
// Endpoint: GET /api/users
// Description: Get all users with optional search, filtering, and pagination
// Access: Admin only
const getAllUsers = async (req, res) => {
    try {
        const {
            search = '',
            role = '',
            status = '',
            page = 1,
            limit = 50
        } = req.query;

        // Build filter conditions
        const where = {};

        // Search filter - search in firstName, lastName, email, phone
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Role filter
        if (role && role !== 'ALL') {
            where.role = role;
        }

        // Status filter (if you have a status field)
        if (status && status !== 'ALL') {
            where.status = status;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Get users with related data
        const users = await prisma.user.findMany({
            where,
            skip,
            take,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                // Include profile data based on role
                studentProfile: {
                    select: {
                        studentId: true,
                        dateOfBirth: true,
                        gender: true,
                        class: {
                            select: {
                                name: true,
                                year: true
                            }
                        }
                    }
                },
                teacherProfile: {
                    select: {
                        qualification: true,
                        experience: true,
                        subjects: true
                    }
                },
                parentProfile: {
                    select: {
                        occupation: true,
                        children: {
                            select: {
                                studentId: true,
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Get total count for pagination
        const totalUsers = await prisma.user.count({ where });

        // Format response data
        const formattedUsers = users.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: 'ACTIVE', // Default status - you can add this field to your schema
            createdAt: user.createdAt.toISOString().split('T')[0],
            updatedAt: user.updatedAt.toISOString().split('T')[0],

            // Role-specific data
            ...(user.studentProfile && {
                studentId: user.studentProfile.studentId,
                dateOfBirth: user.studentProfile.dateOfBirth?.toISOString().split('T')[0],
                gender: user.studentProfile.gender,
                classId: user.studentProfile.class?.name,
                classYear: user.studentProfile.class?.year
            }),

            ...(user.teacherProfile && {
                qualification: user.teacherProfile.qualification,
                experience: user.teacherProfile.experience,
                subjects: user.teacherProfile.subjects || []
            }),

            ...(user.parentProfile && {
                occupation: user.parentProfile.occupation,
                children: user.parentProfile.children?.map(child => ({
                    studentId: child.studentId,
                    name: `${child.user.firstName} ${child.user.lastName}`
                })) || []
            })
        }));

        res.json({
            users: formattedUsers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalUsers / parseInt(limit)),
                totalUsers,
                hasMore: skip + take < totalUsers
            }
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            error: 'Failed to fetch users',
            details: error.message
        });
    }
};

// ============================================================================
// GET USER BY ID - WITH FULL DETAILS
// ============================================================================
// Endpoint: GET /api/users/:id
// Description: Get a specific user with all related data
// Access: Admin only
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                studentProfile: {
                    select: {
                        studentId: true,
                        dateOfBirth: true,
                        gender: true,
                        year: true,
                        class: {
                            select: {
                                id: true,
                                name: true,
                                year: true
                            }
                        }
                    }
                },
                teacherProfile: {
                    select: {
                        qualification: true,
                        experience: true,
                        subjects: true
                    }
                },
                parentProfile: {
                    select: {
                        occupation: true,
                        children: {
                            select: {
                                studentId: true,
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Format response
        const formattedUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: 'ACTIVE',
            createdAt: user.createdAt.toISOString().split('T')[0],
            updatedAt: user.updatedAt.toISOString().split('T')[0],

            // Role-specific data
            ...(user.studentProfile && {
                studentId: user.studentProfile.studentId,
                dateOfBirth: user.studentProfile.dateOfBirth?.toISOString().split('T')[0],
                gender: user.studentProfile.gender,
                year: user.studentProfile.year,
                classId: user.studentProfile.class?.id,
                className: user.studentProfile.class?.name
            }),

            ...(user.teacherProfile && {
                qualification: user.teacherProfile.qualification,
                experience: user.teacherProfile.experience,
                subjects: user.teacherProfile.subjects || []
            }),

            ...(user.parentProfile && {
                occupation: user.parentProfile.occupation,
                children: user.parentProfile.children?.map(child => ({
                    studentId: child.studentId,
                    name: `${child.user.firstName} ${child.user.lastName}`
                })) || []
            })
        };

        res.json({ user: formattedUser });

    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            error: 'Failed to fetch user',
            details: error.message
        });
    }
};

// ============================================================================
// CREATE NEW USER - WITH ROLE-SPECIFIC PROFILES
// ============================================================================
// Endpoint: POST /api/users
// Description: Create a new user with role-specific profile
// Access: Admin only
const createUser = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            role,
            dateOfBirth,
            gender,
            address,
            // Student specific
            studentId,
            classId,
            year,
            parentEmail,
            // Teacher specific
            qualification,
            experience,
            subjects,
            // Parent specific
            occupation
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({
                error: 'Missing required fields: firstName, lastName, email, password, role'
            });
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user with transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            // Create base user
            const newUser = await tx.user.create({
                data: {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.toLowerCase().trim(),
                    phone: phone?.trim() || null,
                    password: hashedPassword,
                    role: role.toUpperCase()
                }
            });

            // Create role-specific profile
            let profile = null;

            switch (role.toUpperCase()) {
                case 'STUDENT':
                    // Validate student-specific fields
                    if (!studentId) {
                        throw new Error('Student ID is required for student users');
                    }

                    // Check if studentId already exists
                    const existingStudent = await tx.studentProfile.findUnique({
                        where: { studentId }
                    });

                    if (existingStudent) {
                        throw new Error('Student ID already exists');
                    }

                    profile = await tx.studentProfile.create({
                        data: {
                            userId: newUser.id,
                            studentId: studentId.trim(),
                            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                            gender: gender?.toUpperCase() || null,
                            year: year || new Date().getFullYear(),
                            classId: classId ? parseInt(classId) : null
                        }
                    });
                    break;

                case 'TEACHER':
                    profile = await tx.teacherProfile.create({
                        data: {
                            userId: newUser.id,
                            qualification: qualification?.trim() || null,
                            experience: experience?.trim() || null,
                            subjects: subjects || []
                        }
                    });
                    break;

                case 'PARENT':
                    profile = await tx.parentProfile.create({
                        data: {
                            userId: newUser.id,
                            occupation: occupation?.trim() || null
                        }
                    });
                    break;

                case 'ADMIN':
                    // Admin users don't need additional profiles
                    break;

                default:
                    throw new Error('Invalid user role');
            }

            return { user: newUser, profile };
        });

        // Return success response (exclude password)
        const { password: _, ...userWithoutPassword } = result.user;

        res.status(201).json({
            message: 'User created successfully',
            user: {
                ...userWithoutPassword,
                profile: result.profile
            }
        });

    } catch (error) {
        console.error('Create user error:', error);

        if (error.message.includes('already exists') || error.message.includes('required')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({
                error: 'Failed to create user',
                details: error.message
            });
        }
    }
};

// ============================================================================
// UPDATE USER - WITH ROLE-SPECIFIC PROFILES
// ============================================================================
// Endpoint: PUT /api/users/:id
// Description: Update user and role-specific profile data
// Access: Admin only
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            firstName,
            lastName,
            email,
            phone,
            role,
            dateOfBirth,
            gender,
            address,
            // Student specific
            studentId,
            classId,
            year,
            parentEmail,
            // Teacher specific
            qualification,
            experience,
            subjects,
            // Parent specific
            occupation
        } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                studentProfile: true,
                teacherProfile: true,
                parentProfile: true
            }
        });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check email uniqueness (if email is being changed)
        if (email && email.toLowerCase() !== existingUser.email) {
            const emailExists = await prisma.user.findUnique({
                where: { email: email.toLowerCase() }
            });

            if (emailExists) {
                return res.status(400).json({ error: 'Email already exists' });
            }
        }

        // Update user with transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update base user
            const updatedUser = await tx.user.update({
                where: { id: parseInt(id) },
                data: {
                    ...(firstName && { firstName: firstName.trim() }),
                    ...(lastName && { lastName: lastName.trim() }),
                    ...(email && { email: email.toLowerCase().trim() }),
                    ...(phone !== undefined && { phone: phone?.trim() || null }),
                    ...(role && { role: role.toUpperCase() })
                }
            });

            // Update role-specific profile
            let profile = null;
            const currentRole = role?.toUpperCase() || existingUser.role;

            switch (currentRole) {
                case 'STUDENT':
                    if (existingUser.studentProfile) {
                        // Update existing student profile
                        profile = await tx.studentProfile.update({
                            where: { userId: parseInt(id) },
                            data: {
                                ...(studentId && { studentId: studentId.trim() }),
                                ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
                                ...(gender && { gender: gender.toUpperCase() }),
                                ...(year && { year: parseInt(year) }),
                                ...(classId && { classId: parseInt(classId) })
                            }
                        });
                    } else if (studentId) {
                        // Create new student profile if user role changed to student
                        profile = await tx.studentProfile.create({
                            data: {
                                userId: parseInt(id),
                                studentId: studentId.trim(),
                                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                                gender: gender?.toUpperCase() || null,
                                year: year ? parseInt(year) : new Date().getFullYear(),
                                classId: classId ? parseInt(classId) : null
                            }
                        });
                    }
                    break;

                case 'TEACHER':
                    if (existingUser.teacherProfile) {
                        // Update existing teacher profile
                        profile = await tx.teacherProfile.update({
                            where: { userId: parseInt(id) },
                            data: {
                                ...(qualification !== undefined && { qualification: qualification?.trim() || null }),
                                ...(experience !== undefined && { experience: experience?.trim() || null }),
                                ...(subjects !== undefined && { subjects: subjects || [] })
                            }
                        });
                    } else {
                        // Create new teacher profile if user role changed to teacher
                        profile = await tx.teacherProfile.create({
                            data: {
                                userId: parseInt(id),
                                qualification: qualification?.trim() || null,
                                experience: experience?.trim() || null,
                                subjects: subjects || []
                            }
                        });
                    }
                    break;

                case 'PARENT':
                    if (existingUser.parentProfile) {
                        // Update existing parent profile
                        profile = await tx.parentProfile.update({
                            where: { userId: parseInt(id) },
                            data: {
                                ...(occupation !== undefined && { occupation: occupation?.trim() || null })
                            }
                        });
                    } else {
                        // Create new parent profile if user role changed to parent
                        profile = await tx.parentProfile.create({
                            data: {
                                userId: parseInt(id),
                                occupation: occupation?.trim() || null
                            }
                        });
                    }
                    break;
            }

            return { user: updatedUser, profile };
        });

        // Return success response (exclude password)
        const { password: _, ...userWithoutPassword } = result.user;

        res.json({
            message: 'User updated successfully',
            user: {
                ...userWithoutPassword,
                profile: result.profile
            }
        });

    } catch (error) {
        console.error('Update user error:', error);

        if (error.message.includes('already exists')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({
                error: 'Failed to update user',
                details: error.message
            });
        }
    }
};

// ============================================================================
// DELETE USER - WITH CASCADE DELETE
// ============================================================================
// Endpoint: DELETE /api/users/:id
// Description: Delete user and all related data
// Access: Admin only
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                studentProfile: true,
                teacherProfile: true,
                parentProfile: true
            }
        });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent deletion of the last admin user
        if (existingUser.role === 'ADMIN') {
            const adminCount = await prisma.user.count({
                where: { role: 'ADMIN' }
            });

            if (adminCount <= 1) {
                return res.status(400).json({
                    error: 'Cannot delete the last admin user'
                });
            }
        }

        // Delete user with transaction (cascade delete will handle profiles)
        await prisma.$transaction(async (tx) => {
            // Delete related profiles first (if needed - depends on your schema constraints)
            if (existingUser.studentProfile) {
                await tx.studentProfile.delete({
                    where: { userId: parseInt(id) }
                });
            }

            if (existingUser.teacherProfile) {
                await tx.teacherProfile.delete({
                    where: { userId: parseInt(id) }
                });
            }

            if (existingUser.parentProfile) {
                await tx.parentProfile.delete({
                    where: { userId: parseInt(id) }
                });
            }

            // Delete the user
            await tx.user.delete({
                where: { id: parseInt(id) }
            });
        });

        res.json({
            message: 'User deleted successfully',
            deletedUser: {
                id: existingUser.id,
                name: `${existingUser.firstName} ${existingUser.lastName}`,
                email: existingUser.email,
                role: existingUser.role
            }
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            error: 'Failed to delete user',
            details: error.message
        });
    }
};

// ============================================================================
// GET USER STATISTICS - FOR DASHBOARD
// ============================================================================
// Endpoint: GET /api/users/stats
// Description: Get user statistics for admin dashboard
// Access: Admin only
const getUserStats = async (req, res) => {
    try {
        // Get counts by role
        const stats = await prisma.user.groupBy({
            by: ['role'],
            _count: {
                role: true
            }
        });

        // Format stats
        const formattedStats = {
            totalUsers: 0,
            admins: 0,
            teachers: 0,
            students: 0,
            parents: 0
        };

        stats.forEach(stat => {
            const count = stat._count.role;
            formattedStats.totalUsers += count;

            switch (stat.role) {
                case 'ADMIN':
                    formattedStats.admins = count;
                    break;
                case 'TEACHER':
                    formattedStats.teachers = count;
                    break;
                case 'STUDENT':
                    formattedStats.students = count;
                    break;
                case 'PARENT':
                    formattedStats.parents = count;
                    break;
            }
        });

        // Get recent users (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentUsers = await prisma.user.count({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            }
        });

        res.json({
            ...formattedStats,
            recentUsers
        });

    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            error: 'Failed to fetch user statistics',
            details: error.message
        });
    }
};

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

// GET all users with search and filtering
router.get('/', getAllUsers);

// GET user by ID
router.get('/:id', getUserById);

// POST create new user
router.post('/', createUser);

// PUT update user
router.put('/:id', updateUser);

// DELETE user
router.delete('/:id', deleteUser);

// GET user statistics
router.get('/stats/overview', getUserStats);

// ============================================================================
// EXPORT ROUTER
// ============================================================================
module.exports = router;

// ============================================================================
// FUTURE ENHANCEMENTS TODO:
// ============================================================================
// 1. Add bulk user operations (bulk create, bulk delete)
// 2. Add user import from CSV functionality
// 3. Add user export to CSV/Excel
// 4. Add user activity logging
// 5. Add password reset functionality
// 6. Add email verification system
// 7. Add user profile photo upload
// 8. Add advanced filtering (date ranges, multiple roles)
// 9. Add user status management (active, inactive, suspended)
// 10. Add parent-child relationship management
// 11. Add teacher-subject assignment
// 12. Add user permission system
// 13. Add audit trail for user changes
// 14. Add user analytics and reporting
// 15. Add WhatsApp/SMS integration for notifications
// ===========================================================================