<?php
/**
 * Database Setup & Seed Data
 * Run this once to initialize the database
 */

require_once 'config.php';

$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Connection failed: ' . $conn->connect_error]));
}

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME;
if (!$conn->query($sql)) {
    die(json_encode(['success' => false, 'error' => 'Error creating database: ' . $conn->error]));
}

$conn->select_db(DB_NAME);

// Create tables
$tables = [
    "CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        status ENUM('active', 'suspended') DEFAULT 'active',
        userAvatar VARCHAR(500),
        isVerified BOOLEAN DEFAULT TRUE,
        joined DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",
    
    "CREATE TABLE IF NOT EXISTS food (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        price DECIMAL(10, 2),
        stock INT DEFAULT 0,
        emoji VARCHAR(10),
        img LONGTEXT,
        `desc` LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",
    
    "CREATE TABLE IF NOT EXISTS rooms (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        status ENUM('active', 'inactive') DEFAULT 'active',
        price DECIMAL(10, 2),
        capacity INT,
        bedrooms INT,
        beds INT,
        baths INT,
        images LONGTEXT,
        location_address VARCHAR(500),
        location_lat DECIMAL(10, 8),
        location_lng DECIMAL(11, 8),
        amenities LONGTEXT,
        description LONGTEXT,
        hostName VARCHAR(255),
        hostPhone VARCHAR(20),
        hostImg VARCHAR(500),
        hostJoined VARCHAR(50),
        hostResponseRate VARCHAR(10),
        hostResponseTime VARCHAR(50),
        rating DECIMAL(3, 1) DEFAULT 0,
        reviewCount INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",
    
    "CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        userId VARCHAR(50),
        items LONGTEXT NOT NULL,
        total DECIMAL(10, 2),
        status ENUM('Pending', 'Preparing', 'Delivered', 'Cancelled') DEFAULT 'Pending',
        paymentMethod VARCHAR(50),
        date DATETIME,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )",
    
    "CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(50) PRIMARY KEY,
        userId VARCHAR(50),
        roomId VARCHAR(50),
        checkIn DATE,
        checkOut DATE,
        guests INT,
        allocatedRoom VARCHAR(100),
        totalPrice DECIMAL(10, 2),
        status ENUM('Confirmed', 'Checked In', 'Checked Out', 'Cancelled') DEFAULT 'Confirmed',
        date DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (roomId) REFERENCES rooms(id) ON DELETE SET NULL
    )",
    
    "CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(50),
        foodId VARCHAR(50),
        quantity INT DEFAULT 1,
        addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (foodId) REFERENCES food(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_food (userId, foodId)
    )",
    
    "CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(50) PRIMARY KEY,
        roomId VARCHAR(50),
        userName VARCHAR(255),
        userAvatar VARCHAR(500),
        location VARCHAR(100),
        date VARCHAR(50),
        rating INT,
        stayType VARCHAR(100),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (roomId) REFERENCES rooms(id) ON DELETE CASCADE
    )"
];

foreach ($tables as $sql) {
    if (!$conn->query($sql)) {
        echo "Error creating table: " . $conn->error . "<br>";
    }
}

// Insert seed users
$users = [
    ['u1', 'Admin User', 'admin@rhms.com', '0700000000', 'Admin123!', 'admin', 'https://i.pravatar.cc/150?u=admin@rhms.com', '2025-01-01'],
    ['u2', 'John Demo', 'user@rhms.com', '0711111111', 'User123!', 'user', 'https://i.pravatar.cc/150?u=user@rhms.com', '2025-06-15'],
    ['u3', 'Kumerra', 'user@gmail.com', '0722222222', 'Pass123!', 'user', 'https://i.pravatar.cc/150?u=user@gmail.com', '2026-04-05']
];

$stmt = $conn->prepare("INSERT IGNORE INTO users (id, name, email, phone, password, role, userAvatar, joined) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

foreach ($users as $user) {
    $stmt->bind_param("ssssssss", $user[0], $user[1], $user[2], $user[3], $user[4], $user[5], $user[6], $user[7]);
    $stmt->execute();
}

// Insert seed food items
$food_items = [
    ['f1', 'Grilled Salmon', 'Main Course', 1200, 50, '🐟', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop', 'Delicious grilled salmon...'],
    ['f2', 'Caesar Salad', 'Appetizers', 450, 50, '🥗', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop', 'Fresh caesar salad...'],
    ['f3', 'Tiramisu', 'Desserts', 550, 30, '🍰', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop', 'Delicious tiramisu...'],
    ['f4', 'Mango Smoothie', 'Beverages', 250, 100, '🥭', 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop', 'Refreshing mango smoothie...'],
    ['f5', 'Beef Wellington', 'Main Course', 1500, 20, '🥩', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', 'Premium beef wellington...'],
    ['f6', 'Bruschetta', 'Appetizers', 350, 45, '🍅', 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop', 'Fresh bruschetta...'],
    ['f7', 'Chocolate Lava Cake', 'Desserts', 650, 25, '🍫', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop', 'Chocolate lava cake...'],
    ['f8', 'Espresso Martini', 'Beverages', 800, 40, '☕', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop', 'Espresso martini...']
];

$stmt = $conn->prepare("INSERT IGNORE INTO food (id, name, category, price, stock, emoji, img, `desc`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

foreach ($food_items as $f) {
    $stmt->bind_param("ssssdiss", $f[0], $f[1], $f[2], $f[3], $f[4], $f[5], $f[6], $f[7]);
    $stmt->execute();
}

// Insert seed rooms - simplified
$rooms_sql = "INSERT IGNORE INTO rooms (id, name, type, price, capacity, bedrooms, beds, baths, status, description, hostName, hostPhone, hostImg, hostJoined, hostResponseRate, hostResponseTime, rating, reviewCount) VALUES 
('h1', 'Nyati House', 'Building', 25000, 10, 5, 8, 4, 'active', 'Grand luxury building', 'Joseph Rana', '0712345678', 'https://i.pravatar.cc/150?u=joseph_rana', 'March 2017', '100%', 'within an hour', 5.0, 4),
('h2', 'Saluti House', 'Building', 22000, 8, 4, 6, 3, 'active', 'Elegant building', 'Joseph Rana', '0712345678', 'https://i.pravatar.cc/150?u=joseph_rana', 'March 2017', '100%', 'within an hour', 4.8, 2)";

$conn->query($rooms_sql);

$stmt->close();
$conn->close();

echo json_encode(['success' => true, 'message' => 'Database initialized successfully!']);
?>
