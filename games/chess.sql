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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,1234,'text','2010-01-05 07:04:31');
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
  `umsg` varchar(10) default 'NONE',
  `ulast` bigint(20) unsigned default '0',
  `ucolor` char(8) default 'RED',
  `ucmd` varchar(120) default '',
  `did` bigint(20) NOT NULL default '-1',
  `dstate` varchar(10) default 'NONE',
  `dmsg` varchar(10) default 'NONE',
  `dlast` bigint(20) unsigned default '0',
  `dcolor` char(8) default 'BLACK',
  `dcmd` varchar(120) default '',
  PRIMARY KEY  (`gid`),
  UNIQUE KEY `gid` (`gid`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,-1,'OVER','NONE',1262944008,'BLACK','',-1,'OVER','NONE',1262944011,'RED',''),(2,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(3,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(4,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(5,1234,'OVER','NONE',1262944259,'BLACK','',4321,'OVER','NONE',1262944250,'RED',''),(6,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(7,-1,'WAIT','NONE',1262942774,'BLACK','',-1,'MOVE','NONE',1262942785,'RED',''),(8,-1,'NONE','NONE',0,'RED','',-1,'OVER','NONE',1262941497,'BLACK',''),(9,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(10,-1,'OVER','NONE',1262941828,'RED','',-1,'NONE','NONE',0,'BLACK',''),(11,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(12,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(13,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(14,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(15,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(16,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(17,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(18,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(19,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK',''),(20,-1,'NONE','NONE',0,'RED','',-1,'NONE','NONE',0,'BLACK','');
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
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (-1,'',0,0,0,''),(1234,'aaa',0,0,0,''),(4321,'bbb',0,0,0,'');
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

-- Dump completed on 2010-01-08  9:53:34
