-- School Management System Database Initialization
-- This script sets up the initial database structure and sample data

-- Create database if it doesn't exist
-- CREATE DATABASE school_management_db;

-- Connect to the database
-- \c school_management_db;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert sample school settings
INSERT INTO school_settings (id, school_name, termly_fee_amount, current_term, current_year, updated_at)
VALUES (
    'school-settings-001',
    'Sierra Leone Excellence Academy',
    500.00,
    'FIRST',
    2024,
    NOW()
) ON CONFLICT DO NOTHING;

-- Insert sample subjects
INSERT INTO subjects (id, name, code, class_id)
VALUES 
    ('subj-001', 'Mathematics', 'MATH', NULL),
    ('subj-002', 'English Language', 'ENG', NULL),
    ('subj-003', 'Science', 'SCI', NULL),
    ('subj-004', 'Social Studies', 'SOC', NULL),
    ('subj-005', 'French', 'FRE', NULL),
    ('subj-006', 'Computer Science', 'CS', NULL),
    ('subj-007', 'Physical Education', 'PE', NULL),
    ('subj-008', 'Art and Craft', 'ART', NULL)
ON CONFLICT DO NOTHING;

-- Insert sample classes
INSERT INTO classes (id, name, year, teacher_id, created_at)
VALUES 
    ('class-001', 'Grade 1A', 2024, NULL, NOW()),
    ('class-002', 'Grade 1B', 2024, NULL, NOW()),
    ('class-003', 'Grade 2A', 2024, NULL, NOW()),
    ('class-004', 'Grade 2B', 2024, NULL, NOW()),
    ('class-005', 'Form 1A', 2024, NULL, NOW()),
    ('class-006', 'Form 1B', 2024, NULL, NOW()),
    ('class-007', 'Form 2A', 2024, NULL, NOW()),
    ('class-008', 'Form 2B', 2024, NULL, NOW())
ON CONFLICT DO NOTHING; 