<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db.php");

if (!$conn) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit;
}

$tracking_id = $_POST['tracking_id'] ?? '';

if (!$tracking_id) {
    echo json_encode(["status" => "error", "message" => "Tracking ID missing"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM orders WHERE tracking_id = ?");
$stmt->bind_param("s", $tracking_id);
$stmt->execute();
$result = $stmt->get_result();
$order = $result->fetch_assoc();

if (!$order) {
    echo json_encode(["status" => "not_found", "message" => "No order found"]);
    exit;
}

echo json_encode(["status" => "success", "order" => $order]);
?>