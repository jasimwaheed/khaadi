<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db.php"); // ✅ Yahi sahi path hai

$id = $_POST['id'] ?? '';

if (!$id) {
    echo json_encode(["status" => "error", "msg" => "ID missing"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM orders WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "msg" => "Order deleted"]);
} else {
    echo json_encode(["status" => "error", "msg" => $conn->error]);
}
?>