<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db.php");

$sql = "SELECT * FROM products ORDER BY id DESC";
$result = mysqli_query($conn, $sql);

$products = [];

while ($row = mysqli_fetch_assoc($result)) {
    $pid = $row['id'];

    // ✅ Har product ki extra images bhi fetch karo
    $imgResult = mysqli_query($conn, "SELECT image FROM product_images WHERE product_id = $pid");
    $extraImages = [];
    while ($imgRow = mysqli_fetch_assoc($imgResult)) {
        $extraImages[] = $imgRow['image'];
    }

    $row['extra_images'] = $extraImages;
    $products[] = $row;
}

echo json_encode($products);
?>