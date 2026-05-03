-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 03, 2026 at 05:04 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `khaadi_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `created_at`) VALUES
(2, 1, 69, 1, '2026-05-02 13:59:01');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `tracking_id` varchar(20) DEFAULT NULL,
  `items` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `name`, `phone`, `address`, `email`, `quantity`, `total`, `status`, `tracking_id`, `items`) VALUES
(11, 2, 'JASIM', '123455', 'ATTOCK', 'jasimkhan5917@gmail.com', 1, 9999.00, 'pending', 'ORD-011', '[{\"product_id\": 70, \"quantity\": 1, \"price\": \"9999.00\", \"name\": \"jj\", \"image\": \"1777725612_dress.webp\"}]'),
(12, 2, 'JASIM', '123455', 'ATTOCK', 'jasimkhan5917@gmail.com', 3, 29997.00, 'pending', 'ORD-012', '[{\"product_id\": 70, \"quantity\": 1, \"price\": \"9999.00\", \"name\": \"jj\", \"image\": \"1777725612_dress.webp\"}]'),
(13, 2, 'JASIM', '123455', 'ATTOCK', 'jasimkhan5917@gmail.com', 4, 39996.00, 'pending', 'ORD-013', '[{\"product_id\": 71, \"quantity\": 2, \"price\": \"9999.00\", \"name\": \"jj\", \"image\": \"1777725685_download.webp\"}]'),
(14, 2, 'JASIM', '123455', 'ATTOCK', 'jasimkhan5917@gmail.com', 1, 9999.00, 'pending', 'ORD-014', '[{\"product_id\": 70, \"quantity\": 1, \"price\": \"9999.00\", \"name\": \"jj\", \"image\": \"1777725612_dress.webp\"}]'),
(15, 2, 'JASIM', '123455', 'ATTOCK', 'jasimkhan5917@gmail.com', 1, 9999.00, 'pending', 'ORD-015', '[{\"product_id\": 70, \"quantity\": 1, \"price\": \"9999.00\", \"name\": \"jj\", \"image\": \"1777725612_dress.webp\"}]'),
(16, 2, 'JASIM', '123455', 'ATTOCK', 'jasimkhan5917@gmail.com', 1, 9999.00, 'pending', 'ORD-016', '[{\"product_id\": 70, \"quantity\": 1, \"price\": \"9999.00\", \"name\": \"jj\", \"image\": \"1777725612_dress.webp\"}]'),
(17, 2, 'JASIM', '123455', 'ATTOCK', 'jasimkhan5917@gmail.com', 2, 11232.00, 'pending', 'ORD-017', '[{\"product_id\": 72, \"quantity\": 1, \"price\": \"1233.00\", \"name\": \"ALI\", \"image\": \"1777727043_dress - Copy.webp\"}]'),
(18, 3, 'JASIM', '123455', 'ATTOCK', 'jasimkhan5917@gmail.com', 1, 8999.00, 'pending', 'ORD-018', '[{\"product_id\":73,\"quantity\":1,\"price\":\"8999.00\",\"name\":\"WHEED\",\"image\":\"1777736647_dress.webp\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` longtext DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `image`, `description`) VALUES
(59, 'kamra', 8999.00, '1777706640_download (1).webp', 'ali'),
(60, 'jj', 6666.00, '1777707146_dress.webp', 'kk'),
(61, 'jj', 9999.00, '1777708412_OIP (1).webp', 'kk'),
(62, 'jj', 9999.00, '1777708991_download.webp', 'ALI'),
(63, 'jj', 9999.00, '1777725186_dress - Copy.webp', 'KAMRA'),
(64, 'jj', 9999.00, '1777725187_dress - Copy.webp', 'KAMRA'),
(65, 'jj', 9999.00, '1777725189_dress - Copy.webp', 'KAMRA'),
(66, 'jj', 9999.00, '1777725203_dress - Copy.webp', 'KAMRA'),
(67, 'jj', 9999.00, '1777725204_dress - Copy.webp', 'KAMRA'),
(68, 'jj', 9999.00, '1777725243_OIP - Copy.webp', 'KAMRA'),
(69, 'jj', 9999.00, '1777725243_OIP - Copy.webp', 'KAMRA'),
(70, 'jj', 9999.00, '1777725612_dress.webp', 'KAMRA'),
(71, 'jj', 9999.00, '1777725685_download.webp', 'KAMRA'),
(72, 'ALI', 1233.00, '1777727043_dress - Copy.webp', 'kk'),
(73, 'WHEED', 8999.00, '1777736647_dress.webp', 'sss');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image`) VALUES
(1, 70, '1777725612_0_dress.webp'),
(2, 70, '1777725612_1_OIP - Copy - Copy (2).webp'),
(3, 70, '1777725612_2_OIP - Copy - Copy.webp'),
(4, 71, '1777725685_0_download.webp'),
(5, 71, '1777725685_1_dress - Copy.webp'),
(6, 71, '1777725685_2_dress.webp'),
(7, 71, '1777725685_3_OIP - Copy - Copy (2).webp'),
(8, 71, '1777725685_4_OIP - Copy - Copy.webp'),
(9, 72, '1777727043_0_dress - Copy.webp'),
(10, 72, '1777727043_1_OIP - Copy - Copy (2).webp'),
(11, 73, '1777736647_0_dress.webp'),
(12, 73, '1777736647_1_OIP - Copy - Copy (2).webp');

-- --------------------------------------------------------

--
-- Table structure for table `test_table`
--

CREATE TABLE `test_table` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(3, 'ali', 'jasimwaheed5917@gmail.com', '$2y$10$qmgHq9PhTnAGtoZqXyrE1.GyOPzsFg/tdTzUdpdnLdznJZp0hmd3e', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `test_table`
--
ALTER TABLE `test_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `test_table`
--
ALTER TABLE `test_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
