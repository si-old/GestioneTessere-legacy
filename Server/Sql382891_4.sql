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

DROP TABLE IF EXISTS Carriera;

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

DROP TABLE IF EXISTS CdL;

CREATE TABLE IF NOT EXISTS `CdL` (
  `ID` int(11) NOT NULL auto_increment,
  `Nome` varchar(30) NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dump dei dati per la tabella `CdL`
--

INSERT INTO `CdL` (`ID`, `Nome`) VALUES
(2, 'Ingegneria Informatica'),
(3, 'Ingegneria Elettronica'),
(4, 'Ingegneria Civile'),
(5, 'Ingegneria Meccanica'),
(6, 'Ingegneria Gestionale'),
(7, 'Ingegneria Civile A&T'),
(8, 'Ingegneria Edile-Arch'),
(9, 'Ingegneria Chimica'),
(1, 'Laureato'),
(10, 'Altra facoltà'),
(11, 'Ingegneria Chimica Alimentare');

-- --------------------------------------------------------

--
-- Struttura della tabella `Direttivo`
--

DROP TABLE IF EXISTS Direttivo;

CREATE TABLE IF NOT EXISTS `Direttivo` (
  `ID` int(11) NOT NULL auto_increment,
  `User` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Socio` int(11) NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dump dei dati per la tabella `Direttivo`
--

INSERT INTO `Direttivo` (`ID`, `User`, `Password`, `Socio`) VALUES
(1, 'admin', 'studentingegneria', -1),
(2, 'antonella', 'cricca', -1),
(3, 'gerardo', 'cricca', -1),
(4, 'crocco', 'cricca', -1),
(5, 'emilio', 'cricca', -1),
(6, 'cricca', 'cricca', 2),
(7, 'u.davino', 'umto21', -1),
(8, 'annalisa', 'cricca', -1);

-- --------------------------------------------------------

--
-- Struttura della tabella `Log`
--

DROP TABLE IF EXISTS Log;

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

DROP TABLE IF EXISTS Socio;

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

DROP TABLE IF EXISTS Tessera;

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

DROP TABLE IF EXISTS Tesseramento;

CREATE TABLE IF NOT EXISTS `Tesseramento` (
  `ID` int(11) NOT NULL auto_increment,
  `Anno` varchar(10) NOT NULL,
  `Aperto` tinyint(1) NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dump dei dati per la tabella `Tesseramento`
--

INSERT INTO `Tesseramento` (`ID`, `Anno`, `Aperto`) VALUES
(1, '2010', 0),
(2, '2011', 0),
(3, '2012', 0),
(4, '2013', 0),
(5, '2014', 0),
(6, '2015', 0),
(7, '2016', 0),
(8, '2017', 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
