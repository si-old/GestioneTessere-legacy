-- --------------------------------------------------------

--
-- Modifica del campo CdL in Corso nella tabella `Carriera`
--

ALTER TABLE `Carriera` CHANGE `CdL` `Corso` int(11) ;

-- --------------------------------------------------------

--
-- MOdifica del nome della tabella `CdL` in `Corso`
--

RENAME TABLE `Sql382891_4`.`CdL` TO `Sql382891_4`.`Corso` 

