-- =============================================
-- Database Redesign for PizzaVibe
-- Target: XAMPP phpMyAdmin (MySQL/MariaDB)
-- Matches Sequelize Models exactly
-- =============================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS pizzavibe;
CREATE DATABASE IF NOT EXISTS pizzavibe;
USE pizzavibe;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Pizzas Table
CREATE TABLE Pizzas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'veg',
    price DECIMAL(10, 2) NOT NULL,
    small_price DECIMAL(10, 2) DEFAULT 0,
    medium_price DECIMAL(10, 2) DEFAULT 0,
    large_price DECIMAL(10, 2) DEFAULT 0,
    isAvailable BOOLEAN DEFAULT TRUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Orders Table
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    totalAmount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zipCode VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    paymentStatus ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    paymentMethod ENUM('cod', 'online') DEFAULT 'cod',
    couponApplied VARCHAR(50),
    discount DECIMAL(10, 2) DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. OrderItems Table
CREATE TABLE OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    pizzaId INT,
    name VARCHAR(150) NOT NULL,
    image VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    size VARCHAR(50) DEFAULT 'medium',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (pizzaId) REFERENCES Pizzas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Coupons Table
CREATE TABLE Coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount INT NOT NULL,
    minOrder DECIMAL(10, 2) DEFAULT 0,
    maxDiscount DECIMAL(10, 2) DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    usedCount INT DEFAULT 0,
    expiryDate DATETIME,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- INITIAL SEED DATA
-- =============================================

-- Admin Credentials: admin@pizzavibe.com / Admin@123
INSERT INTO Users (name, email, password, role) 
VALUES ('System Admin', 'admin@pizzavibe.com', '$2a$12$j0i5zpTKaOmERAGizWjbz.GRXw.XCv815FuOR7n2b32N.DLJPKHG.', 'admin');

-- Sample Artisanal Pizzas
INSERT INTO Pizzas (name, image, description, category, price, small_price, medium_price, large_price, averageRating, totalReviews)
VALUES 
('Truffle Mushroom', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80', 'Wild mushroom medley with truffle oil and fresh thyme.', 'premium', 549, 449, 549, 699, 4.9, 89),
('Seafood Sensation', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80', 'Squid, mussels, prawns, and tuna with a dash of lemon.', 'premium', 649, 529, 649, 829, 4.6, 54),
('Butter Chicken Pizza', 'https://images.unsplash.com/photo-1613564834361-9436948817d1?w=600&q=80', 'Classic butter chicken gravy base with succulent chicken chunks.', 'non-veg', 489, 399, 489, 639, 4.9, 420),
('Margherita Classic', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80', 'Fresh mozzarella, San Marzano tomato sauce, and aromatic basil.', 'veg', 249, 199, 249, 329, 4.5, 128);

-- Sample Coupons
INSERT INTO Coupons (code, discount, minOrder, maxDiscount, expiryDate)
VALUES 
('WELCOME20', 20, 300, 200, '2027-12-31 23:59:59'),
('PIZZAVIBE50', 50, 500, 500, '2027-06-30 23:59:59');
