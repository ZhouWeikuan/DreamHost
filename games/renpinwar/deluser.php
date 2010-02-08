<?php
// Call this file when the specified user has removed the applications.
include_once('header.php');
?>
<div>
<?
/*
    // echo ($xiaonei_uid);
    $conn = mysql_connect('localhost', 'root', 'ldap4$') 
        or die(mysql_error());
    mysql_select_db("test", $conn) 
        or die(mysql_error());
    $result = mysql_query("SELECT * FROM users WHERE id=" . $xiaonei_uid);
    $row = mysql_fetch_array($result);
    if ($row){
        $name = $row['name'];
        // remove from the users table;
        mysql_query("DELETE FROM users WHERE id='$xiaonei_uid') " )
            or die (mysql_error());

        // insert to the events table;
        mysql_query("INSERT INTO events (id, type, message) 
            VALUES ('$xiaonei_uid', 'leave', '$name leave our game') " )
            or die (mysql_error());
    }

    mysql_close($conn);
*/
?>
</div>
<?php
include_once('footer.php');
?>
