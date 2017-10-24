-- phpMyAdmin SQL Dump
-- version 3.4.7.1
-- http://www.phpmyadmin.net
--
-- Host: 62.149.150.123
-- Generato il: Ott 24, 2017 alle 09:08
-- Versione del server: 5.0.92
-- Versione PHP: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `Sql382891_4`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `Carriera`
--

CREATE TABLE IF NOT EXISTS `Carriera` (
  `ID` int(11) NOT NULL auto_increment,
  `Studente` tinyint(1) NOT NULL,
  `Professione` varchar(40) default NULL,
  `Socio` int(11) NOT NULL,
  `CdL` int(11) default NULL,
  `Matricola` varchar(10) default NULL,
  `Attiva` tinyint(1) NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `CdL`
--

CREATE TABLE IF NOT EXISTS `CdL` (
  `ID` int(11) NOT NULL auto_increment,
  `Nome` varchar(30) NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `Direttivo`
--

CREATE TABLE IF NOT EXISTS `Direttivo` (
  `ID` int(11) NOT NULL auto_increment,
  `User` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Socio` int(11) NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `Log`
--

CREATE TABLE IF NOT EXISTS `Log` (
  `timestamp` datetime default NULL,
  `logger` varchar(256) default NULL,
  `level` varchar(32) default NULL,
  `message` varchar(4000) default NULL,
  `thread` int(11) default NULL,
  `file` varchar(255) default NULL,
  `line` varchar(10) default NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `Socio`
--

CREATE TABLE IF NOT EXISTS `Socio` (
  `ID` int(11) NOT NULL auto_increment,
  `Nome` varchar(20) NOT NULL,
  `Cognome` varchar(20) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Cellulare` varchar(10) default NULL,
  `Facebook` varchar(50) default NULL,
  `Blacklist` tinyint(1) NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `Tessera`
--

CREATE TABLE IF NOT EXISTS `Tessera` (
  `ID` int(11) NOT NULL auto_increment,
  `Socio` int(11) NOT NULL,
  `Anno` int(4) NOT NULL,
  `Numero` int(11) NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `Tesseramento`
--

CREATE TABLE IF NOT EXISTS `Tesseramento` (
  `ID` int(11) NOT NULL auto_increment,
  `Anno` varchar(10) NOT NULL,
  `Aperto` tinyint(1) NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
