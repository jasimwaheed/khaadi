<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");

if (isset($_SESSION['loggedIn']) && $_SESSION['loggedIn'] === true) {
    echo json_encode([
        "loggedIn"    => true,
        "currentUser" => $_SESSION['currentUser'],
        "userId"      => $_SESSION['userId']
    ]);
} else {
    echo json_encode(["loggedIn" => false]);
}
?>