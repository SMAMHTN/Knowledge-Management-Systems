-- MariaDB dump 10.19  Distrib 10.6.11-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: kms
-- ------------------------------------------------------
-- Server version	10.6.11-MariaDB-0ubuntu0.22.04.1

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
-- Table structure for table `kms_article`
--

DROP TABLE IF EXISTS `kms_article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kms_article` (
  `article_id` int(11) NOT NULL AUTO_INCREMENT,
  `article_owner_id` int(11) NOT NULL,
  `article_last_edited_by` int(11) NOT NULL,
  `article_last_edited_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `article_tag` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`article_tag`)),
  `article_title` varchar(255) DEFAULT NULL,
  `article_category_id` int(11) DEFAULT NULL,
  `article_article` longtext DEFAULT NULL,
  `article_file_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`article_file_id`)),
  `article_doc_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`article_doc_id`)),
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`article_id`),
  UNIQUE KEY `kms_article_UN` (`article_title`),
  KEY `kms_article_FK_category` (`article_category_id`),
  CONSTRAINT `kms_article_FK_category` FOREIGN KEY (`article_category_id`) REFERENCES `kms_category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kms_article`
--

LOCK TABLES `kms_article` WRITE;
/*!40000 ALTER TABLE `kms_article` DISABLE KEYS */;
/*!40000 ALTER TABLE `kms_article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kms_category`
--

DROP TABLE IF EXISTS `kms_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kms_category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `category_parent_id` int(11) NOT NULL,
  `category_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `kms_category_UN` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kms_category`
--

LOCK TABLES `kms_category` WRITE;
/*!40000 ALTER TABLE `kms_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `kms_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kms_doc`
--

DROP TABLE IF EXISTS `kms_doc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kms_doc` (
  `doc_id` int(11) NOT NULL AUTO_INCREMENT,
  `doc_loc` varchar(255) NOT NULL,
  `doc_owner_id` int(11) NOT NULL,
  `doc_type` varchar(50) NOT NULL,
  PRIMARY KEY (`doc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kms_doc`
--

LOCK TABLES `kms_doc` WRITE;
/*!40000 ALTER TABLE `kms_doc` DISABLE KEYS */;
/*!40000 ALTER TABLE `kms_doc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kms_file`
--

DROP TABLE IF EXISTS `kms_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kms_file` (
  `file_id` int(11) NOT NULL AUTO_INCREMENT,
  `file_loc` varchar(255) NOT NULL,
  `file_owner_id` int(11) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kms_file`
--

LOCK TABLES `kms_file` WRITE;
/*!40000 ALTER TABLE `kms_file` DISABLE KEYS */;
/*!40000 ALTER TABLE `kms_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kms_permission`
--

DROP TABLE IF EXISTS `kms_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kms_permission` (
  `permission_id` int(11) NOT NULL AUTO_INCREMENT,
  `permission_category_id` int(11) NOT NULL,
  `permission_role_id` int(11) NOT NULL,
  `permission_create` tinyint(1) NOT NULL DEFAULT 0,
  `permission_read` tinyint(1) NOT NULL DEFAULT 0,
  `permission_update` tinyint(1) NOT NULL DEFAULT 0,
  `permission_delete` tinyint(1) NOT NULL DEFAULT 0,
  `permission_doc_type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permission_doc_type`)),
  `permission_file_type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permission_file_type`)),
  PRIMARY KEY (`permission_id`),
  KEY `kms_permission_FK` (`permission_category_id`),
  CONSTRAINT `kms_permission_FK` FOREIGN KEY (`permission_category_id`) REFERENCES `kms_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kms_permission`
--

LOCK TABLES `kms_permission` WRITE;
/*!40000 ALTER TABLE `kms_permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `kms_permission` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-23 15:16:02
