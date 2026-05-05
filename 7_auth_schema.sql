-- ============================================
-- User Authentication Table
-- ============================================
-- This table handles login/signup for the GoAnywhere platform.
-- Passwords are hashed using bcrypt before storage.

USE Hotel_Management_System;

CREATE TABLE IF NOT EXISTS User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('guest', 'admin') DEFAULT 'guest',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a default admin user (password: admin123)
-- The hash below is bcrypt for 'admin123' — in production, use the signup API instead.
-- INSERT INTO User (name, email, password_hash, role)
-- VALUES ('Admin', 'admin@goanywhere.com', '$2a$10$...hash...', 'admin');
