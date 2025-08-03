import React, { useState } from 'react';
import {
    School,
    Users,
    BookOpen,
    BarChart3,
    Shield,
    Globe,
    Phone,
    Mail,
    MapPin,
    Clock,
    Award,
    GraduationCap,
    Calendar,
    DollarSign,
    CheckCircle,
    ArrowRight,
    Menu,
    X,
    Play,
    Star,
    Facebook,
    Twitter,
    Instagram,
    Linkedin
} from 'lucide-react';
import ContactForm from '../components/ContactForm';
import DemoVideo from '../components/DemoVideo';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const features = [
        {
            icon: Users,
            title: "Student Management",
            description: "Comprehensive student records, enrollment, and academic tracking with real-time updates."
        },
        {
            icon: BookOpen,
            title: "Class Management",
            description: "Organize classes, assign teachers, and manage curriculum with ease."
        },
        {
            icon: BarChart3,
            title: "Analytics & Reports",
            description: "Generate detailed reports, track performance, and make data-driven decisions."
        },
        {
            icon: Shield,
            title: "Secure & Reliable",
            description: "Bank-level security with role-based access control and data encryption."
        },
        {
            icon: Globe,
            title: "Cloud-Based",
            description: "Access from anywhere, anytime with our cloud-hosted solution."
        },
        {
            icon: Award,
            title: "Award-Winning",
            description: "Trusted by schools across Sierra Leone for excellence in education management."
        }
    ];

    const testimonials = [
        {
            name: "Mrs. Aminata Kamara",
            role: "Principal, St. Mary's Secondary School",
            content: "Our school management system has revolutionized how we track student progress and communicate with parents. The efficiency improvements are remarkable!",
            rating: 5
        },
        {
            name: "Mr. Emmanuel Sesay",
            role: "Head of Mathematics Department",
            content: "The grade tracking and report generation features save me hours every week. I can focus more on teaching and less on paperwork.",
            rating: 5
        },
        {
            name: "Mrs. Fatima Conteh",
            role: "Parent of Form 3 Student",
            content: "I can now easily track my daughter's academic progress and communicate with her teachers. The parent portal is excellent!",
            rating: 5
        }
    ];

    const stats = [
        { number: "850+", label: "Students Enrolled" },
        { number: "45", label: "Qualified Teachers" },
        { number: "12", label: "Academic Classes" },
        { number: "98%", label: "Pass Rate 2023" }
    ];

    const pricingPlans = [
        {
            name: "Basic Access",
            price: "Free",
            period: "for Parents",
            features: [
                "View student grades",
                "Attendance tracking",
                "Parent-teacher communication",
                "Academic calendar",
                "Fee payment status"
            ],
            popular: false
        },
        {
            name: "Teacher Portal",
            price: "Included",
            period: "with Employment",
            features: [
                "Grade entry and management",
                "Attendance marking",
                "Student progress reports",
                "Parent communication",
                "Class schedule management",
                "Performance analytics"
            ],
            popular: true
        },
        {
            name: "Administrative",
            price: "Full Access",
            period: "for Staff",
            features: [
                "Complete student management",
                "Financial reporting",
                "Staff management",
                "School-wide analytics",
                "Policy management",
                "System administration"
            ],
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <School className="text-blue-600" size={32} />
                            <span className="text-xl font-bold text-gray-900">St. Mary's</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
                            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
                            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
                            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
                            <a
                                href="/login"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Login
                            </a>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-700 hover:text-blue-600"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                                <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Features</a>
                                <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Pricing</a>
                                <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-blue-600">About</a>
                                <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Contact</a>
                                <a href="/login" className="block px-3 py-2 bg-blue-600 text-white rounded-lg">Login</a>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            St. Mary's Secondary School
                            <span className="text-blue-600 block">Management System</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Empowering excellence in education at St. Mary's Secondary School, Freetown.
                            Streamline student management, track academic progress, and enhance communication between teachers, parents, and administrators.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/login"
                                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                            >
                                <span>Get Started Free</span>
                                <ArrowRight size={20} />
                            </a>
                            <button
                                onClick={() => document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' })}
                                className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                            >
                                <Play size={20} />
                                <span>Watch Demo</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Comprehensive School Management for St. Mary's
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From student registration to final examinations, our integrated system manages every aspect of academic life at St. Mary's Secondary School.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                    <feature.icon className="text-blue-600" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What Our School Community Says
                        </h2>
                        <p className="text-xl text-gray-600">
                            Hear from our dedicated staff, teachers, and parents about their experience with our school management system.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-gray-50 p-8 rounded-lg">
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="text-yellow-400 fill-current" size={20} />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Access Levels for Our School Community
                        </h2>
                        <p className="text-xl text-gray-600">
                            Different access levels designed for students, parents, teachers, and administrative staff.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <div key={index} className={`bg-white p-8 rounded-lg shadow-sm border-2 ${plan.popular ? 'border-blue-500 relative' : 'border-gray-200'
                                }`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <div className="text-4xl font-bold text-blue-600 mb-1">{plan.price}</div>
                                    <div className="text-gray-600">{plan.period}</div>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center space-x-3">
                                            <CheckCircle className="text-green-500" size={20} />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href="/login"
                                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${plan.popular
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}>
                                    Get Started
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo-section" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            See SMS Pro in Action
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Watch our comprehensive demo to see how SMS Pro can transform your school management workflow.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <DemoVideo />
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                St. Mary's Secondary School
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Founded in 1985, St. Mary's Secondary School has been a cornerstone of academic excellence
                                in Freetown. Our management system is specifically designed to support our unique educational
                                approach and community values.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="text-green-500" size={20} />
                                    <span className="text-gray-700">Academic excellence since 1985</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="text-green-500" size={20} />
                                    <span className="text-gray-700">WAEC curriculum integration</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="text-green-500" size={20} />
                                    <span className="text-gray-700">Experienced teaching staff</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="text-green-500" size={20} />
                                    <span className="text-gray-700">Strong parent-teacher partnership</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-lg text-white">
                            <h3 className="text-2xl font-bold mb-4">Why Choose St. Mary's?</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center space-x-3">
                                    <GraduationCap size={20} />
                                    <span>Proven academic excellence</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Calendar size={20} />
                                    <span>Structured learning environment</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <DollarSign size={20} />
                                    <span>Affordable quality education</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <BarChart3 size={20} />
                                    <span>Consistent high pass rates</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Contact St. Mary's Secondary School
                        </h2>
                        <p className="text-xl text-gray-600">
                            Get in touch with us for admissions, inquiries, or to learn more about our school management system.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">School Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <MapPin className="text-blue-600" size={20} />
                                    <span className="text-gray-700">15 Hill Station Road, Freetown, Sierra Leone</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="text-blue-600" size={20} />
                                    <span className="text-gray-700">+232 76 123 456</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="text-blue-600" size={20} />
                                    <span className="text-gray-700">info@stmarys.edu.sl</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Clock className="text-blue-600" size={20} />
                                    <span className="text-gray-700">Mon-Fri: 7:30 AM - 4:00 PM</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h4>
                                <div className="flex space-x-4">
                                    <a href="#" className="text-gray-400 hover:text-blue-600">
                                        <Facebook size={24} />
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-blue-600">
                                        <Twitter size={24} />
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-blue-600">
                                        <Instagram size={24} />
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-blue-600">
                                        <Linkedin size={24} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Form</h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option>Admission Inquiry</option>
                                        <option>Academic Information</option>
                                        <option>Fee Payment</option>
                                        <option>Parent-Teacher Meeting</option>
                                        <option>General Inquiry</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Please describe your inquiry..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <School className="text-blue-400" size={32} />
                                <span className="text-xl font-bold">St. Mary's Secondary School</span>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Empowering excellence in education since 1985.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Features</a></li>
                                <li><a href="#" className="hover:text-white">Pricing</a></li>
                                <li><a href="#" className="hover:text-white">Demo</a></li>
                                <li><a href="#" className="hover:text-white">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Documentation</a></li>
                                <li><a href="#" className="hover:text-white">Help Center</a></li>
                                <li><a href="#" className="hover:text-white">Contact</a></li>
                                <li><a href="#" className="hover:text-white">Training</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">About</a></li>
                                <li><a href="#" className="hover:text-white">Blog</a></li>
                                <li><a href="#" className="hover:text-white">Careers</a></li>
                                <li><a href="#" className="hover:text-white">Privacy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 St. Mary's Secondary School. All rights reserved. Built with ❤️ for our students.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage; 