<?php
$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = 'admin';
$dbname = 'c02301a_test';

$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die ('Error connecting to mysql');

mysql_select_db($dbname) or die (mysql_error());

?>
