-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: sims_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `sims_db`
--



--
-- Table structure for table `academic_years`
--

DROP TABLE IF EXISTS `academic_years`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `academic_years` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year_name` varchar(30) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('upcoming','active','completed') NOT NULL DEFAULT 'upcoming',
  PRIMARY KEY (`id`),
  UNIQUE KEY `year_name` (`year_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_years`
--

LOCK TABLES `academic_years` WRITE;
/*!40000 ALTER TABLE `academic_years` DISABLE KEYS */;
INSERT INTO `academic_years` VALUES (1,'2026',NULL,NULL,'active');
/*!40000 ALTER TABLE `academic_years` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_records`
--

DROP TABLE IF EXISTS `attendance_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendance_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` int(11) NOT NULL,
  `enrollment_id` int(11) NOT NULL,
  `attendance_status` enum('Present','Absent','Late','Excused') NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_session_enrollment` (`session_id`,`enrollment_id`),
  KEY `fk_record_enrollment` (`enrollment_id`),
  CONSTRAINT `fk_record_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `student_enrollments` (`id`),
  CONSTRAINT `fk_record_session` FOREIGN KEY (`session_id`) REFERENCES `attendance_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_records`
--

LOCK TABLES `attendance_records` WRITE;
/*!40000 ALTER TABLE `attendance_records` DISABLE KEYS */;
INSERT INTO `attendance_records` VALUES (61,22,16,'Absent',NULL,'2026-11-16 15:54:53');
/*!40000 ALTER TABLE `attendance_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_sessions`
--

DROP TABLE IF EXISTS `attendance_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendance_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `term_id` int(11) NOT NULL,
  `attendance_date` date NOT NULL,
  `session_name` enum('Morning','Afternoon','Full day') NOT NULL DEFAULT 'Full day',
  `recorded_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_attendance_session` (`term_id`,`attendance_date`,`session_name`),
  KEY `fk_session_user` (`recorded_by`),
  CONSTRAINT `fk_session_term` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`),
  CONSTRAINT `fk_session_user` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_sessions`
--

LOCK TABLES `attendance_sessions` WRITE;
/*!40000 ALTER TABLE `attendance_sessions` DISABLE KEYS */;
INSERT INTO `attendance_sessions` VALUES (15,1,'2026-01-06','Morning',1,'2026-11-16 11:00:23'),(16,1,'2026-01-06','Afternoon',1,'2026-11-16 11:00:23'),(17,1,'2026-01-07','Morning',1,'2026-11-16 11:00:23'),(18,1,'2026-01-07','Afternoon',1,'2026-11-16 11:00:23'),(19,1,'2026-01-08','Full day',1,'2026-11-16 11:00:23'),(20,1,'2026-01-09','Morning',1,'2026-11-16 11:00:23'),(21,1,'2026-01-12','Full day',1,'2026-11-16 11:00:23'),(22,1,'2026-11-16','Full day',5,'2026-11-16 15:54:53');
/*!40000 ALTER TABLE `attendance_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combinations`
--

DROP TABLE IF EXISTS `combinations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `combinations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level_id` int(11) NOT NULL,
  `combination_name` varchar(80) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_combination_level` (`level_id`,`combination_name`),
  CONSTRAINT `fk_combinations_level` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combinations`
--

LOCK TABLES `combinations` WRITE;
/*!40000 ALTER TABLE `combinations` DISABLE KEYS */;
INSERT INTO `combinations` VALUES (1,1,'General',NULL),(2,2,'General',NULL),(3,3,'General',NULL),(4,1,'SWD','Software Development'),(5,1,'CSA','Computer Systems and Architecture'),(6,1,'BDC','Business Data Computing'),(7,1,'WOT','Web and Online Technology'),(8,1,'PLT','Programming and Logic Technology'),(9,2,'SWD','Software Development'),(10,2,'CSA','Computer Systems and Architecture'),(11,2,'BDC','Business Data Computing'),(12,2,'WOT','Web and Online Technology'),(13,2,'PLT','Programming and Logic Technology'),(14,3,'SWD','Software Development'),(15,3,'CSA','Computer Systems and Architecture'),(16,3,'BDC','Business Data Computing'),(17,3,'WOT','Web and Online Technology'),(18,3,'PLT','Programming and Logic Technology');
/*!40000 ALTER TABLE `combinations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `levels`
--

DROP TABLE IF EXISTS `levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `levels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level_name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `level_name` (`level_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `levels`
--

LOCK TABLES `levels` WRITE;
/*!40000 ALTER TABLE `levels` DISABLE KEYS */;
INSERT INTO `levels` VALUES (1,'L3'),(2,'L4'),(3,'L5');
/*!40000 ALTER TABLE `levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `permission_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permission_name` (`permission_name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'view_students','View student information'),(2,'create_students','Register students'),(3,'update_students','Edit student information'),(4,'delete_students','Delete student records'),(5,'manage_users','Manage system users'),(6,'manage_roles','Manage roles and permissions'),(7,'manage_supplies','Manage school supplies'),(8,'update_distribution','Update individual supply statuses'),(9,'confirm_distribution','Confirm final supply distribution'),(10,'view_reports','View system reports');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_role_permission` (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(40) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(2,'animation'),(3,'secretary');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_enrollments`
--

DROP TABLE IF EXISTS `student_enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_enrollments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `academic_year_id` int(11) NOT NULL,
  `combination_id` int(11) NOT NULL,
  `enrollment_date` date NOT NULL,
  `status` enum('active','completed','transferred') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_student_year` (`student_id`,`academic_year_id`),
  KEY `fk_enrollment_year` (`academic_year_id`),
  KEY `fk_enrollment_combination` (`combination_id`),
  CONSTRAINT `fk_enrollment_combination` FOREIGN KEY (`combination_id`) REFERENCES `combinations` (`id`),
  CONSTRAINT `fk_enrollment_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `fk_enrollment_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_enrollments`
--

LOCK TABLES `student_enrollments` WRITE;
/*!40000 ALTER TABLE `student_enrollments` DISABLE KEYS */;
INSERT INTO `student_enrollments` VALUES (13,1,1,4,'2026-11-16','active'),(16,2,1,9,'2026-11-16','active'),(17,12,1,14,'2026-11-16','active'),(18,3,1,14,'2026-11-16','active'),(19,8,1,14,'2026-11-17','active'),(20,6,1,6,'2026-11-18','active'),(21,11,1,11,'2026-11-18','active');
/*!40000 ALTER TABLE `student_enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_material_check_items`
--

DROP TABLE IF EXISTS `student_material_check_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_material_check_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `check_session_id` int(11) NOT NULL,
  `material_key` varchar(60) NOT NULL,
  `material_status` enum('OK','NYC') NOT NULL,
  `paid_amount` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_material_session_item` (`check_session_id`,`material_key`),
  CONSTRAINT `fk_material_item_session` FOREIGN KEY (`check_session_id`) REFERENCES `student_material_check_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_material_check_items`
--

LOCK TABLES `student_material_check_items` WRITE;
/*!40000 ALTER TABLE `student_material_check_items` DISABLE KEYS */;
INSERT INTO `student_material_check_items` VALUES (1,1,'ram','OK',NULL),(2,1,'buckets','OK',NULL),(3,1,'ikiyiko','OK',NULL),(4,1,'ifoke','NYC',NULL),(5,1,'isahane','OK',NULL),(6,1,'igikombe','OK',NULL),(7,1,'ph','OK',NULL),(8,1,'net','OK',NULL),(9,1,'enter_mines','NYC',NULL),(10,1,'decision','OK',NULL),(11,2,'ram','OK',NULL),(12,2,'buckets','OK',NULL),(13,2,'ikiyiko','OK',NULL),(14,2,'ifoke','OK',NULL),(15,2,'isahane','OK',NULL),(16,2,'igikombe','OK',NULL),(17,2,'ph','OK',NULL),(18,2,'net','OK',NULL),(19,2,'enter_mines','NYC',NULL),(20,2,'decision','OK',NULL),(21,3,'ram','OK',NULL),(22,3,'buckets','OK',NULL),(23,3,'ikiyiko','OK',NULL),(24,3,'ifoke','OK',NULL),(25,3,'isahane','OK',NULL),(26,3,'igikombe','OK',NULL),(27,3,'ph','OK',NULL),(28,3,'net','OK',NULL),(29,3,'enter_mines','OK',92000.00),(30,3,'decision','OK',NULL),(41,5,'ram','OK',NULL),(42,5,'buckets','OK',NULL),(43,5,'ikiyiko','OK',NULL),(44,5,'ifoke','OK',NULL),(45,5,'isahane','OK',NULL),(46,5,'igikombe','OK',NULL),(47,5,'ph','OK',NULL),(48,5,'net','OK',NULL),(49,5,'enter_mines','OK',92000.00),(50,5,'decision','OK',NULL),(51,6,'ph','OK',NULL),(52,6,'enter_mines','OK',92000.00),(53,6,'decision','OK',NULL),(54,6,'trip','OK',NULL);
/*!40000 ALTER TABLE `student_material_check_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_material_check_sessions`
--

DROP TABLE IF EXISTS `student_material_check_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_material_check_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `term_id` int(11) NOT NULL,
  `checking_date` date NOT NULL,
  `enrollment_id` int(11) NOT NULL,
  `checked_by` int(11) NOT NULL,
  `checked_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_material_session` (`term_id`,`checking_date`,`enrollment_id`),
  KEY `fk_material_session_enrollment` (`enrollment_id`),
  KEY `fk_material_session_user` (`checked_by`),
  CONSTRAINT `fk_material_session_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `student_enrollments` (`id`),
  CONSTRAINT `fk_material_session_term` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`),
  CONSTRAINT `fk_material_session_user` FOREIGN KEY (`checked_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_material_check_sessions`
--

LOCK TABLES `student_material_check_sessions` WRITE;
/*!40000 ALTER TABLE `student_material_check_sessions` DISABLE KEYS */;
INSERT INTO `student_material_check_sessions` VALUES (1,1,'2026-11-16',13,1,'2026-11-16 13:29:44'),(2,1,'2026-11-16',16,5,'2026-11-16 15:59:29'),(3,1,'2026-11-17',17,5,'2026-11-17 10:45:23'),(5,1,'2026-11-17',18,5,'2026-11-17 10:45:23'),(6,2,'2026-11-18',17,5,'2026-11-18 07:21:50');
/*!40000 ALTER TABLE `student_material_check_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_material_checks`
--

DROP TABLE IF EXISTS `student_material_checks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_material_checks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `term_id` int(11) NOT NULL,
  `checking_date` date NOT NULL,
  `enrollment_id` int(11) NOT NULL,
  `spoon_status` enum('Available','Missing') NOT NULL,
  `cup_status` enum('Available','Missing') NOT NULL,
  `bucket_status` enum('Available','Missing') NOT NULL,
  `checked_by` int(11) NOT NULL,
  `checked_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_material_check_student_day` (`term_id`,`checking_date`,`enrollment_id`),
  KEY `fk_material_check_enrollment` (`enrollment_id`),
  KEY `fk_material_check_user` (`checked_by`),
  CONSTRAINT `fk_material_check_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `student_enrollments` (`id`),
  CONSTRAINT `fk_material_check_term` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`),
  CONSTRAINT `fk_material_check_user` FOREIGN KEY (`checked_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_material_checks`
--

LOCK TABLES `student_material_checks` WRITE;
/*!40000 ALTER TABLE `student_material_checks` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_material_checks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admission_number` varchar(50) NOT NULL,
  `first_name` varchar(80) NOT NULL,
  `last_name` varchar(80) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `guardian_name` varchar(120) DEFAULT NULL,
  `guardian_phone` varchar(30) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive','graduated') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `admission_number` (`admission_number`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'STU001','Jean','Uwimana','Male','2005-03-12','0788000001','Peter Uwimana','0788111001','Kigali','active','2026-11-16 10:57:27','2026-11-16 10:57:27'),(2,'STU002','Alice','Mukamana','Female','2006-05-19','0788000002','Mary Mukamana','0788111002','Kigali','active','2026-11-16 10:57:27','2026-11-16 15:17:05'),(3,'STU003','David','Mugiraneza','Male','2005-08-14','0788000003','John Niyonzima','0788111003','BURERA','active','2026-11-16 10:57:27','2026-11-16 16:38:35'),(4,'STU004','Grace','Ingabire','Female','2006-01-10','0788000004','Sarah Ingabire','0788111004','Musanze','active','2026-11-16 10:57:27','2026-11-16 10:57:27'),(5,'STU005','Eric','Habimana','Male','2004-11-22','0788000005','Paul Habimana','0788111005','Kigali','active','2026-11-16 10:57:27','2026-11-16 10:57:27'),(6,'STU006','Diane','Uwamahoro','Female','2005-07-17','0788000006','Anne Uwamahoro','0788111006','Rubavu','active','2026-11-16 10:57:27','2026-11-18 06:52:34'),(7,'STU007','Patrick','Mugisha','Male','2004-04-09','0788000007','James Mugisha','0788111007','Kigali','active','2026-11-16 10:57:27','2026-11-16 10:57:27'),(8,'STU008','messi','Niyomukunzi','Female','2005-09-24','0788000008','Rose Mukeshimana','0788111008','Musanze','active','2026-11-16 10:57:27','2026-11-17 10:42:55'),(9,'STU009','Samuel','Nkurunziza','Male','2006-02-14','0788000009','David Nkurunziza','0788111009','Kigali','active','2026-11-16 10:57:27','2026-11-16 10:57:27'),(10,'STU010','Olive','Nyirahabimana','Female','2004-12-05','0788000010','Grace Nyirahabimana','0788111010','Musanze','active','2026-11-16 10:57:27','2026-11-16 10:57:27'),(11,'STU011','Emmanuel','Nsengimana','Male','2005-06-15','0788000011','Joseph Nsengimana','0788111011','Kigali','active','2026-11-16 10:57:27','2026-11-18 06:53:03'),(12,'STU012','Beatrice','Umutoni','Female','2006-10-29','0788000012','Alice Umutoni','0788111012','Rubavu','active','2026-11-16 10:57:27','2026-11-16 16:37:40');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplies`
--

DROP TABLE IF EXISTS `supplies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supplies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supply_code` varchar(50) NOT NULL,
  `supply_name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `supply_code` (`supply_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplies`
--

LOCK TABLES `supplies` WRITE;
/*!40000 ALTER TABLE `supplies` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supply_distribution_items`
--

DROP TABLE IF EXISTS `supply_distribution_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supply_distribution_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `distribution_id` int(11) NOT NULL,
  `supply_id` int(11) NOT NULL,
  `supply_status` enum('OK','NYC') DEFAULT 'NYC',
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_distribution_supply` (`distribution_id`,`supply_id`),
  KEY `fk_distribution_items_supplies` (`supply_id`),
  KEY `fk_distribution_items_users` (`updated_by`),
  CONSTRAINT `fk_distribution_items_distributions` FOREIGN KEY (`distribution_id`) REFERENCES `supply_distributions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_distribution_items_supplies` FOREIGN KEY (`supply_id`) REFERENCES `supplies` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_distribution_items_users` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supply_distribution_items`
--

LOCK TABLES `supply_distribution_items` WRITE;
/*!40000 ALTER TABLE `supply_distribution_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `supply_distribution_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supply_distributions`
--

DROP TABLE IF EXISTS `supply_distributions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supply_distributions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `enrollment_id` int(11) NOT NULL,
  `term_id` int(11) NOT NULL,
  `distribution_status` enum('pending','completed') DEFAULT 'pending',
  `confirmed_by` int(11) DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_enrollment_term` (`enrollment_id`,`term_id`),
  KEY `fk_distributions_terms` (`term_id`),
  KEY `fk_distributions_users` (`confirmed_by`),
  CONSTRAINT `fk_distributions_enrollments` FOREIGN KEY (`enrollment_id`) REFERENCES `student_enrollments` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_distributions_terms` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_distributions_users` FOREIGN KEY (`confirmed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supply_distributions`
--

LOCK TABLES `supply_distributions` WRITE;
/*!40000 ALTER TABLE `supply_distributions` DISABLE KEYS */;
/*!40000 ALTER TABLE `supply_distributions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `terms`
--

DROP TABLE IF EXISTS `terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `terms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `academic_year_id` int(11) NOT NULL,
  `term_number` tinyint(4) NOT NULL,
  `term_name` varchar(40) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('upcoming','active','completed') NOT NULL DEFAULT 'upcoming',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_term_year_number` (`academic_year_id`,`term_number`),
  CONSTRAINT `fk_terms_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `terms`
--

LOCK TABLES `terms` WRITE;
/*!40000 ALTER TABLE `terms` DISABLE KEYS */;
INSERT INTO `terms` VALUES (1,1,1,'Term I',NULL,NULL,'active'),(2,1,2,'Term II',NULL,NULL,'upcoming'),(3,1,3,'Term III',NULL,NULL,'upcoming');
/*!40000 ALTER TABLE `terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(120) NOT NULL,
  `username` varchar(60) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_users_role` (`role_id`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'System Administrator','admin','admin@sims.local','$2a$12$WvdZA9L2XS7otLIlD6iE3O1FpZacAVVIbcNdF3zGi4Dv5XQipPw0q',1,'active','2026-11-16 06:30:58'),(2,'David mugiraneza','David','davidmugiraneza34@gmail.com','$2a$12$i7hfpWK43WVUFt0GWETm7eQQGGumR1dYWGhqvj1wjoBT13x4LYKoW',1,'active','2026-11-16 06:39:55'),(4,'David mugiraneza','MG','davidmugiraneza@gmail.com','$2a$12$4irasUaqinMb5hLDdgLY6uZZ4xvjsKtdFVwRbtvAEX1p1QnlOEgau',2,'active','2026-11-16 06:45:23'),(5,'david','Animat','davidmugiraneza1@gmail.com','$2a$12$qHToRslfzP2S07UGAPMAhe0XtMopJ/IT2gyptuXM2ZTiPBuI4Zof2',2,'active','2026-11-16 06:59:51'),(9,'DavidSec','DavidSec','DavidSec@gmail.com','$2a$12$N6X/yyF61G/CjfsgzYxOfeQYKiB9hSHOHcFnpc1YHccceRRk1xrjS',3,'active','2026-11-17 11:16:08');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'sims_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-18 12:52:26
