-- =============================================
-- Database Redesign for PizzaVibe
-- Target: XAMPP phpMyAdmin (MySQL/MariaDB)
-- =============================================

DROP DATABASE IF EXISTS pizzavibe;
CREATE DATABASE IF NOT EXISTS pizzavibe;
USE pizzavibe;

-- 1. Users Table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    avatar VARCHAR(255) DEFAULT 'https://ui-avatars.com/api/?name=User&background=random',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Pizzas Table
CREATE TABLE Pizzas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('veg', 'non-veg', 'premium') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    small_price DECIMAL(10, 2) DEFAULT 0,
    medium_price DECIMAL(10, 2) DEFAULT 0,
    large_price DECIMAL(10, 2) DEFAULT 0,
    isAvailable BOOLEAN DEFAULT TRUE,
    averageRating DECIMAL(3, 1) DEFAULT 0.0,
    totalReviews INT DEFAULT 0,
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
    size ENUM('small', 'medium', 'large') DEFAULT 'medium',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (pizzaId) REFERENCES Pizzas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Coupons Table (New for Redesign)
CREATE TABLE Coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    expiry_date DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- FIXED ADMIN CREDENTIALS
-- Username: Admin@Boss
-- Password: Boss@2026
-- No signup needed. Admin is pre-inserted.
-- =============================================

INSERT INTO Users (name, email, password, role) 
VALUES (
    'Main Admin', 
    'Admin@Boss', 
    '$2a$12$j0i5zpTKaOmERAGizWjbz.GRXw.XCv815FuOR7n2b32N.DLJPKHG.', 
    'admin'
);

-- Seed initial pizzas
INSERT INTO Pizzas (name, image, description, category, price, small_price, medium_price, large_price)
VALUES 
('Margherita', 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca', 'Classic delight with 100% real mozzarella cheese', 'veg', 199, 199, 299, 449),
('Farmhouse', 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47', 'Delightful combination of onion, capsicum, tomato & mushroom', 'veg', 249, 249, 399, 599),
('Pepperoni Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e', 'Classic pepperoni with extra cheese', 'non-veg', 299, 299, 499, 699);
