-- phpMyAdmin SQL Dump
-- version 4.1.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Ott 26, 2017 alle 11:18
-- Versione del server: 5.1.71-community-log
-- PHP Version: 5.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `my_bracco23`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `Carriera`
--

CREATE TABLE IF NOT EXISTS `Carriera` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Studente` tinyint(1) NOT NULL,
  `Professione` varchar(40) DEFAULT NULL,
  `Socio` int(11) NOT NULL,
  `Corso` int(11) DEFAULT NULL,
  `Matricola` varchar(10) DEFAULT NULL,
  `Attiva` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `Corso`
--

CREATE TABLE IF NOT EXISTS `Corso` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Nome` varchar(30) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `Direttivo`
--

CREATE TABLE IF NOT EXISTS `Direttivo` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `User` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Socio` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `Log`
--

CREATE TABLE IF NOT EXISTS `Log` (
  `timestamp` datetime DEFAULT NULL,
  `logger` varchar(256) DEFAULT NULL,
  `level` varchar(32) DEFAULT NULL,
  `message` varchar(4000) DEFAULT NULL,
  `thread` int(11) DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `line` varchar(10) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `Socio`
--

CREATE TABLE IF NOT EXISTS `Socio` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Nome` varchar(20) NOT NULL,
  `Cognome` varchar(20) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Cellulare` varchar(10) DEFAULT NULL,
  `Facebook` varchar(50) DEFAULT NULL,
  `Blacklist` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `Tessera`
--

CREATE TABLE IF NOT EXISTS `Tessera` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Socio` int(11) NOT NULL,
  `Anno` int(4) NOT NULL,
  `Numero` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `Tesseramento`
--

CREATE TABLE IF NOT EXISTS `Tesseramento` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Anno` varchar(10) NOT NULL,
  `Aperto` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

CREATE TABLE IF NOT EXISTS `Statino` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Tessera` int(11) NOT NULL,
  `Nome` varchar(20) NOT NULL,
  `Cognome` varchar(20) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Cellulare` varchar(10) DEFAULT NULL,
  `Quota` int(11) NOT NULL,
  `Data` date NOT NULL,
  `Carriera` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
