<?php
//session start

//fix to help internet explorer remember form variables
header("Cache-control: private"); //IE 6 fix
//needs to be completed
$host= "62.149.150.123";
$user="Sql382891";
$pass="29c4aea7";
$db_name="Sql382891_4";
$db = new mysqli($host, $user, $pass, $db_name);
if ($db->connect_error) {
     die('Error');
}
$db->set_charset("utf8");
//connect_me();
//forgot pass from address
$from = 'webstaff@studentingegneria.it';
