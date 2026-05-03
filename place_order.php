<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");

include("../config/db.php");

if (!$conn) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "not_logged_in"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$name    = $_POST['name']    ?? '';
$phone   = $_POST['phone']   ?? '';
$address = $_POST['address'] ?? '';
$email   = $_POST['email']   ?? '';

if (!$name || !$phone || !$address || !$email) {
    echo json_encode(["status" => "error", "message" => "Fields missing"]);
    exit;
}
// ✅ NAYA — name aur image bhi save hoga
$cartStmt = $conn->prepare("
    SELECT c.product_id, c.quantity, p.price, p.name, p.image
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
");
$cartStmt->bind_param("i", $user_id);
$cartStmt->execute();
$cartResult = $cartStmt->get_result();
$cartItems  = $cartResult->fetch_all(MYSQLI_ASSOC);

if (empty($cartItems)) {
    echo json_encode(["status" => "error", "message" => "Cart khali hai"]);
    exit;
}

$total    = 0;
$quantity = 0;
foreach ($cartItems as $item) {
    $total    += $item['price'] * $item['quantity'];
    $quantity += $item['quantity'];
}

$itemsJson = json_encode($cartItems);

$stmt = $conn->prepare("
    INSERT INTO orders (user_id, name, phone, address, email, total, quantity, items, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
");
$stmt->bind_param("issssdis", $user_id, $name, $phone, $address, $email, $total, $quantity, $itemsJson);

if ($stmt->execute()) {
    $order_id    = $conn->insert_id;
    $tracking_id = "ORD-" . str_pad($order_id, 3, "0", STR_PAD_LEFT);

    $upd = $conn->prepare("UPDATE orders SET tracking_id=? WHERE id=?");
    $upd->bind_param("si", $tracking_id, $order_id);
    $upd->execute();

    $clear = $conn->prepare("DELETE FROM cart WHERE user_id=?");
    $clear->bind_param("i", $user_id);
    $clear->execute();

    echo json_encode([
        "status"      => "success",
        "order_id"    => $order_id,
        "tracking_id" => $tracking_id,
        "total"       => $total
    ]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}
?>