<?php
require_once __DIR__ . '/config.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$checkoutRequestID = $_GET['checkoutRequestID'] ?? null;
if (!$checkoutRequestID) {
    echo json_encode(["status" => "error", "message" => "Missing checkoutRequestID"]);
    exit;
}

$stateFile = __DIR__ . '/mpesa_state.json';
$logFile = __DIR__ . '/mpesa_debug.log';
$state = [];
if (file_exists($stateFile)) {
    $json = file_get_contents($stateFile);
    $data = json_decode($json, true);
    if (is_array($data)) {
        $state = $data;
    }
}

if (!isset($state[$checkoutRequestID])) {
    echo json_encode(["status" => "Pending"]);
    exit;
}

$data = $state[$checkoutRequestID];

// ─── SIMULATED TRANSACTIONS: Auto-approve after 3 seconds ───
if (isset($data['simulated']) && $data['simulated'] === true && $data['status'] === 'Pending') {
    $createdAt = strtotime($data['createdAt']);
    if (time() - $createdAt > 3) {
        $data['status'] = 'Success';
        $data['resultDesc'] = 'The service request is processed successfully.';
        $state[$checkoutRequestID] = $data;
        file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT), LOCK_EX);
    }
    echo json_encode($data);
    exit;
}

// ─── REAL TRANSACTIONS: Query Safaricom STK Push Status API ───
if ($data['status'] === 'Pending' && !isset($data['simulated'])) {
    
    // Don't query too frequently — wait at least 7 seconds after creation
    $createdAt = strtotime($data['createdAt']);
    if (time() - $createdAt < 7) {
        echo json_encode($data);
        exit;
    }
    
    // Throttle queries: don't re-query if we queried less than 8 seconds ago
    // (Safaricom sandbox allows max 5 requests/minute)
    if (isset($data['lastQueried']) && (time() - $data['lastQueried']) < 8) {
        echo json_encode($data);
        exit;
    }

    $accessToken = getMpesaAccessToken();
    
    if ($accessToken) {
        $timestamp = date('YmdHis');
        $password = base64_encode(MPESA_BUSINESS_SHORT_CODE . MPESA_PASSKEY . $timestamp);
        
        $queryUrl = MPESA_BASE_URL . 'mpesa/stkpushquery/v1/query';
        $queryData = [
            'BusinessShortCode' => MPESA_BUSINESS_SHORT_CODE,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'CheckoutRequestID' => $checkoutRequestID
        ];
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $queryUrl);
        curl_setopt($curl, CURLOPT_HTTPHEADER, [
            'Content-Type:application/json',
            'Authorization:Bearer ' . $accessToken
        ]);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($queryData));
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($curl, CURLOPT_TIMEOUT, 15);
        
        $response = curl_exec($curl);
        $curlError = curl_error($curl);
        curl_close($curl);
        
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - STK Query [$checkoutRequestID]: $response (Error: $curlError)\n", FILE_APPEND);
        
        if ($response) {
            $result = json_decode($response, true);
            $resultCode = $result['ResultCode'] ?? null;
            
            // Update last query timestamp
            $data['lastQueried'] = time();
            
            if ($resultCode !== null) {
                switch ((string)$resultCode) {
                    case '0':
                        // ✅ Payment successful
                        $data['status'] = 'Success';
                        $data['resultCode'] = 0;
                        $data['resultDesc'] = $result['ResultDesc'] ?? 'The service request is processed successfully.';
                        file_put_contents($logFile, date('Y-m-d H:i:s') . " - ✅ Payment SUCCESS for $checkoutRequestID\n", FILE_APPEND);
                        break;
                    
                    case '1032':
                        // ❌ User cancelled the request
                        $data['status'] = 'Cancelled';
                        $data['resultCode'] = 1032;
                        $data['resultDesc'] = 'Request cancelled by user.';
                        file_put_contents($logFile, date('Y-m-d H:i:s') . " - ❌ Payment CANCELLED by user for $checkoutRequestID\n", FILE_APPEND);
                        break;
                    
                    case '1037':
                        // ⏰ STK push timed out (user didn't respond)
                        $data['status'] = 'Failed';
                        $data['resultCode'] = 1037;
                        $data['resultDesc'] = 'Request timed out. The user did not respond.';
                        file_put_contents($logFile, date('Y-m-d H:i:s') . " - ⏰ Payment TIMEOUT for $checkoutRequestID\n", FILE_APPEND);
                        break;
                    
                    case '1':
                        // 💰 Insufficient balance
                        $data['status'] = 'Failed';
                        $data['resultCode'] = 1;
                        $data['resultDesc'] = 'Insufficient funds in M-Pesa account.';
                        file_put_contents($logFile, date('Y-m-d H:i:s') . " - 💰 INSUFFICIENT FUNDS for $checkoutRequestID\n", FILE_APPEND);
                        break;
                    
                    case '2001':
                        // 🔐 Wrong PIN entered
                        $data['status'] = 'Failed';
                        $data['resultCode'] = 2001;
                        $data['resultDesc'] = 'Wrong M-Pesa PIN entered.';
                        file_put_contents($logFile, date('Y-m-d H:i:s') . " - 🔐 WRONG PIN for $checkoutRequestID\n", FILE_APPEND);
                        break;
                    
                    default:
                        // Other non-zero result = failed
                        if ((int)$resultCode !== 0) {
                            $data['status'] = 'Failed';
                            $data['resultCode'] = (int)$resultCode;
                            $data['resultDesc'] = $result['ResultDesc'] ?? "Payment failed (Code: $resultCode)";
                            file_put_contents($logFile, date('Y-m-d H:i:s') . " - ❌ Payment FAILED (Code: $resultCode) for $checkoutRequestID\n", FILE_APPEND);
                        }
                        break;
                }
            }
            
            // Save updated state
            $state[$checkoutRequestID] = $data;
            file_put_contents($stateFile, json_encode($state, JSON_PRETTY_PRINT), LOCK_EX);
        }
    }
}

echo json_encode($data);
