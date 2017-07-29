<?
//session start

session_start();
//fix to help internet explorer remember form variables
header("Cache-control: private"); //IE 6 fix
//needs to be completed
$host="62.149.150.123";
$user="Sql382891";
$pass="29c4aea7";
$db_name="Sql382891_4";
$db = new mysqli($host, $user, $pass, $db_name);
if ($db->connect_error) {
	 die('Error');
} 
 //$db->select_db("Sql382891_4") or die("unable to select the database");
//$db_conn = mysql_connect("62.149.150.80", "Sql207921", "3c125875") or die("unable to connect to the database");
//  mysql_select_db("Sql207921_3", $db_conn) or die("unable to select the database");




//connect_me();
//forgot pass from address
$from = 'webstaff@studentingegneria.it';
?>