<?php
/**
 * RHMS API Endpoints
 * Handles all data operations
 */

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$action = isset($_GET['action']) ? $_GET['action'] : '';
$input = json_decode(file_get_contents('php://input'), true);

$conn = getDBConnection();

// Route handling
if (strpos($path, '/api/users') !== false || $action === 'users') {
    handleUsers($conn, $method, $input);
} elseif (strpos($path, '/api/food') !== false || $action === 'food') {
    handleFood($conn, $method, $input);
} elseif (strpos($path, '/api/rooms') !== false || $action === 'rooms') {
    handleRooms($conn, $method, $input);
} elseif (strpos($path, '/api/orders') !== false || $action === 'orders') {
    handleOrders($conn, $method, $input);
} elseif (strpos($path, '/api/bookings') !== false || $action === 'bookings') {
    handleBookings($conn, $method, $input);
} elseif (strpos($path, '/api/cart') !== false || $action === 'cart') {
    handleCart($conn, $method, $input);
} elseif (strpos($path, '/api/reviews') !== false || $action === 'reviews') {
    handleReviews($conn, $method, $input);
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Endpoint not found']);
}

$conn->close();

// =====================================================================
// USER OPERATIONS
// =====================================================================
function handleUsers($conn, $method, $input) {
    switch($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                getUser($conn, $_GET['id']);
            } else {
                getAllUsers($conn);
            }
            break;
        case 'POST':
            if (isset($input['action'])) {
                if ($input['action'] === 'login') {
                    loginUser($conn, $input);
                } elseif ($input['action'] === 'signup') {
                    signupUser($conn, $input);
                }
            }
            break;
        case 'PUT':
            updateUser($conn, $input);
            break;
        case 'DELETE':
            deleteUser($conn, $_GET['id']);
            break;
    }
}

function getAllUsers($conn) {
    $result = $conn->query("SELECT * FROM users");
    $users = [];
    while ($row = $result->fetch_assoc()) {
        unset($row['password']); // Don't send passwords
        $users[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $users]);
}

function getUser($conn, $id) {
    $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    if ($user) {
        unset($user['password']);
        echo json_encode(['success' => true, 'data' => $user]);
    } else {
        echo json_encode(['success' => false, 'error' => 'User not found']);
    }
    $stmt->close();
}

function loginUser($conn, $input) {
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? AND password = ?");
    $stmt->bind_param("ss", $email, $password);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if ($user) {
        unset($user['password']);
        echo json_encode(['success' => true, 'data' => $user]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
    }
    $stmt->close();
}

function signupUser($conn, $input) {
    $name = $input['name'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $phone = $input['phone'] ?? '';
    
    // Check if email exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'error' => 'Email already registered']);
        $stmt->close();
        return;
    }
    $stmt->close();
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !preg_match('/@gmail\.com$/', $email)) {
        echo json_encode(['success' => false, 'error' => 'Only @gmail.com addresses are allowed']);
        return;
    }
    
    // Validate password
    if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/[a-z]/', $password) || 
        !preg_match('/\d/', $password) || !preg_match('/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/', $password)) {
        echo json_encode(['success' => false, 'error' => 'Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters']);
        return;
    }
    
    $id = 'u' . time();
    $avatar = 'https://i.pravatar.cc/150?u=' . $email;
    $joined = date('Y-m-d');
    
    $stmt = $conn->prepare("INSERT INTO users (id, name, email, password, phone, userAvatar, joined) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $id, $name, $email, $password, $phone, $avatar, $joined);
    
    if ($stmt->execute()) {
        $user = ['id' => $id, 'name' => $name, 'email' => $email, 'phone' => $phone, 'userAvatar' => $avatar, 'role' => 'user', 'joined' => $joined];
        echo json_encode(['success' => true, 'data' => $user]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Signup failed']);
    }
    $stmt->close();
}

function updateUser($conn, $input) {
    $id = $input['id'] ?? '';
    $name = $input['name'] ?? '';
    $phone = $input['phone'] ?? '';
    $status = $input['status'] ?? 'active';
    
    $stmt = $conn->prepare("UPDATE users SET name = ?, phone = ?, status = ? WHERE id = ?");
    $stmt->bind_param("ssss", $name, $phone, $status, $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User updated']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Update failed']);
    }
    $stmt->close();
}

