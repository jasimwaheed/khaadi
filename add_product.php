<?php
include "../config/db.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

ini_set('display_errors', 0);
error_reporting(0);

$name        = $_POST['name']        ?? '';
$price       = $_POST['price']       ?? '';
$description = $_POST['description'] ?? '';

if (empty($name) || empty($price) || empty($description)) {
    echo json_encode(["status" => "error", "message" => "missing data"]);
    exit;
}

$uploadDir = __DIR__ . "/../uploads/";
if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

// ✅ Pehli image products table ke liye
$firstImage = "";
if (isset($_FILES['images']['name'][0]) && $_FILES['images']['error'][0] === 0) {
    $firstImage = time() . "_" . basename($_FILES['images']['name'][0]);
    move_uploaded_file($_FILES['images']['tmp_name'][0], $uploadDir . $firstImage);
}

// ✅ Product insert
$stmt = $conn->prepare("INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("ssss", $name, $price, $description, $firstImage);

if (!$stmt->execute()) {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
    exit;
}

$product_id = $conn->insert_id;

// ✅ Saari images product_images table mein save karo
if (isset($_FILES['images']['name'])) {
    foreach ($_FILES['images']['name'] as $i => $imgName) {
        if ($_FILES['images']['error'][$i] === 0) {
            $fileName = time() . "_" . $i . "_" . basename($imgName);
            move_uploaded_file($_FILES['images']['tmp_name'][$i], $uploadDir . $fileName);

            $imgStmt = $conn->prepare("INSERT INTO product_images (product_id, image) VALUES (?, ?)");
            if ($imgStmt) {
                $imgStmt->bind_param("is", $product_id, $fileName);
                $imgStmt->execute();
                $imgStmt->close();
            }
        }
    }
}

$stmt->close();
echo json_encode(["status" => "success", "message" => "Product added successfully"]);
?>