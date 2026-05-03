<?php
include "../config/db.php";

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE email='$email'";
$result = $conn->query($sql);

if($result->num_rows > 0){

    $user = $result->fetch_assoc();

    if(password_verify($password, $user['password'])){

        if($user['role'] == "admin"){
            echo json_encode(["status"=>"success","role"=>"admin"]);
        } else {
            echo json_encode(["status"=>"error","message"=>"Not admin"]);
        }

    } else {
        echo json_encode(["status"=>"error","message"=>"Wrong password"]);
    }

} else {
    echo json_encode(["status"=>"error","message"=>"User not found"]);
}
?>