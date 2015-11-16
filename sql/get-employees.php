<?php

$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = 'admin';
$dbname = 'c02301a_test';

$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die ('Error connecting to mysql');

mysql_select_db($dbname) or die (mysql_error());

$query = "SELECT * FROM employees ORDER BY lastname ASC";  
$data = array();
$result = mysql_query($query) or die(mysql_error());
$resultCount = mysql_num_rows($result);
$i = 1;

if (mysql_num_rows($result)) {
    echo '[';
    while ($row = mysql_fetch_assoc($result)) {
        echo json_encode($row);
        if ($i < $resultCount) {
            echo ',';
        }
        $i++;
    }
    echo ']';
}
?>