function deleteUser($conn, $id) {
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("s", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User deleted']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Delete failed']);
    }
    $stmt->close();
}

// =====================================================================
// FOOD OPERATIONS
// =====================================================================
function handleFood($conn, $method, $input) {
    switch($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                getFood($conn, $_GET['id']);
            } else {
                getAllFood($conn);
            }
            break;
        case 'POST':
            createFood($conn, $input);
            break;
        case 'PUT':
            updateFood($conn, $input);
            break;
        case 'DELETE':
            deleteFood($conn, $_GET['id']);
            break;
    }
}

function getAllFood($conn) {
    $result = $conn->query("SELECT * FROM food");
    $food = [];
    while ($row = $result->fetch_assoc()) {
        $food[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $food]);
}

function getFood($conn, $id) {
    $stmt = $conn->prepare("SELECT * FROM food WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $food = $result->fetch_assoc();
    echo json_encode(['success' => true, 'data' => $food]);
    $stmt->close();
}

function createFood($conn, $input) {
    $id = $input['id'] ?? 'f' . time();
    $name = $input['name'] ?? '';
    $category = $input['category'] ?? '';
    $price = $input['price'] ?? 0;
    $stock = $input['stock'] ?? 0;
    $emoji = $input['emoji'] ?? '';
    $img = $input['img'] ?? '';
    $desc = $input['desc'] ?? '';
    
    $stmt = $conn->prepare("INSERT INTO food (id, name, category, price, stock, emoji, img, `desc`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssdisss", $id, $name, $category, $price, $stock, $emoji, $img, $desc);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'data' => $input]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Create failed']);
    }
    $stmt->close();
}

function updateFood($conn, $input) {
    $id = $input['id'] ?? '';
    $name = $input['name'] ?? '';
    $category = $input['category'] ?? '';
    $price = $input['price'] ?? 0;
    $stock = $input['stock'] ?? 0;
    $emoji = $input['emoji'] ?? '';
    $img = $input['img'] ?? '';
    $desc = $input['desc'] ?? '';
    
    $stmt = $conn->prepare("UPDATE food SET name = ?, category = ?, price = ?, stock = ?, emoji = ?, img = ?, `desc` = ? WHERE id = ?");
    $stmt->bind_param("ssdsisss", $name, $category, $price, $stock, $emoji, $img, $desc, $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Food updated']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Update failed']);
    }
    $stmt->close();
}

function deleteFood($conn, $id) {
    $stmt = $conn->prepare("DELETE FROM food WHERE id = ?");
    $stmt->bind_param("s", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Food deleted']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Delete failed']);
    }
    $stmt->close();
}

// =====================================================================
// ROOM OPERATIONS
// =====================================================================
function handleRooms($conn, $method, $input) {
    switch($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                getRoom($conn, $_GET['id']);
            } else {
                getAllRooms($conn);
            }
            break;
        case 'POST':
            createRoom($conn, $input);
            break;
        case 'PUT':
            updateRoom($conn, $input);
            break;
        case 'DELETE':
            deleteRoom($conn, $_GET['id']);
            break;
    }
}

function getAllRooms($conn) {
    $result = $conn->query("SELECT * FROM rooms");
    $rooms = [];
    while ($row = $result->fetch_assoc()) {
        $row['images'] = !empty($row['images']) ? json_decode($row['images'], true) : [];
        if (!is_array($row['images'])) $row['images'] = [];
        
        $row['amenities'] = !empty($row['amenities']) ? json_decode($row['amenities'], true) : [];
        if (!is_array($row['amenities'])) $row['amenities'] = [];
        
        $rooms[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $rooms]);
}

