<?php
include "../config/db.php";

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;

if($id <= 0){
    echo "invalid id";
    exit;
}

$stmt = $conn->prepare("DELETE FROM products WHERE id = ?");

if(!$stmt){
    die("Prepare failed: " . $conn->error);
}

$stmt->bind_param("i", $id);

if($stmt->execute()){

    if($stmt->affected_rows > 0){
        echo "success";
    } else {
        echo "not found";
    }

} else {
    echo "error: " . $stmt->error;
}

$stmt->close();
?>