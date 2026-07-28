-- =========================================================
-- Student Management System Database Schema (MySQL 8.0+)
-- =========================================================

CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    head_of_department VARCHAR(100),
    capacity INT DEFAULT 100
);

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    credits INT DEFAULT 3,
    department_code VARCHAR(20),
    semester INT
);

-- 4. Students Table
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usn_roll_number VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    gender VARCHAR(10),
    date_of_birth DATE,
    address VARCHAR(255),
    department VARCHAR(50),
    semester INT,
    section VARCHAR(10),
    assigned_courses VARCHAR(200),
    parent_name VARCHAR(100),
    parent_phone VARCHAR(20),
    admission_date DATE,
    photo_url VARCHAR(255),
    user_id BIGINT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_code VARCHAR(30),
    date DATE NOT NULL,
    status VARCHAR(15) NOT NULL,
    remarks VARCHAR(255),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 6. Marks Table
CREATE TABLE IF NOT EXISTS marks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_code VARCHAR(30) NOT NULL,
    course_title VARCHAR(100),
    internal_marks DOUBLE DEFAULT 0.0,
    assignment_marks DOUBLE DEFAULT 0.0,
    lab_marks DOUBLE DEFAULT 0.0,
    final_exam_marks DOUBLE DEFAULT 0.0,
    total_marks DOUBLE DEFAULT 0.0,
    grade VARCHAR(5),
    gpa DOUBLE DEFAULT 0.0,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 7. Timetable Table
CREATE TABLE IF NOT EXISTS timetable (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    day_of_week VARCHAR(20) NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    course_title VARCHAR(100),
    room_number VARCHAR(20),
    department VARCHAR(50),
    semester INT,
    section VARCHAR(10)
);

-- 8. Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    action VARCHAR(50),
    details VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