function getRoom($conn, $id) {
    $stmt = $conn->prepare("SELECT * FROM rooms WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $room = $result->fetch_assoc();
    if ($room) {
        $room['images'] = !empty($room['images']) ? json_decode($room['images'], true) : [];
        if (!is_array($room['images'])) $room['images'] = [];
        
        $room['amenities'] = !empty($room['amenities']) ? json_decode($room['amenities'], true) : [];
        if (!is_array($room['amenities'])) $room['amenities'] = [];
    }
    echo json_encode(['success' => true, 'data' => $room]);
    $stmt->close();
}

function createRoom($conn, $input) {
    $id = $input['id'] ?? 'h' . time();
    $name = $input['name'] ?? '';
    $type = $input['type'] ?? '';
    $price = $input['price'] ?? 0;
    $capacity = $input['capacity'] ?? 0;
    $bedrooms = $input['bedrooms'] ?? 0;
    $beds = $input['beds'] ?? 0;
    $baths = $input['baths'] ?? 0;
    $status = $input['status'] ?? 'active';
    
    $images = is_array($input['images'] ?? null) ? json_encode($input['images']) : '[]';
    $amenities = is_array($input['amenities'] ?? null) ? json_encode($input['amenities']) : '[]';
    $description = $input['desc'] ?? $input['description'] ?? '';
    $location_address = $input['location_address'] ?? '';
    
    $stmt = $conn->prepare("INSERT INTO rooms (id, name, type, price, capacity, bedrooms, beds, baths, status, images, amenities, description, location_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssdiiiisssss", $id, $name, $type, $price, $capacity, $bedrooms, $beds, $baths, $status, $images, $amenities, $description, $location_address);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'data' => $input]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Create failed']);
    }
    $stmt->close();
}

function updateRoom($conn, $input) {
    $id = $input['id'] ?? '';
    $name = $input['name'] ?? '';
    $type = $input['type'] ?? '';
    $price = $input['price'] ?? 0;
    $capacity = $input['capacity'] ?? 0;
    $bedrooms = $input['bedrooms'] ?? 0;
    $beds = $input['beds'] ?? 0;
    $baths = $input['baths'] ?? 0;
    $status = $input['status'] ?? 'active';
    
    $images = is_array($input['images'] ?? null) ? json_encode($input['images']) : '[]';
    $amenities = is_array($input['amenities'] ?? null) ? json_encode($input['amenities']) : '[]';
    $description = $input['desc'] ?? $input['description'] ?? '';
    
    $stmt = $conn->prepare("UPDATE rooms SET name = ?, type = ?, price = ?, capacity = ?, bedrooms = ?, beds = ?, baths = ?, status = ?, images = ?, amenities = ?, description = ? WHERE id = ?");
    $stmt->bind_param("ssdiiiissss", $name, $type, $price, $capacity, $bedrooms, $beds, $baths, $status, $images, $amenities, $description, $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Room updated']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Update failed']);
    }
    $stmt->close();
}

function deleteRoom($conn, $id) {
    $stmt = $conn->prepare("DELETE FROM rooms WHERE id = ?");
    $stmt->bind_param("s", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Room deleted']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Delete failed']);
    }
    $stmt->close();
}

// =====================================================================
// ORDER OPERATIONS
// =====================================================================
function handleOrders($conn, $method, $input) {
    switch($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                getOrder($conn, $_GET['id']);
            } elseif (isset($_GET['userId'])) {
                getUserOrders($conn, $_GET['userId']);
            } else {
                getAllOrders($conn);
            }
            break;
        case 'POST':
            createOrder($conn, $input);
            break;
        case 'PUT':
            updateOrder($conn, $input);
            break;
        case 'DELETE':
            deleteOrder($conn, $_GET['id']);
            break;
    }
}

function getAllOrders($conn) {
    $result = $conn->query("SELECT * FROM orders ORDER BY date DESC");
    $orders = [];
    while ($row = $result->fetch_assoc()) {
        if (!empty($row['items'])) {
            $row['items'] = json_decode($row['items'], true);
        }
        $orders[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $orders]);
}

