<?php
session_start();
header('Content-Type: application/json');
include "../config/db.php";

if (!isset($_SESSION['user_id'])) { echo json_encode(["status"=>"not_logged_in"]); exit; }

$user_id    = $_SESSION['user_id'];
$product_id = $_POST['product_id'] ?? 0;

$stmt = $conn->prepare("DELETE FROM cart WHERE user_id=? AND product_id=?");
$stmt->bind_param("ii", $user_id, $product_id);
$stmt->execute();

echo json_encode(["status" => "removed"]);
?>