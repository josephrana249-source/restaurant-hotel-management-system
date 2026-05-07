<?php
require_once __DIR__ . '/config.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function formatPhone($phone) {
    if (!$phone) return null;
    $digits = preg_replace('/\D+/', '', $phone);
    
    // Handle 9 digits (7xx... / 1xx...)
    if (strlen($digits) === 9) {
        return '254' . $digits;
    }
    // Handle 10 digits (07xx... / 01xx...)
    if (strlen($digits) === 10 && strpos($digits, '0') === 0) {
        return '254' . substr($digits, 1);
    }
    // Handle 12 digits (2547xx... / 2541xx...)
    if (strlen($digits) === 12 && strpos($digits, '254') === 0) {
        return $digits;
    }
    return null;
}

function getMpesaState() {
    $stateFile = __DIR__ . '/mpesa_state.json';
    if (!file_exists($stateFile)) return [];
    $json = file_get_contents($stateFile);
    return json_decode($json, true) ?: [];
}

function saveMpesaState($state) {
    $stateFile = __DIR__ . '/mpesa_state.json';
    file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT), LOCK_EX);
}

function triggerSimulation($phone, $amount) {
    $checkoutRequestID = 'SIM-' . uniqid();
    $state = getMpesaState();
    $state[$checkoutRequestID] = [
        'status' => 'Pending',
        'simulated' => true,
        'createdAt' => date('c'),
        'amount' => $amount,
        'phone' => $phone
    ];
    saveMpesaState($state);
    echo json_encode([
        "ResponseCode" => "0",
        "ResponseDescription" => "Simulation started",
        "CheckoutRequestID" => $checkoutRequestID,
        "CustomerMessage" => "Please enter your M-Pesa PIN on the prompt sent to your phone.",
        "simulated" => true
    ]);
}



// Log incoming request for debugging
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput);
$logFile = __DIR__ . '/mpesa_debug.log';
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Incoming Request: " . $rawInput . "\n", FILE_APPEND);

if (!empty($data->phone) && !empty($data->amount)) {
    $phone = formatPhone($data->phone);
    $amount = round(floatval($data->amount));

    // Send the actual amount requested (no hardcoding)
    // Note: Sandbox might reject amounts < 50, but real amount is still sent

    if (!$phone) {
        echo json_encode(["status" => "error", "message" => "Invalid phone format. Please enter 9 or 10 digits."]);
        exit;
    }

    // Detect local development environment
    $isLocal = strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false || strpos($_SERVER['HTTP_HOST'], '192.168.') !== false;

    // Development Simulation Mode (manual flag)
    if (isset($data->simulate) && $data->simulate === true) {
        triggerSimulation($phone, $amount);
        exit;
    }

    // Capture access token
    $accessToken = getMpesaAccessToken();
    
    // Fallback logic for local development
    if (!$accessToken) {
        if ($isLocal) {
            triggerSimulation($phone, $amount); // Fallback to simulation to keep user moving
            exit;
        }
        
        echo json_encode([
            "status" => "error", 
            "message" => "Safaricom API Unreachable (DNS Timeout).",
            "details" => "If on Windows/XAMPP, try adding '45.223.20.17 sandbox.safaricom.co.ke' to your hosts file."
        ]);
        exit;
    }


    $timestamp = date('YmdHis');
    $password = base64_encode(MPESA_BUSINESS_SHORT_CODE . MPESA_PASSKEY . $timestamp);
    
    // Callback URL - Safaricom requires a public HTTPS URL.
    // If not set/local, we use a placeholder that at least passes Safaricom validation.
    $callbackUrl = MPESA_CALLBACK_URL;

    $url = MPESA_BASE_URL . 'mpesa/stkpush/v1/processrequest';
    $curl_post_data = [
        'BusinessShortCode' => MPESA_BUSINESS_SHORT_CODE,
        'Password' => $password,
        'Timestamp' => $timestamp,
        'TransactionType' => 'CustomerPayBillOnline',
        'Amount' => $amount,
        'PartyA' => $phone,
        'PartyB' => MPESA_BUSINESS_SHORT_CODE,
        'PhoneNumber' => $phone,
        'CallBackURL' => $callbackUrl,
        'AccountReference' => 'RHMS_PLATFORM',
        'TransactionDesc' => 'Payment for service'
    ];

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type:application/json', 'Authorization:Bearer ' . $accessToken]);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($curl_post_data));
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
    curl_setopt($curl, CURLOPT_TIMEOUT, 15);

    $curl_response = curl_exec($curl);
    $curl_error = curl_error($curl);
    curl_close($curl);
    
    // Log for debugging
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - STK Request: " . json_encode($curl_post_data) . "\n", FILE_APPEND);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - STK Response: " . ($curl_response ?: "FAILED: $curl_error") . "\n", FILE_APPEND);

    $decoded = json_decode($curl_response, true);
    
    // If STK push call itself fails (e.g. connection reset) and we are local
    if (!$curl_response && $isLocal) {
        triggerSimulation($phone, $amount);
        exit;
    }

    if (isset($decoded['CheckoutRequestID'])) {
        $state = getMpesaState();
        $state[$decoded['CheckoutRequestID']] = [
            'status' => 'Pending',
            'createdAt' => date('c'),
            'amount' => $amount,
            'phone' => $phone
        ];
        saveMpesaState($state);
    }

    echo $curl_response;
} else {
    echo json_encode(["status" => "error", "message" => "Incomplete payment data"]);
}
?>

