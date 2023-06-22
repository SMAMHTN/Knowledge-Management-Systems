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
  `ArticleID` int(11) NOT NULL AUTO_INCREMENT,
  `OwnerID` int(11) NOT NULL,
  `LastEditedByID` int(11) NOT NULL,
  `LastEditedTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Tag` longtext DEFAULT "[]",
  `Title` varchar(255) NOT NULL,
  `CategoryID` int(11) DEFAULT 1,
  `Article` longtext DEFAULT NULL,
  `FileID` longtext DEFAULT "[]",
  `DocID` longtext DEFAULT "[]",
  `IsActive` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`ArticleID`),
  UNIQUE KEY `kms_article_UN` (`Title`),
  KEY `kms_article_FK_category` (`CategoryID`),
  CONSTRAINT `kms_article_FK_category` FOREIGN KEY (`CategoryID`) REFERENCES `kms_category` (`CategoryID`) ON UPDATE CASCADE
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
  `CategoryID` int(11) NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(255) NOT NULL,
  `CategoryParentID` int(11) NOT NULL,
  `CategoryDescription` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`CategoryID`),
  UNIQUE KEY `kms_category_UN` (`CategoryName`),
  CONSTRAINT `kms_category_parent_rel` FOREIGN KEY (`CategoryParentID`) REFERENCES `kms_category` (`CategoryID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kms_category`
--

LOCK TABLES `kms_category` WRITE;
/*!40000 ALTER TABLE `kms_category` DISABLE KEYS */;
INSERT INTO `kms_category` VALUES (1, "Public", 1, "Can be seen by Everyone");
INSERT INTO `kms_category` VALUES (2, "Parent", 2, "Parent Category");
/*!40000 ALTER TABLE `kms_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kms_doc`
--

DROP TABLE IF EXISTS `kms_doc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kms_doc` (
  `DocID` int(11) NOT NULL AUTO_INCREMENT,
  `DocLoc` varchar(255) NOT NULL,
  `CategoryID` int(11) NOT NULL,
  `DocType` varchar(50) NOT NULL,
  PRIMARY KEY (`DocID`)
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
  `FileID` int(11) NOT NULL AUTO_INCREMENT,
  `FileLoc` varchar(255) NOT NULL,
  `CategoryID` int(11) NOT NULL,
  `FileType` varchar(50) NOT NULL,
  PRIMARY KEY (`FileID`)
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
  `PermissionID` int(11) NOT NULL AUTO_INCREMENT,
  `CategoryID` int(11) NOT NULL,
  `RoleID` int(11) NOT NULL,
  `Create` tinyint(1) NOT NULL DEFAULT 0,
  `Read` tinyint(1) NOT NULL DEFAULT 0,
  `Update` tinyint(1) NOT NULL DEFAULT 0,
  `Delete` tinyint(1) NOT NULL DEFAULT 0,
  `FileType` longtext DEFAULT "[]",
  `DocType` longtext DEFAULT "[]",
  PRIMARY KEY (`PermissionID`),
  UNIQUE KEY `kms_permission_UN` (`CategoryID`, `RoleID`),
  KEY `kms_permission_FK` (`CategoryID`),
  CONSTRAINT `kms_permission_FK` FOREIGN KEY (`CategoryID`) REFERENCES `kms_category` (`CategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kms_permission`
--

LOCK TABLES `kms_permission` WRITE;
/*!40000 ALTER TABLE `kms_permission` DISABLE KEYS */;
INSERT INTO `kms_permission` VALUES (1, 1, 1, 0, 1, 0, 0, "[]", "[]");
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
