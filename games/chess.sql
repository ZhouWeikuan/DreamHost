-- MySQL dump 10.11
--
-- Host: localhost    Database: chess
-- ------------------------------------------------------
-- Server version	5.0.51a-24+lenny2

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

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `comments` (
  `cid` bigint(20) NOT NULL auto_increment,
  `uid` bigint(20) NOT NULL,
  `txt` varchar(160) NOT NULL,
  `era` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `games` (
  `gid` bigint(20) NOT NULL auto_increment,
  `uid` bigint(20) NOT NULL default '-1',
  `ustate` varchar(10) default 'NONE',
  `umsg` varchar(120) default NULL,
  `ulast` bigint(20) unsigned default '0',
  `ucolor` char(8) default 'RED',
  `ucmd` varchar(120) default '',
  `did` bigint(20) NOT NULL default '-1',
  `dstate` varchar(10) default 'NONE',
  `dmsg` varchar(120) default NULL,
  `dlast` bigint(20) unsigned default '0',
  `dcolor` char(8) default 'BLACK',
  `dcmd` varchar(120) default '',
  PRIMARY KEY  (`gid`),
  UNIQUE KEY `gid` (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,-1,'OVER','LEAVE&name=å‘¨çŽ‹',1262963617,'RED','',-1,'OVER','LEAVE&name=å‘¨ä¸ºå®½',1262963617,'BLACK',''),(2,-1,'OVER','LEAVE&name=å‘¨ä¸ºå®½',1263035097,'BLACK','',-1,'OVER','LEAVE&name=å‘¨çŽ‹',1263035097,'RED',''),(3,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(4,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(5,-1,'OVER','NONE',1262944259,'BLACK','',-1,'OVER','LEAVE&name=aaa',1263029120,'RED',''),(6,-1,'OVER','NONE',1263035968,'BLACK','',-1,'OVER','NONE',1263035963,'RED',''),(7,-1,'OVER','LEAVE&name=å‘¨ä¸ºå®½',1263045546,'BLACK','',-1,'MOVE','NONE',1262942785,'RED',''),(8,-1,'WAIT','NONE',1263029365,'BLACK','',-1,'MOVE','NONE',1263029353,'RED',''),(9,-1,'MOVE','NONE',1263029276,'BLACK','',-1,'WAIT','NONE',1263029279,'RED',''),(10,-1,'OVER','NONE',1263033566,'BLACK','',-1,'OVER','NONE',1263033577,'RED',''),(11,-1,'START','NONE',1262966764,'BLACK','',-1,'OVER','NONE',1262966746,'RED',''),(12,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(13,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(14,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(15,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(16,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(17,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(18,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(19,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(20,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK','');
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `name` varchar(40) default NULL,
  `win` int(11) default '0',
  `lose` int(11) default '0',
  `draw` int(11) default '0',
  `iconurl` varchar(400) default '',
  `era` int(10) unsigned default '0',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (-1,'',0,0,0,'',0),(239941468,'å‘¨çŽ‹',0,0,0,'http://hd13.xiaonei.com/photos/hd13/20080201/17/25/head_4915c107.jpg',0),(296576367,'å‘¨ä¸ºå®½',0,0,0,'http://head.xiaonei.com/photos/0/0/men_head.gif',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2010-01-18  7:45:40
