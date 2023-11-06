-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: kms
-- ------------------------------------------------------
-- Server version	5.5.5-10.10.6-MariaDB-1:10.10.6+maria~ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kms_article` (
  `ArticleID` int(11) NOT NULL AUTO_INCREMENT,
  `OwnerID` int(11) NOT NULL,
  `LastEditedByID` int(11) NOT NULL,
  `LastEditedTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Tag` longtext DEFAULT '',
  `Title` varchar(255) NOT NULL,
  `CategoryID` int(11) DEFAULT 1,
  `Article` longtext DEFAULT NULL,
  `FileID` longtext DEFAULT '',
  `DocID` longtext DEFAULT '',
  `IsActive` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`ArticleID`),
  UNIQUE KEY `kms_article_UN` (`Title`),
  KEY `kms_article_FK_category` (`CategoryID`),
  CONSTRAINT `kms_article_FK_category` FOREIGN KEY (`CategoryID`) REFERENCES `kms_category` (`CategoryID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kms_article`
--

LOCK TABLES `kms_article` WRITE;
/*!40000 ALTER TABLE `kms_article` DISABLE KEYS */;
INSERT INTO `kms_article` VALUES (1,1,1,'2023-11-06 06:28:07','Default,Public,Example','Example Article',1,'{\"data\":{\"assets\":[],\"pages\":[{\"frames\":[{\"component\":{\"attributes\":{\"id\":\"i01j\"},\"components\":[{\"attributes\":{\"id\":\"ix8g\"},\"classes\":[{\"name\":\"gjs-row\",\"private\":1}],\"components\":[{\"attributes\":{\"id\":\"i5ba\"},\"classes\":[{\"name\":\"gjs-cell\",\"private\":1}],\"components\":[{\"attributes\":{\"id\":\"ib4r\"},\"components\":[{\"content\":\"This is Default Article\",\"type\":\"textnode\"},{\"tagName\":\"br\",\"void\":true}],\"type\":\"text\"}],\"draggable\":\".gjs-row\",\"name\":\"Cell\",\"resizable\":{\"bc\":0,\"bl\":0,\"br\":0,\"cl\":0,\"cr\":1,\"currentUnit\":1,\"minDim\":1,\"step\":0.2,\"tc\":0,\"tl\":0,\"tr\":0}}],\"droppable\":\".gjs-cell\",\"name\":\"Row\",\"resizable\":{\"bl\":0,\"br\":0,\"cl\":0,\"cr\":0,\"minDim\":1,\"tc\":0,\"tl\":0,\"tr\":0}},{\"attributes\":{\"id\":\"itz4\"},\"classes\":[{\"name\":\"gjs-row\",\"private\":1}],\"components\":[{\"attributes\":{\"id\":\"inhh\"},\"classes\":[{\"name\":\"gjs-cell\",\"private\":1}],\"components\":[{\"attributes\":{\"id\":\"i832\"},\"components\":[{\"content\":\"Lorem ipsum\",\"type\":\"textnode\"},{\"tagName\":\"br\",\"void\":true}],\"type\":\"text\"}],\"draggable\":\".gjs-row\",\"name\":\"Cell\",\"resizable\":{\"bc\":0,\"bl\":0,\"br\":0,\"cl\":0,\"cr\":1,\"currentUnit\":1,\"minDim\":1,\"step\":0.2,\"tc\":0,\"tl\":0,\"tr\":0}}],\"droppable\":\".gjs-cell\",\"name\":\"Row\",\"resizable\":{\"bl\":0,\"br\":0,\"cl\":0,\"cr\":0,\"minDim\":1,\"tc\":0,\"tl\":0,\"tr\":0}},{\"attributes\":{\"allowfullscreen\":\"allowfullscreen\",\"id\":\"idatp\"},\"autoplay\":true,\"provider\":\"yt\",\"resizable\":{\"ratioDefault\":1},\"sources\":[],\"src\":\"https://www.youtube.com/embed/dQw4w9WgXcQ?\\u0026autoplay=1\\u0026muted=1\",\"tagName\":\"iframe\",\"type\":\"video\",\"videoId\":\"dQw4w9WgXcQ\"}],\"stylable\":[\"background\",\"background-color\",\"background-image\",\"background-repeat\",\"background-attachment\",\"background-position\",\"background-size\"],\"type\":\"wrapper\"},\"id\":\"CDqfJZ4yDyVUoqes\"}],\"id\":\"1LG1l9MiCBrnrMiU\",\"type\":\"main\"}],\"styles\":[{\"selectors\":[{\"name\":\"gjs-row\",\"private\":1}],\"style\":{\"display\":\"table\",\"padding\":\"10px\",\"width\":\"100%\"}},{\"atRuleType\":\"media\",\"mediaText\":\"(max-width: 768px)\",\"selectors\":[{\"name\":\"gjs-cell\",\"private\":1}],\"style\":{\"display\":\"block\",\"width\":\"100%\"}},{\"atRuleType\":\"media\",\"mediaText\":\"(max-width: 768px)\",\"selectors\":[\"gjs-cell30\"],\"style\":{\"display\":\"block\",\"width\":\"100%\"}},{\"atRuleType\":\"media\",\"mediaText\":\"(max-width: 768px)\",\"selectors\":[\"gjs-cell70\"],\"style\":{\"display\":\"block\",\"width\":\"100%\"}},{\"selectors\":[{\"name\":\"gjs-cell\",\"private\":1}],\"style\":{\"display\":\"table-cell\",\"height\":\"75px\",\"width\":\"8%\"}},{\"selectors\":[\"#ib4r\"],\"style\":{\"font-size\":\"29px\",\"padding\":\"10px\"}},{\"selectors\":[\"#iqlu\"],\"style\":{\"font-size\":\"33px\"}},{\"selectors\":[\"#i832\"],\"style\":{\"padding\":\"10px\"}},{\"selectors\":[\"#idatp\"],\"style\":{\"height\":\"350px\",\"width\":\"615px\"}}]},\"pagesHtml\":[{\"css\":\"* { box-sizing: border-box; } body {margin: 0;}.gjs-row{display:table;padding:10px;width:100%;}.gjs-cell{width:8%;display:table-cell;height:75px;}#ib4r{padding:10px;font-size:29px;}#i832{padding:10px;}#idatp{height:350px;width:615px;}@media (max-width: 768px){.gjs-cell{width:100%;display:block;}}\",\"html\":\"\\u003cbody id=\\\"i01j\\\"\\u003e\\u003cdiv class=\\\"gjs-row\\\" id=\\\"ix8g\\\"\\u003e\\u003cdiv class=\\\"gjs-cell\\\" id=\\\"i5ba\\\"\\u003e\\u003cdiv id=\\\"ib4r\\\"\\u003eThis is Default Article\\u003cbr/\\u003e\\u003c/div\\u003e\\u003c/div\\u003e\\u003c/div\\u003e\\u003cdiv class=\\\"gjs-row\\\" id=\\\"itz4\\\"\\u003e\\u003cdiv class=\\\"gjs-cell\\\" id=\\\"inhh\\\"\\u003e\\u003cdiv id=\\\"i832\\\"\\u003eLorem ipsum\\u003cbr/\\u003e\\u003c/div\\u003e\\u003c/div\\u003e\\u003c/div\\u003e\\u003ciframe allowfullscreen=\\\"allowfullscreen\\\" id=\\\"idatp\\\" src=\\\"https://www.youtube.com/embed/dQw4w9WgXcQ?\\u0026autoplay=1\\u0026muted=1\\\"\\u003e\\u003c/iframe\\u003e\\u003c/body\\u003e\"}]}','','',1);
/*!40000 ALTER TABLE `kms_article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kms_category`
--

DROP TABLE IF EXISTS `kms_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kms_category` (
  `CategoryID` int(11) NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(255) NOT NULL,
  `CategoryParentID` int(11) NOT NULL,
  `CategoryDescription` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`CategoryID`),
  UNIQUE KEY `kms_category_UN` (`CategoryName`),
  KEY `kms_category_parent_rel` (`CategoryParentID`),
  CONSTRAINT `kms_category_parent_rel` FOREIGN KEY (`CategoryParentID`) REFERENCES `kms_category` (`CategoryID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kms_category`
--

LOCK TABLES `kms_category` WRITE;
/*!40000 ALTER TABLE `kms_category` DISABLE KEYS */;
INSERT INTO `kms_category` VALUES (1,'Public',1,'Can be seen by Everyone'),(2,'Parent',2,'Parent Category');
/*!40000 ALTER TABLE `kms_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kms_doc`
--

DROP TABLE IF EXISTS `kms_doc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kms_permission` (
  `PermissionID` int(11) NOT NULL AUTO_INCREMENT,
  `CategoryID` int(11) NOT NULL,
  `RoleID` int(11) NOT NULL,
  `Create` tinyint(1) NOT NULL DEFAULT 0,
  `Read` tinyint(1) NOT NULL DEFAULT 0,
  `Update` tinyint(1) NOT NULL DEFAULT 0,
  `Delete` tinyint(1) NOT NULL DEFAULT 0,
  `FileType` longtext DEFAULT '',
  `DocType` longtext DEFAULT '',
  PRIMARY KEY (`PermissionID`),
  UNIQUE KEY `kms_permission_UN` (`CategoryID`,`RoleID`),
  KEY `kms_permission_FK` (`CategoryID`),
  CONSTRAINT `kms_permission_FK` FOREIGN KEY (`CategoryID`) REFERENCES `kms_category` (`CategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kms_permission`
--

LOCK TABLES `kms_permission` WRITE;
/*!40000 ALTER TABLE `kms_permission` DISABLE KEYS */;
INSERT INTO `kms_permission` VALUES (1,1,1,0,1,0,0,'','');
/*!40000 ALTER TABLE `kms_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'kms'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-06 13:33:05
