<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db.php");

if (!$conn) {
    echo json_encode(["error" => "DB connection failed"]);
    exit;
}

$sql    = "SELECT * FROM orders ORDER BY id DESC";
$result = mysqli_query($conn, $sql);

$orders = [];
while ($row = mysqli_fetch_assoc($result)) {
    // ✅ items JSON se product_id lo aur products table se name/image fetch karo
    $items = json_decode($row['items'] ?? '[]', true);
    if (!empty($items)) {
        $pid     = intval($items[0]['product_id']);
        $pResult = $conn->query("SELECT name, image FROM products WHERE id=$pid");
        if ($pResult && $pResult->num_rows > 0) {
            $p = $pResult->fetch_assoc();
            $row['product_name']  = $p['name'];
            $row['product_image'] = $p['image'];
        } else {
            $row['product_name']  = "N/A";
            $row['product_image'] = "";
        }
    } else {
        $row['product_name']  = "N/A";
        $row['product_image'] = "";
    }
    $orders[] = $row;
}

echo json_encode($orders);
?>