<?php
/**
 * Database Configuration
 * RHMS Database
 */

// Allow CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'rhms_db');

// Function to get database connection
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database connection failed']);
        exit();
    }
    $conn->set_charset("utf8mb4");
    return $conn;
}

/**
 * M-Pesa Configuration
 * RHMS Payment System
 */

// Safaricom Daraja API Credentials
define('MPESA_ENV', 'sandbox'); // 'sandbox' or 'live'
define('MPESA_CONSUMER_KEY', 'zQ2STtENqcQKxWw1ProX7KkB1jNLKtg8ffoXfZIHY1wV5aMC');
define('MPESA_CONSUMER_SECRET', 'nUpcLHHrLPOwutfVECeOr0kMUnjU0mO0GYpbX02eG4mHn9SEsb5z4nQ2AppLmHPL');
define('MPESA_BUSINESS_SHORT_CODE', '174379');
define('MPESA_PASSKEY', 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919');

// URLs
$baseUrl = (MPESA_ENV === 'live') ? 'https://api.safaricom.co.ke/' : 'https://sandbox.safaricom.co.ke/';
define('MPESA_BASE_URL', $baseUrl);

// CALLBACK URL
// IMPORTANT: M-Pesa callbacks require a public HTTPS URL.
// On localhost, use ngrok: ngrok http 80
// Then set: 'https://YOUR-ID.ngrok-free.app/RHMS/api/mpesa_callback.php'
// For sandbox testing without ngrok, Safaricom will accept the push but won't deliver callback.
// The auto-approval simulation in mpesa_status.php handles this for local dev.
define('MPESA_CALLBACK_URL', 'https://mydomain.com/RHMS/api/mpesa_callback.php'); 

/**
 * Helper to get access token (cached for 50 minutes)
 */
function getMpesaAccessToken() {
    // Check for cached token first
    $cacheFile = __DIR__ . '/mpesa_token_cache.json';
    if (file_exists($cacheFile)) {
        $cache = json_decode(file_get_contents($cacheFile), true);
        if ($cache && isset($cache['access_token']) && isset($cache['expires_at'])) {
            if (time() < $cache['expires_at']) {
                return $cache['access_token'];
            }
        }
    }

    $url = MPESA_BASE_URL . 'oauth/v1/generate?grant_type=client_credentials';
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    $credentials = base64_encode(MPESA_CONSUMER_KEY . ':' . MPESA_CONSUMER_SECRET);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array('Authorization: Basic ' . $credentials));
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
    curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 15);
    curl_setopt($curl, CURLOPT_TIMEOUT, 30);
    curl_setopt($curl, CURLOPT_DNS_CACHE_TIMEOUT, 600);
    
    $res = curl_exec($curl);
    $error = curl_error($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    
    $logFile = __DIR__ . '/mpesa_debug.log';
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Token Request: URL=$url, HTTPCode=$httpCode, Error=$error\n", FILE_APPEND);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Token Response: $res\n", FILE_APPEND);
    
    if (!$res) return null;
    $results = json_decode($res, true);
    $token = $results['access_token'] ?? null;
    
    // Cache the token (expire 50 min before actual expiry for safety)
    if ($token) {
        $expiresIn = isset($results['expires_in']) ? (int)$results['expires_in'] : 3599;
        file_put_contents($cacheFile, json_encode([
            'access_token' => $token,
            'expires_at' => time() + $expiresIn - 600
        ]), LOCK_EX);
    }
    
    return $token;
}

/**
 * Email Configuration
 * Used for Account Verification & Notifications
 */
define('MAIL_DEBUG', true); // Set to true to log emails to api/logs/mail_debug.log if mail() fails
define('USE_SMTP', false);   // Set to true if you want to use an external SMTP server (requires PHPMailer or similar)

// SMTP Settings (If USE_SMTP is true, these will be used)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASS', 'your-app-password');
define('SMTP_FROM', 'no-reply@rhms.com');
define('SMTP_FROM_NAME', 'RHMS Security');
