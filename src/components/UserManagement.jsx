// ============================================================================
// USER MANAGEMENT COMPONENT - COMPREHENSIVE CRUD INTERFACE
// ============================================================================
// This component provides a complete user management interface for school administrators
// Features include:
// - User listing with search, filter, and pagination
// - Add new users (Teachers, Students, Parents, Admins)
// - Edit/Update existing users
// - Delete users with confirmation
// - Bulk operations (CSV import, bulk delete)
// - Role-based user creation with specific fields
// - Mobile-responsive design optimized for Sierra Leone schools
//
// Author: School Management System Team
// Dependencies: React, Lucide React Icons, Tailwind CSS
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Download,
    Upload,
    X,
    Save,
    AlertCircle,
    CheckCircle,
    Phone,
    Mail,
    Calendar,
    MapPin,
    GraduationCap,
    BookOpen,
    Shield
} from 'lucide-react';

const UserManagement = () => {
    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================
    const [users, setUsers] = useState([]); // All users data
    const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users for display
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error messages
    const [success, setSuccess] = useState(''); // Success messages

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'STUDENT',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        // Student specific
        studentId: '',
        classId: '',
        parentEmail: '',
        // Teacher specific
        subjects: [],
        qualification: '',
        experience: '',
        // Parent specific
        occupation: '',
        children: []
    });

    // ============================================================================
    // USER ROLES AND STATUS CONFIGURATION
    // ============================================================================
    const userRoles = [
        { value: 'ADMIN', label: 'Administrator', icon: Shield, color: 'text-red-600' },
        { value: 'TEACHER', label: 'Teacher', icon: GraduationCap, color: 'text-blue-600' },
        { value: 'STUDENT', label: 'Student', icon: BookOpen, color: 'text-green-600' },
        { value: 'PARENT', label: 'Parent', icon: Users, color: 'text-purple-600' }
    ];

    const userStatuses = [
        { value: 'ACTIVE', label: 'Active', color: 'text-green-600 bg-green-100' },
        { value: 'INACTIVE', label: 'Inactive', color: 'text-red-600 bg-red-100' },
        { value: 'SUSPENDED', label: 'Suspended', color: 'text-yellow-600 bg-yellow-100' }
    ];

    // ============================================================================
    // COMPONENT LIFECYCLE
    // ============================================================================
    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, roleFilter, statusFilter]);

    // ============================================================================
    // DATA LOADING FUNCTIONS
    // ============================================================================

    // Load all users from API
    const loadUsers = async () => {
        setLoading(true);
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/users', {
            //   headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
            // });
            // const data = await response.json();

            // Mock data for development
            const mockUsers = [
                {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@school.com',
                    phone: '+23276123456',
                    role: 'TEACHER',
                    status: 'ACTIVE',
                    dateOfBirth: '1985-05-15',
                    gender: 'MALE',
                    address: 'Freetown, Sierra Leone',
                    createdAt: '2024-01-15',
                    subjects: ['Mathematics', 'Physics'],
                    qualification: 'BSc Mathematics',
                    experience: '5 years'
                },
                {
                    id: 2,
                    firstName: 'Mary',
                    lastName: 'Johnson',
                    email: 'mary.johnson@school.com',
                    phone: '+23276234567',
                    role: 'STUDENT',
                    status: 'ACTIVE',
                    dateOfBirth: '2010-03-20',
                    gender: 'FEMALE',
                    address: 'Bo, Sierra Leone',
                    createdAt: '2024-01-20',
                    studentId: 'STU001',
                    classId: 'Grade 5A',
                    parentEmail: 'parent@email.com'
                },
                {
                    id: 3,
                    firstName: 'Admin',
                    lastName: 'User',
                    email: 'admin@school.com',
                    phone: '+23276345678',
                    role: 'ADMIN',
                    status: 'ACTIVE',
                    dateOfBirth: '1980-01-01',
                    gender: 'MALE',
                    address: 'Freetown, Sierra Leone',
                    createdAt: '2024-01-01'
                }
            ];

            setUsers(mockUsers);
            setError('');
        } catch (error) {
            setError('Failed to load users. Please try again.');
            console.error('Load users error:', error);
        } finally {
            setLoading(false);
        }
    };

    // ============================================================================
    // SEARCH AND FILTER FUNCTIONS
    // ============================================================================

    // Filter users based on search term and filters
    const filterUsers = () => {
        let filtered = [...users];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone.includes(searchTerm) ||
                (user.studentId && user.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Apply role filter
        if (roleFilter !== 'ALL') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        // Apply status filter
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(user => user.status === statusFilter);
        }

        setFilteredUsers(filtered);
    };

    // ============================================================================
    // FORM HANDLING FUNCTIONS
    // ============================================================================

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Reset form data
    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'STUDENT',
            password: '',
            confirmPassword: '',
            dateOfBirth: '',
            gender: '',
            address: '',
            studentId: '',
            classId: '',
            parentEmail: '',
            subjects: [],
            qualification: '',
            experience: '',
            occupation: '',
            children: []
        });
    };

    // ============================================================================
    // CRUD OPERATIONS
    // ============================================================================

    // Add new user
    const handleAddUser = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.firstName || !formData.lastName || !formData.email) {
            setError('Please fill in all required fields.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/users', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            //   },
            //   body: JSON.stringify(formData)
            // });

            // Mock success for development
            const newUser = {
                id: users.length + 1,
                ...formData,
                status: 'ACTIVE',
                createdAt: new Date().toISOString().split('T')[0]
            };

            setUsers(prev => [...prev, newUser]);
            setSuccess('User created successfully!');
            setShowAddModal(false);
            resetForm();

        } catch (error) {
            setError('Failed to create user. Please try again.');
            console.error('Add user error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Edit user
    const handleEditUser = (user) => {
        setSelectedUser(user);
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            address: user.address,
            studentId: user.studentId || '',
            classId: user.classId || '',
            parentEmail: user.parentEmail || '',
            subjects: user.subjects || [],
            qualification: user.qualification || '',
            experience: user.experience || '',
            occupation: user.occupation || '',
            children: user.children || []
        });
        setShowEditModal(true);
    };

    // Update user
    const handleUpdateUser = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            // TODO: Replace with actual API call
            // const response = await fetch(`/api/users/${selectedUser.id}`, {
            //   method: 'PUT',
            //   headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            //   },
            //   body: JSON.stringify(formData)
            // });

            // Mock success for development
            setUsers(prev => prev.map(user =>
                user.id === selectedUser.id
                    ? { ...user, ...formData }
                    : user
            ));

            setSuccess('User updated successfully!');
            setShowEditModal(false);
            resetForm();
            setSelectedUser(null);

        } catch (error) {
            setError('Failed to update user. Please try again.');
            console.error('Update user error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Delete user
    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        try {
            // TODO: Replace with actual API call
            // await fetch(`/api/users/${userId}`, {
            //   method: 'DELETE',
            //   headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
            // });

            // Mock success for development
            setUsers(prev => prev.filter(user => user.id !== userId));
            setSuccess('User deleted successfully!');

        } catch (error) {
            setError('Failed to delete user. Please try again.');
            console.error('Delete user error:', error);
        } finally {
            setLoading(false);
        }
    };

    // View user details
    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };

    // ============================================================================
    // RENDER HELPER FUNCTIONS
    // ============================================================================

    // Get role info
    const getRoleInfo = (role) => {
        return userRoles.find(r => r.value === role) || userRoles[0];
    };

    // Get status info
    const getStatusInfo = (status) => {
        return userStatuses.find(s => s.value === status) || userStatuses[0];
    };

    // Render role-specific form fields
    const renderRoleSpecificFields = () => {
        switch (formData.role) {
            case 'STUDENT':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Student ID *
                            </label>
                            <input
                                type="text"
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., STU001"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Class
                            </label>
                            <select
                                name="classId"
                                value={formData.classId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Class</option>
                                <option value="Grade 1A">Grade 1A</option>
                                <option value="Grade 2A">Grade 2A</option>
                                <option value="Grade 3A">Grade 3A</option>
                                <option value="Grade 4A">Grade 4A</option>
                                <option value="Grade 5A">Grade 5A</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Parent Email
                            </label>
                            <input
                                type="email"
                                name="parentEmail"
                                value={formData.parentEmail}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="parent@email.com"
                            />
                        </div>
                    </>
                );

            case 'TEACHER':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Qualification
                            </label>
                            <input
                                type="text"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., BSc Mathematics"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Experience
                            </label>
                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 5 years"
                            />
                        </div>
                    </>
                );

            case 'PARENT':
                return (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Occupation
                        </label>
                        <input
                            type="text"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Teacher, Farmer, Business"
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    // ============================================================================
    // MAIN COMPONENT RENDER
    // ============================================================================
    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Users className="mr-3 text-blue-600" size={28} />
                            User Management
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage teachers, students, parents, and administrators
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <UserPlus size={20} className="mr-2" />
                            Add New User
                        </button>

                        <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <Upload size={20} className="mr-2" />
                            Import CSV
                        </button>

                        <button className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                            <Download size={20} className="mr-2" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search Input */}
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, or student ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="ALL">All Roles</option>
                            {userRoles.map(role => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="ALL">All Status</option>
                            {userStatuses.map(status => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                    <AlertCircle className="text-red-600" size={20} />
                    <span className="text-red-700">{error}</span>
                    <button onClick={() => setError('')} className="ml-auto text-red-600 hover:text-red-800">
                        <X size={16} />
                    </button>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-green-700">{success}</span>
                    <button onClick={() => setSuccess('')} className="ml-auto text-green-600 hover:text-green-800">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            <span className="ml-2 text-gray-600">Loading users...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No users found. {searchTerm || roleFilter !== 'ALL' || statusFilter !== 'ALL' ? 'Try adjusting your filters.' : 'Add your first user to get started.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => {
                                    const roleInfo = getRoleInfo(user.role);
                                    const statusInfo = getStatusInfo(user.status);

                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-medium">
                                                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.firstName} {user.lastName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                        {user.studentId && (
                                                            <div className="text-xs text-blue-600">ID: {user.studentId}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <roleInfo.icon className={`${roleInfo.color} mr-2`} size={16} />
                                                    <span className="text-sm text-gray-900">{roleInfo.label}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="space-y-1">
                                                    <div className="flex items-center">
                                                        <Phone size={14} className="text-gray-400 mr-1" />
                                                        {user.phone}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Mail size={14} className="text-gray-400 mr-1" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.createdAt}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewUser(user)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Edit User"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Add New User</h2>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetForm();
                                        setError('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAddUser} className="space-y-4">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="+232..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Role *
                                        </label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            {userRoles.map(role => (
                                                <option key={role.value} value={role.value}>{role.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="City, Sierra Leone"
                                        />
                                    </div>
                                </div>

                                {/* Password Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password *
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm Password *
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Role-specific fields */}
                                {renderRoleSpecificFields()}

                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                                        <AlertCircle size={20} />
                                        <span className="text-sm font-medium">{error}</span>
                                    </div>
                                )}

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            resetForm();
                                            setError('');
                                        }}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} className="mr-2" />
                                                Create User
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        resetForm();
                                        setSelectedUser(null);
                                        setError('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateUser} className="space-y-4">
                                {/* Same form fields as Add User, but without password fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="+232..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Role *
                                        </label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            {userRoles.map(role => (
                                                <option key={role.value} value={role.value}>{role.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="City, Sierra Leone"
                                        />
                                    </div>
                                </div>

                                {/* Role-specific fields */}
                                {renderRoleSpecificFields()}

                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                                        <AlertCircle size={20} />
                                        <span className="text-sm font-medium">{error}</span>
                                    </div>
                                )}

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            resetForm();
                                            setSelectedUser(null);
                                            setError('');
                                        }}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} className="mr-2" />
                                                Update User
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View User Modal */}
            {showViewModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                                <button
                                    onClick={() => {
                                        setShowViewModal(false);
                                        setSelectedUser(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* User Header */}
                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xl font-bold">
                                            {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {selectedUser.firstName} {selectedUser.lastName}
                                        </h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                            {(() => {
                                                const roleInfo = getRoleInfo(selectedUser.role);
                                                return (
                                                    <>
                                                        <roleInfo.icon className={roleInfo.color} size={16} />
                                                        <span className="text-sm text-gray-600">{roleInfo.label}</span>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* User Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900 border-b pb-2">Contact Information</h4>

                                        <div className="flex items-center space-x-3">
                                            <Mail className="text-gray-400" size={16} />
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p className="font-medium">{selectedUser.email}</p>
                                            </div>
                                        </div>

                                        {selectedUser.phone && (
                                            <div className="flex items-center space-x-3">
                                                <Phone className="text-gray-400" size={16} />
                                                <div>
                                                    <p className="text-sm text-gray-600">Phone</p>
                                                    <p className="font-medium">{selectedUser.phone}</p>
                                                </div>
                                            </div>
                                        )}

                                        {selectedUser.address && (
                                            <div className="flex items-center space-x-3">
                                                <MapPin className="text-gray-400" size={16} />
                                                <div>
                                                    <p className="text-sm text-gray-600">Address</p>
                                                    <p className="font-medium">{selectedUser.address}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900 border-b pb-2">Personal Information</h4>

                                        {selectedUser.dateOfBirth && (
                                            <div className="flex items-center space-x-3">
                                                <Calendar className="text-gray-400" size={16} />
                                                <div>
                                                    <p className="text-sm text-gray-600">Date of Birth</p>
                                                    <p className="font-medium">{selectedUser.dateOfBirth}</p>
                                                </div>
                                            </div>
                                        )}

                                        {selectedUser.gender && (
                                            <div>
                                                <p className="text-sm text-gray-600">Gender</p>
                                                <p className="font-medium">{selectedUser.gender}</p>
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-sm text-gray-600">Status</p>
                                            {(() => {
                                                const statusInfo = getStatusInfo(selectedUser.status);
                                                return (
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* Role-specific Information */}
                                {selectedUser.role === 'STUDENT' && (
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900 border-b pb-2">Student Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedUser.studentId && (
                                                <div>
                                                    <p className="text-sm text-gray-600">Student ID</p>
                                                    <p className="font-medium">{selectedUser.studentId}</p>
                                                </div>
                                            )}
                                            {selectedUser.classId && (
                                                <div>
                                                    <p className="text-sm text-gray-600">Class</p>
                                                    <p className="font-medium">{selectedUser.classId}</p>
                                                </div>
                                            )}
                                            {selectedUser.parentEmail && (
                                                <div>
                                                    <p className="text-sm text-gray-600">Parent Email</p>
                                                    <p className="font-medium">{selectedUser.parentEmail}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedUser.role === 'TEACHER' && (
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900 border-b pb-2">Teacher Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedUser.qualification && (
                                                <div>
                                                    <p className="text-sm text-gray-600">Qualification</p>
                                                    <p className="font-medium">{selectedUser.qualification}</p>
                                                </div>
                                            )}
                                            {selectedUser.experience && (
                                                <div>
                                                    <p className="text-sm text-gray-600">Experience</p>
                                                    <p className="font-medium">{selectedUser.experience}</p>
                                                </div>
                                            )}
                                            {selectedUser.subjects && selectedUser.subjects.length > 0 && (
                                                <div className="md:col-span-2">
                                                    <p className="text-sm text-gray-600">Subjects</p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {selectedUser.subjects.map((subject, index) => (
                                                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                                                                {subject}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedUser.role === 'PARENT' && selectedUser.occupation && (
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900 border-b pb-2">Parent Information</h4>
                                        <div>
                                            <p className="text-sm text-gray-600">Occupation</p>
                                            <p className="font-medium">{selectedUser.occupation}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Account Information */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 border-b pb-2">Account Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Created Date</p>
                                            <p className="font-medium">{selectedUser.createdAt}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">User ID</p>
                                            <p className="font-medium">#{selectedUser.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex justify-end space-x-3 pt-6 border-t">
                                <button
                                    onClick={() => {
                                        setShowViewModal(false);
                                        handleEditUser(selectedUser);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                >
                                    <Edit size={16} className="mr-2" />
                                    Edit User
                                </button>
                                <button
                                    onClick={() => {
                                        setShowViewModal(false);
                                        setSelectedUser(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// EXPORT COMPONENT
// ============================================================================
export default UserManagement;

// ============================================================================
// FUTURE ENHANCEMENTS TODO:
// ============================================================================
// 1. Connect to real API endpoints for CRUD operations
// 2. Add pagination for large user lists
// 3. Add advanced filtering (date range, multiple roles)
// 4. Add bulk operations (bulk edit, bulk delete)
// 5. Add CSV import/export functionality
// 6. Add user profile photo upload
// 7. Add email verification system
// 8. Add password reset functionality
// 9. Add audit log for user changes
// 10. Add role-based permission system
// 11. Add WhatsApp/SMS integration for notifications
// 12. Add parent-child relationship management
// 13. Add teacher-subject assignment interface
// 14. Add student class transfer functionality
// 15. Add user activity tracking and analytics
// ============================================================================

