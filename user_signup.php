<?php
session_start();
header('Content-Type: application/json'); // ✅ include se pehle

include "../config/db.php";

// ... baaki sab same rehne do, kuch change nahi

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if(empty($name) || empty($email) || empty($password)){
    echo json_encode([
        "status" => "error",
        "msg" => "All fields required"
    ]);
    exit;
}

// check existing user
$stmt = $conn->prepare("SELECT id FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows > 0){
    echo json_encode([
        "status" => "error",
        "msg" => "Email already exists"
    ]);
    exit;
}

// hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// insert user
$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $hashedPassword);

if($stmt->execute()){
    
    // ✅ AUTO LOGIN after signup
    $_SESSION['user_id'] = $conn->insert_id;
    $_SESSION['user_name'] = $name;

    echo json_encode([
        "status" => "success",
        "msg" => "Signup successful"
    ]);

} else {
    echo json_encode([
        "status" => "error",
        "msg" => "Signup failed"
    ]);
}
?>