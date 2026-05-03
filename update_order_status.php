<?php
include("../config/db.php");

header("Content-Type: application/json");

$id     = $_POST['id']     ?? 0;
$status = $_POST['status'] ?? '';

if (!$id || !$status) {
    echo json_encode(["error" => "Invalid data"]);
    exit;
}

$sql = "UPDATE orders SET status='$status' WHERE id='$id'";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["error" => mysqli_error($conn)]);
}
?>