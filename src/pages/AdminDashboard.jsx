// ============================================================================
// ADMIN DASHBOARD - MAIN INTERFACE FOR SCHOOL ADMINISTRATORS
// ============================================================================
// This is the main dashboard for school administrators after login
// Provides access to all school management features including:
// - User Management (Teachers, Students, Parents)
// - Academic Management (Classes, Subjects, Scores)
// - Reports and Analytics
// - School Settings and Configuration
//
// Built for Sierra Leone schools with mobile-first responsive design
// Author: School Management System Team
// Dependencies: React, React Router, Lucide React Icons, Tailwind CSS
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
    Users,
    GraduationCap,
    BookOpen,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    School,
    UserPlus,
    FileText,
    Calendar,
    DollarSign,
    Bell
} from 'lucide-react';

const AdminDashboard = () => {
    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================
    const [activeSection, setActiveSection] = useState('dashboard'); // Current active section
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle
    const [userData, setUserData] = useState(null); // Current admin user data

    // ============================================================================
    // COMPONENT LIFECYCLE
    // ============================================================================
    // Load user data from localStorage on component mount
    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    // ============================================================================
    // NAVIGATION MENU CONFIGURATION
    // ============================================================================
    // Define all admin dashboard sections with icons and labels
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'students', label: 'Students', icon: GraduationCap },
        { id: 'teachers', label: 'Teachers', icon: UserPlus },
        { id: 'classes', label: 'Classes', icon: BookOpen },
        { id: 'subjects', label: 'Subjects', icon: FileText },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
        { id: 'fees', label: 'Fee Management', icon: DollarSign },
        { id: 'calendar', label: 'Academic Calendar', icon: Calendar },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'settings', label: 'School Settings', icon: Settings },
    ];

    // ============================================================================
    // EVENT HANDLERS
    // ============================================================================

    // Handle logout functionality
    const handleLogout = () => {
        // Clear authentication data from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');

        // Redirect to login page (will be handled by parent component)
        window.location.reload();
    };

    // Handle sidebar toggle for mobile devices
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Handle menu item selection
    const handleMenuClick = (sectionId) => {
        setActiveSection(sectionId);
        setSidebarOpen(false); // Close mobile sidebar after selection
    };

    // ============================================================================
    // DASHBOARD STATISTICS CARDS
    // ============================================================================
    // Mock data for dashboard statistics (will be replaced with real API data)
    const dashboardStats = [
        { title: 'Total Students', value: '1,234', icon: GraduationCap, color: 'bg-blue-500' },
        { title: 'Total Teachers', value: '45', icon: Users, color: 'bg-green-500' },
        { title: 'Active Classes', value: '24', icon: BookOpen, color: 'bg-purple-500' },
        { title: 'Subjects', value: '12', icon: FileText, color: 'bg-orange-500' },
    ];

    // ============================================================================
    // RENDER DASHBOARD CONTENT
    // ============================================================================
    // Render different content based on active section
    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        {/* Welcome Section */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
                            <h1 className="text-2xl font-bold mb-2">
                                Welcome back, {userData?.firstName || 'Admin'}!
                            </h1>
                            <p className="text-blue-100">
                                Here's what's happening at your school today.
                            </p>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {dashboardStats.map((stat, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        </div>
                                        <div className={`${stat.color} p-3 rounded-lg`}>
                                            <stat.icon className="text-white" size={24} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => handleMenuClick('students')}
                                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <UserPlus className="text-blue-600" size={20} />
                                    <span className="font-medium">Add New Student</span>
                                </button>
                                <button
                                    onClick={() => handleMenuClick('teachers')}
                                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Users className="text-green-600" size={20} />
                                    <span className="font-medium">Manage Teachers</span>
                                </button>
                                <button
                                    onClick={() => handleMenuClick('reports')}
                                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FileText className="text-purple-600" size={20} />
                                    <span className="font-medium">Generate Reports</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'users':
                return (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
                        <p className="text-gray-600">Manage all system users including administrators, teachers, students, and parents.</p>
                        {/* TODO: Add user management interface */}
                    </div>
                );

            default:
                return (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            {menuItems.find(item => item.id === activeSection)?.label || 'Section'}
                        </h2>
                        <p className="text-gray-600">This section is under development.</p>
                        {/* TODO: Add specific section content */}
                    </div>
                );
        }
    };

    // ============================================================================
    // COMPONENT RENDER
    // ============================================================================
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="flex items-center space-x-2">
                        <School className="text-white" size={24} />
                        <span className="text-white font-bold text-lg">SMS Admin</span>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-white hover:bg-blue-700 p-1 rounded"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="mt-6 px-3">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleMenuClick(item.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors mb-1 ${activeSection === item.id
                                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-6 left-3 right-3">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden text-gray-600 hover:text-gray-900"
                            >
                                <Menu size={24} />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                            </h1>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {userData?.firstName} {userData?.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{userData?.role}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    {userData?.firstName?.charAt(0) || 'A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {renderContent()}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

// ============================================================================
// EXPORT COMPONENT
// ============================================================================
export default AdminDashboard;

// ============================================================================
// FUTURE ENHANCEMENTS TODO:
// ============================================================================
// 1. Add real-time statistics from API
// 2. Implement user management CRUD operations
// 3. Add data visualization charts
// 4. Implement notification system
// 5. Add bulk operations for user management
// 6. Add search and filtering capabilities
// 7. Implement role-based permission system
// 8. Add export functionality for reports
// 9. Add mobile app integration
// 10. Add WhatsApp/SMS notification integration
// ============================================================================