function getOrder($conn, $id) {
    $stmt = $conn->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $order = $result->fetch_assoc();
    if ($order && !empty($order['items'])) {
        $order['items'] = json_decode($order['items'], true);
    }
    echo json_encode(['success' => true, 'data' => $order]);
    $stmt->close();
}

function getUserOrders($conn, $userId) {
    $stmt = $conn->prepare("SELECT * FROM orders WHERE userId = ? ORDER BY date DESC");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $orders = [];
    while ($row = $result->fetch_assoc()) {
        if (!empty($row['items'])) {
            $row['items'] = json_decode($row['items'], true);
        }
        $orders[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $orders]);
    $stmt->close();
}

function createOrder($conn, $input) {
    $id = $input['id'] ?? 'o' . time();
    $userId = $input['userId'] ?? '';
    $items = is_array($input['items'] ?? null) ? json_encode($input['items']) : '[]';
    $total = $input['total'] ?? 0;
    $status = $input['status'] ?? 'Pending';
    $paymentMethod = $input['paymentMethod'] ?? 'Cash';
    $date = $input['date'] ?? date('Y-m-d H:i:s');
    
    $stmt = $conn->prepare("INSERT INTO orders (id, userId, items, total, status, paymentMethod, date) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssdiss", $id, $userId, $items, $total, $status, $paymentMethod, $date);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'data' => ['id' => $id] + $input]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Create failed']);
    }
    $stmt->close();
}

function updateOrder($conn, $input) {
    $id = $input['id'] ?? '';
    $status = $input['status'] ?? 'Pending';
    
    $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->bind_param("ss", $status, $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Order updated']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Update failed']);
    }
    $stmt->close();
}

function deleteOrder($conn, $id) {
    $stmt = $conn->prepare("DELETE FROM orders WHERE id = ?");
    $stmt->bind_param("s", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Order deleted']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Delete failed']);
    }
    $stmt->close();
}

// =====================================================================
// BOOKING OPERATIONS
// =====================================================================
function handleBookings($conn, $method, $input) {
    switch($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                getBooking($conn, $_GET['id']);
            } elseif (isset($_GET['userId'])) {
                getUserBookings($conn, $_GET['userId']);
            } else {
                getAllBookings($conn);
            }
            break;
        case 'POST':
            createBooking($conn, $input);
            break;
        case 'PUT':
            updateBooking($conn, $input);
            break;
        case 'DELETE':
            deleteBooking($conn, $_GET['id']);
            break;
    }
}

function getAllBookings($conn) {
    $result = $conn->query("SELECT * FROM bookings ORDER BY date DESC");
    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $bookings]);
}

function getBooking($conn, $id) {
    $stmt = $conn->prepare("SELECT * FROM bookings WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $booking = $result->fetch_assoc();
    echo json_encode(['success' => true, 'data' => $booking]);
    $stmt->close();
}

function getUserBookings($conn, $userId) {
    $stmt = $conn->prepare("SELECT * FROM bookings WHERE userId = ? ORDER BY date DESC");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $bookings]);
    $stmt->close();
}

function createBooking($conn, $input) {
    $id = $input['id'] ?? 'b' . time();
    $userId = $input['userId'] ?? '';
    $roomId = $input['roomId'] ?? '';
    $checkIn = $input['checkIn'] ?? '';
    $checkOut = $input['checkOut'] ?? '';
    $guests = $input['guests'] ?? 0;
    $allocatedRoom = $input['allocatedRoom'] ?? '';
    $totalPrice = $input['totalPrice'] ?? 0;
    $date = $input['date'] ?? date('Y-m-d H:i:s');
    
    $stmt = $conn->prepare("INSERT INTO bookings (id, userId, roomId, checkIn, checkOut, guests, allocatedRoom, totalPrice, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssisds", $id, $userId, $roomId, $checkIn, $checkOut, $guests, $allocatedRoom, $totalPrice, $date);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'data' => ['id' => $id] + $input]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Create failed']);
    }
    $stmt->close();
}

function updateBooking($conn, $input) {
    $id = $input['id'] ?? '';
    $status = $input['status'] ?? 'Confirmed';
    
    $stmt = $conn->prepare("UPDATE bookings SET status = ? WHERE id = ?");
    $stmt->bind_param("ss", $status, $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Booking updated']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Update failed']);
    }
    $stmt->close();
}

