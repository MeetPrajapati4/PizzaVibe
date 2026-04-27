-- =============================================
-- QUICK FIX: Update Admin Password to Bcrypt Hash
-- Run this in phpMyAdmin SQL tab if you already 
-- have the database and just need to fix the 
-- admin password from plaintext to hashed.
-- =============================================

USE pizzavibe;

-- Update password from plaintext to bcrypt hash of 'Boss@2026'
UPDATE Users 
SET password = '$2a$12$j0i5zpTKaOmERAGizWjbz.GRXw.XCv815FuOR7n2b32N.DLJPKHG.',
    updatedAt = NOW()
WHERE email = 'Admin@Boss' AND role = 'admin';

-- Verify the update (should show 1 row with hashed password)
SELECT id, name, email, LEFT(password, 20) AS password_preview, role, updatedAt 
FROM Users 
WHERE email = 'Admin@Boss';
