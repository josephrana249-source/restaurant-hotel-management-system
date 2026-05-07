<?php
header("Content-Type: application/json; charset=UTF-8");

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

$payload = file_get_contents('php://input');
$data = json_decode($payload, true);

// Log callback for auditing
$logDir = __DIR__ . '/logs';
if (!is_dir($logDir)) mkdir($logDir, 0755, true);
$filename = $logDir . '/cb_' . date('Ymd_His') . '_' . uniqid() . '.json';
file_put_contents($filename, $payload);

$checkoutRequestID = $data['Body']['stkCallback']['CheckoutRequestID'] ?? null;
$resultCode = $data['Body']['stkCallback']['ResultCode'] ?? null;
$resultDesc = $data['Body']['stkCallback']['ResultDesc'] ?? null;

if ($checkoutRequestID) {
    $state = getMpesaState();
    if (isset($state[$checkoutRequestID])) {
        $status = ($resultCode === 0 || $resultCode === '0') ? 'Success' : 'Failed';
        $state[$checkoutRequestID]['status'] = $status;
        $state[$checkoutRequestID]['updatedAt'] = date('c');
        $state[$checkoutRequestID]['resultCode'] = $resultCode;
        $state[$checkoutRequestID]['resultDesc'] = $resultDesc;
        $state[$checkoutRequestID]['callbackData'] = $data;
        saveMpesaState($state);
    }
}

echo json_encode(["status" => "success", "message" => "Callback processed"]);
?>
