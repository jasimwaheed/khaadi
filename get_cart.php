<?php
session_start();
header('Content-Type: application/json');
include "../config/db.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "not_logged_in", "cart" => []]);
    exit;
}

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("
    SELECT c.product_id, c.quantity, p.name, p.price, p.image
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$cart = [];
while ($row = $result->fetch_assoc()) {
    $cart[] = $row;
}

echo json_encode(["status" => "success", "cart" => $cart]);
?>