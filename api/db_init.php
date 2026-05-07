<?php
/* ================================================================
   Database Initialization & Schema Creation
   ================================================================ */

// Database configuration
$db_host = 'localhost';
$db_user = 'root';
$db_password = '';
$db_name = 'rhms_db';

// Create connection to MySQL server (without selecting database yet)
$conn = new mysqli($db_host, $db_user, $db_password);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Connection failed: ' . $conn->connect_error]));
}

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS " . $db_name;
if ($conn->query($sql) === TRUE) {
    echo "Database created or already exists.<br>";
} else {
    die(json_encode(['success' => false, 'error' => 'Error creating database: ' . $conn->error]));
}

// Select the database
$conn->select_db($db_name);

// Create tables
$tables_sql = "
-- Users table
CREATE TABLE IF NOT EXISTS users (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Food table
CREATE TABLE IF NOT EXISTS food (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10, 2),
    stock INT DEFAULT 0,
    emoji VARCHAR(10),
    img LONGTEXT,
    desc LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(50),
    foodId VARCHAR(50),
    quantity INT DEFAULT 1,
    addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (foodId) REFERENCES food(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_food (userId, foodId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_userId ON orders(userId);
CREATE INDEX idx_bookings_userId ON bookings(userId);
CREATE INDEX idx_bookings_roomId ON bookings(roomId);
CREATE INDEX idx_cart_userId ON cart_items(userId);
CREATE INDEX idx_reviews_roomId ON reviews(roomId);
";

// Execute table creation statements one by one
$individual_tables = [
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    
    "CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(50),
        foodId VARCHAR(50),
        quantity INT DEFAULT 1,
        addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (foodId) REFERENCES food(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_food (userId, foodId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
];

foreach ($individual_tables as $table_sql) {
    if ($conn->query($table_sql) === TRUE) {
        // echo "Table created successfully<br>";
    } else {
        echo "Error creating table: " . $conn->error . "<br>";
    }
}

// Insert seed data
// Insert users
$users = [
    ['u1', 'Admin User', 'admin@rhms.com', '0700000000', 'Admin123!', 'admin', 'active', 'https://i.pravatar.cc/150?u=admin@rhms.com', true, '2025-01-01'],
    ['u2', 'John Demo', 'user@rhms.com', '0711111111', 'User123!', 'user', 'active', 'https://i.pravatar.cc/150?u=user@rhms.com', true, '2025-06-15'],
    ['u3', 'Kumerra', 'user@gmail.com', '0722222222', 'Pass123!', 'user', 'active', 'https://i.pravatar.cc/150?u=user@gmail.com', true, '2026-04-05']
];

$insert_user = $conn->prepare("INSERT IGNORE INTO users (id, name, email, phone, password, role, status, userAvatar, isVerified, joined) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

foreach ($users as $user) {
    $insert_user->bind_param("ssssssssis", $user[0], $user[1], $user[2], $user[3], $user[4], $user[5], $user[6], $user[7], $user[8], $user[9]);
    $insert_user->execute();
}
$insert_user->close();

echo json_encode(['success' => true, 'message' => 'Database initialized successfully']);
$conn->close();
?>
