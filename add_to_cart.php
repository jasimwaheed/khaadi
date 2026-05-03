<?php
session_start();

// ✅ Header SABSE pehle
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 0); // ✅ Production mein OFF rakho, errors JSON tod dete hain

include "../config/db.php";

// ✅ Debug line HATA do (ya comment kar do)
// echo json_encode(["session" => $_SESSION, "post" => $_POST]);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "not_logged_in"]);
    exit;
}

$user_id    = $_SESSION['user_id'];
$product_id = $_POST['product_id'] ?? 0;
$quantity   = $_POST['quantity'] ?? 1;

if ($product_id == 0) {
    echo json_encode(["status" => "error", "msg" => "Invalid product"]);
    exit;
}

if (!$conn) {
    echo json_encode(["status" => "error", "msg" => "DB connection failed"]);
    exit;
}

// ✅ SQL Injection se bachao — prepared statements use karo
$check = $conn->prepare("SELECT id FROM cart WHERE user_id=? AND product_id=?");
$check->bind_param("ii", $user_id, $product_id);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    $upd = $conn->prepare("UPDATE cart SET quantity = quantity + ? WHERE user_id=? AND product_id=?");
    $upd->bind_param("iii", $quantity, $user_id, $product_id);
    $upd->execute();
    echo json_encode(["status" => "updated"]);
} else {
    $ins = $conn->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
    $ins->bind_param("iii", $user_id, $product_id, $quantity);
    $ins->execute();
    echo json_encode(["status" => "added"]);
}
?>