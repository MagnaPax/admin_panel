-- MySQL dump 10.13  Distrib 5.7.42, for Linux (x86_64)
--
-- Host: localhost    Database: management
-- ------------------------------------------------------
-- Server version	5.7.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 데이터베이스 생성
CREATE DATABASE admin_panel DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

-- 사용할 DB 선택
USE admin_panel;


--
-- Table structure for table `Brand`
--

DROP TABLE IF EXISTS `Brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Brand` (
  `brand_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '브랜드 식별자',
  `brand_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '기본값' COMMENT '브랜드 이름',
  PRIMARY KEY (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Brand`
--

LOCK TABLES `Brand` WRITE;
/*!40000 ALTER TABLE `Brand` DISABLE KEYS */;
INSERT INTO `Brand` VALUES (2,'아이폰'),(3,'아디다스'),(5,'에르메스'),(8,'바른생각'),(9,'노원'),(10,'폰사랑'),(11,'케이스친구'),(12,'탑텐'),(14,'티파니'),(15,'설화수'),(16,'웅진씽크빅'),(17,'에뛰드'),(26,'리바트'),(27,'동서가구'),(28,'한샘'),(29,'이케아'),(30,'퍼시스'),(31,'현대'),(32,'기아'),(33,'쌍용'),(36,'폭스바겐'),(37,'태그호이어-시계'),(38,'세이코-시계'),(39,'토요타'),(40,'MAN_특수차상용차'),(44,'메르세데스'),(46,'타코다'),(47,'프로스펙스'),(48,'한성컴퓨터'),(49,'asus'),(50,'lg'),(51,'samsung'),(52,'하이얼'),(53,'AMG'),(54,'Epson');
/*!40000 ALTER TABLE `Brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '카테고리 식별자',
  `category_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '카테고리 이름',
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (1,'가방'),(2,'신발'),(3,'옷'),(4,'악세사리'),(5,'화장품'),(6,'폰 케이스'),(8,'휴대폰'),(9,'성인용품'),(13,'가구'),(14,'가전제품'),(15,'승용차'),(16,'화물차'),(17,'특수차'),(18,'상용차'),(25,'시계'),(26,'컴퓨터모니터'),(33,'다시'),(34,'기초화장품'),(35,'컴퓨터메인보드'),(36,'노트북컴퓨터'),(37,'OLED'),(38,'LED'),(39,'QLED'),(40,'프로젝터'),(41,'프린터');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Intermediate`
--

DROP TABLE IF EXISTS `Intermediate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Intermediate` (
  `intermediate_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '고유 식별자',
  `brand_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`intermediate_id`),
  KEY `brand_id` (`brand_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `intermediate_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `Brand` (`brand_id`),
  CONSTRAINT `intermediate_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `Category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Intermediate`
--

LOCK TABLES `Intermediate` WRITE;
/*!40000 ALTER TABLE `Intermediate` DISABLE KEYS */;
INSERT INTO `Intermediate` VALUES (4,3,2),(5,3,3),(10,5,2),(11,5,3),(12,5,4),(13,5,5),(14,8,9),(15,9,9),(16,10,6),(17,11,6),(18,12,3),(20,14,4),(21,15,5),(45,27,13),(46,28,13),(51,31,15),(54,31,16),(55,32,16),(57,31,17),(58,31,18),(60,33,15),(61,36,15),(62,36,16),(63,36,17),(77,40,17),(78,40,18),(92,44,18),(94,5,1),(98,48,26),(100,49,35),(103,48,36),(104,49,36),(107,52,14),(108,50,37),(109,52,38),(111,53,15),(115,NULL,NULL),(116,50,40),(117,54,40),(118,54,41);
/*!40000 ALTER TABLE `Intermediate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product`
--

DROP TABLE IF EXISTS `Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Product` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '고유 식별자',
  `product_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '상품 이름',
  `brand_id` int(11) DEFAULT NULL COMMENT 'Brand 테이블의 brand_id와 연결',
  `category_id` int(11) DEFAULT NULL COMMENT 'Category 테이블의 category_id와 연결',
  `sex` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '남, 여, 공용 등을 나타내는 값',
  `is_kids` tinyint(1) DEFAULT NULL COMMENT '키즈 상품 여부를 나타내는 값',
  `sales_quantity` int(11) DEFAULT NULL COMMENT '판매 수량',
  `file_paths` json DEFAULT NULL COMMENT '파일 경로',
  PRIMARY KEY (`product_id`),
  KEY `brand_id` (`brand_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `Brand` (`brand_id`),
  CONSTRAINT `product_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `Category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product`
--

LOCK TABLES `Product` WRITE;
/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
INSERT INTO `Product` VALUES (1,'S23',NULL,8,'공용',1,23,NULL),(2,'S10',NULL,8,'공용',1,11,NULL),(3,'S6',NULL,8,'공용',1,6,NULL),(4,'S20',NULL,8,'공용',1,20,NULL),(5,'A7',NULL,8,'공용',1,7,NULL),(6,'A3',NULL,8,'공용',1,3,NULL),(7,'Z플립3',NULL,8,'공용',1,13,NULL),(8,'Z플립',NULL,8,'공용',1,0,NULL),(9,'Z폴드',NULL,8,'공용',1,100,NULL),(10,'Z폴드3',NULL,8,'공용',1,33,NULL),(11,'바른생각콘돔',8,9,'남',0,23,NULL),(12,'노원',9,9,'여',0,43,NULL),(13,'폰1',10,6,'공용',1,1,NULL),(14,'폰2',10,6,'공용',1,2,NULL),(15,'케1',10,6,'공용',1,100,NULL),(16,'케2',10,6,'공용',1,222,NULL),(17,'에르메스 볼리드',5,1,'공용',0,7,NULL),(18,'에르메스 집시에르',5,1,'여',0,99,NULL),(19,'에르메스 더블센스',5,1,'여',0,10,NULL),(20,'나이키 백팩',NULL,1,'공용',1,234,NULL),(21,'나이키 골프백',NULL,1,'공용',0,87,NULL),(22,'나이키 에어맥스95',NULL,2,'공용',1,98,NULL),(23,'나이키 에어조던',NULL,2,'공용',1,789,NULL),(24,'탑텐 RB07',12,3,'공용',1,2130,NULL),(25,'탑텐 치마',12,3,'여',1,4,NULL),(26,'탑텐 면바지',12,3,'공용',1,5425,NULL),(27,'리바이스 501',NULL,3,'공용',1,6,NULL),(28,'리바이스 510',NULL,3,'여',1,2,NULL),(29,'티파니 귀걸이',14,4,'여',0,4,NULL),(30,'티파니 목걸이',14,4,'여',0,8,NULL),(31,'티파니 옴므',14,4,'남',0,10,NULL),(32,'설화수 립',15,5,'여',0,5,NULL),(33,'설화수 틴트',15,5,'여',0,5,NULL),(34,'설화수 로션',15,5,'공용',1,5,NULL),(35,'아이폰 X',2,8,'공용',1,2456,NULL),(36,'웅진-설민석의 한국사 대모험 7권',16,NULL,'공용',1,337,NULL),(37,'이니스프리 - 로션',NULL,NULL,'공용',1,567568,NULL),(38,'ㅁㄴㅇㄹ',NULL,NULL,NULL,1,77,NULL),(39,'퓨ㅜㅡ',NULL,NULL,NULL,1,999,NULL),(40,'리바트-의자',NULL,13,'공용',1,32,NULL),(41,'리바트-탁자',26,13,'공용',1,16,NULL),(42,'동서가구-책상',27,13,'공용',1,7,NULL),(43,'동서가구-의자',27,13,'공용',1,7,NULL),(46,'동서가구-책장',27,13,'공용',1,21,NULL),(55,'아싸',14,4,'남',0,346776,NULL),(78,'테스트21',31,15,'공용',0,63454,NULL),(80,'테스트23',31,15,'공용',0,63454,'[\"storage/10001.svg-1690456358192-125712400.svg\", \"storage/10002.svg-1690456358193-864347959.svg\"]'),(81,'테스트24',31,15,'공용',0,63454,'[\"storage/10018.jpg-1690457429586-555765816.jpg\", \"storage/10019.jpg-1690457429586-570559623.jpg\"]'),(86,'플젝_삼성HD01',51,40,'Unisex(공용)',0,94,'[\"storage/10120.jpg-1693299537190-747899649.jpg\", \"storage/10121.jpg-1693299537192-483692185.jpg\", \"storage/10122.jpg-1693299537194-116949302.jpg\"]');
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product_clone`
--

DROP TABLE IF EXISTS `Product_clone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Product_clone` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '고유 식별자',
  `product_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '상품 이름',
  `brand_id` int(11) DEFAULT NULL COMMENT 'Brand 테이블의 brand_id와 연결',
  `category_id` int(11) DEFAULT NULL COMMENT 'Category 테이블의 category_id와 연결',
  `sex` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '남, 여, 공용 등을 나타내는 값',
  `is_kids` tinyint(1) DEFAULT NULL COMMENT '키즈 상품 여부를 나타내는 값',
  `sales_quantity` int(11) DEFAULT NULL COMMENT '판매 수량',
  PRIMARY KEY (`product_id`),
  KEY `brand_id` (`brand_id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product_clone`
--

LOCK TABLES `Product_clone` WRITE;
/*!40000 ALTER TABLE `Product_clone` DISABLE KEYS */;
INSERT INTO `Product_clone` VALUES (1,'S23',1,8,'공용',1,23),(2,'S10',1,8,'공용',1,11),(3,'S6',1,8,'공용',1,6),(4,'S20',1,8,'공용',1,20),(5,'A7',1,8,'공용',1,7),(6,'A3',1,8,'공용',1,3),(7,'Z플립3',1,8,'공용',1,13),(8,'Z플립',1,8,'공용',1,0),(9,'Z폴드',1,8,'공용',1,100),(10,'Z폴드3',1,8,'공용',1,33),(11,'바른생각콘돔',8,9,'남',0,23),(12,'노원',9,9,'여',0,43),(13,'폰1',10,6,'공용',1,1),(14,'폰2',10,6,'공용',1,2),(15,'케1',10,6,'공용',1,100),(16,'케2',10,6,'공용',1,222),(17,'에르메스 볼리드',5,1,'공용',0,7),(18,'에르메스 집시에르',5,1,'여',0,99),(19,'에르메스 더블센스',5,1,'여',0,10),(20,'나이키 백팩',4,1,'공용',1,234),(21,'나이키 골프백',4,1,'공용',0,87),(22,'나이키 에어맥스95',4,2,'공용',1,98),(23,'나이키 에어조던',4,2,'공용',1,789),(24,'탑텐 RB07',12,3,'공용',1,2130),(25,'탑텐 치마',12,3,'여',1,4),(26,'탑텐 면바지',12,3,'공용',1,5425),(27,'리바이스 501',13,3,'공용',1,6),(28,'리바이스 510',13,3,'여',1,2),(29,'티파니 귀걸이',14,4,'여',0,4),(30,'티파니 목걸이',14,4,'여',0,8),(31,'티파니 옴므',14,4,'남',0,10),(32,'설화수 립',15,5,'여',0,5),(33,'설화수 틴트',15,5,'여',0,5),(34,'설화수 로션',15,5,'공용',1,5),(35,'아이폰 X',2,8,'공용',1,2456),(36,'웅진-설민석의 한국사 대모험 7권',16,NULL,'공용',1,337),(37,'이니스프리 - 로션',NULL,NULL,'공용',1,567568),(38,'ㅁㄴㅇㄹ',NULL,NULL,NULL,1,77),(39,'퓨ㅜㅡ',NULL,NULL,NULL,1,999),(40,'리바트-의자',NULL,13,'공용',1,32),(41,'리바트-탁자',26,13,'공용',1,16),(42,'동서가구-책상',27,13,'공용',1,7),(43,'동서가구-의자',27,13,'공용',1,7),(46,'동서가구-책장',27,13,'공용',1,21),(47,'현대-쏘나타',31,15,'공용',0,3126),(48,'현대-쏘나타',31,15,'공용',0,3126);
/*!40000 ALTER TABLE `Product_clone` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-03 21:23:34