function deleteBooking($conn, $id) {
    $stmt = $conn->prepare("DELETE FROM bookings WHERE id = ?");
    $stmt->bind_param("s", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Booking deleted']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Delete failed']);
    }
    $stmt->close();
}

// =====================================================================
// CART OPERATIONS
// =====================================================================
function handleCart($conn, $method, $input) {
    switch($method) {
        case 'GET':
            getCart($conn, $_GET['userId'] ?? '');
            break;
        case 'POST':
            addToCart($conn, $input);
            break;
        case 'PUT':
            updateCartItem($conn, $input);
            break;
        case 'DELETE':
            removeFromCart($conn, $_GET['userId'] ?? '', $_GET['foodId'] ?? '');
            break;
    }
}

function getCart($conn, $userId) {
    $stmt = $conn->prepare("SELECT c.*, f.name, f.price FROM cart_items c JOIN food f ON c.foodId = f.id WHERE c.userId = ?");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $items]);
    $stmt->close();
}

function addToCart($conn, $input) {
    $userId = $input['userId'] ?? '';
    $foodId = $input['foodId'] ?? '';
    $quantity = $input['quantity'] ?? 1;
    
    $stmt = $conn->prepare("INSERT INTO cart_items (userId, foodId, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?");
    $stmt->bind_param("ssii", $userId, $foodId, $quantity, $quantity);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Added to cart']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Add to cart failed']);
    }
    $stmt->close();
}

function updateCartItem($conn, $input) {
    $userId = $input['userId'] ?? '';
    $foodId = $input['foodId'] ?? '';
    $quantity = $input['quantity'] ?? 1;
    
    $stmt = $conn->prepare("UPDATE cart_items SET quantity = ? WHERE userId = ? AND foodId = ?");
    $stmt->bind_param("iss", $quantity, $userId, $foodId);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Cart updated']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Update failed']);
    }
    $stmt->close();
}

function removeFromCart($conn, $userId, $foodId) {
    $stmt = $conn->prepare("DELETE FROM cart_items WHERE userId = ? AND foodId = ?");
    $stmt->bind_param("ss", $userId, $foodId);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Removed from cart']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Remove failed']);
    }
    $stmt->close();
}

// =====================================================================
// REVIEW OPERATIONS
// =====================================================================
function handleReviews($conn, $method, $input) {
    switch($method) {
        case 'GET':
            if (isset($_GET['roomId'])) {
                getRoomReviews($conn, $_GET['roomId']);
            } else {
                getAllReviews($conn);
            }
            break;
        case 'POST':
            createReview($conn, $input);
            break;
    }
}

function getAllReviews($conn) {
    $result = $conn->query("SELECT * FROM reviews ORDER BY created_at DESC");
    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $reviews]);
}

function getRoomReviews($conn, $roomId) {
    $stmt = $conn->prepare("SELECT * FROM reviews WHERE roomId = ? ORDER BY created_at DESC");
    $stmt->bind_param("s", $roomId);
    $stmt->execute();
    $result = $stmt->get_result();
    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $reviews]);
    $stmt->close();
}

function createReview($conn, $input) {
    $id = $input['id'] ?? 'r' . time();
    $roomId = $input['roomId'] ?? '';
    $userName = $input['userName'] ?? '';
    $userAvatar = $input['userAvatar'] ?? '';
    $location = $input['location'] ?? '';
    $date = $input['date'] ?? date('F Y');
    $rating = $input['rating'] ?? 5;
    $stayType = $input['stayType'] ?? '';
    $comment = $input['comment'] ?? '';
    
    $stmt = $conn->prepare("INSERT INTO reviews (id, roomId, userName, userAvatar, location, date, rating, stayType, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssis", $id, $roomId, $userName, $userAvatar, $location, $date, $rating, $stayType, $comment);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'data' => $input]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Create failed']);
    }
    $stmt->close();
}
?>
