<?php
session_start();
header('Content-Type: application/json'); // ✅ pehle

include "../config/db.php";

$email    = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// ✅ Prepared statement — SQL injection se bachao
$stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // ✅ password_verify — hashed password check karo
    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id']   = $user['id'];
        $_SESSION['user_name'] = $user['name'];

        echo json_encode(["status" => "success", "name" => $user['name']]);
    } else {
        echo json_encode(["status" => "error", "msg" => "Invalid login"]);
    }
} else {
    echo json_encode(["status" => "error", "msg" => "Invalid login"]);
}
?>