<?php
// When user has certificate us his information, we will do this.
// Add the user to the database
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
    if (!$row){
        $param = array();
        $param['uids'] = $xiaonei_uid;
        $ans = $xn->users('getInfo', $param);
        $user = $ans['user'];
        $name = $user['name'];
        $headurl = $user['headurl'];
        echo ("name is " . $name);
        // insert to the users table;
        mysql_query("INSERT INTO users (id, name, iconurl) VALUES ('$xiaonei_uid', '$name', '$headurl') " )
            or die (mysql_error());

        // insert to the event table;
        mysql_query("INSERT INTO events (id, type, message) 
            VALUES ('$xiaonei_uid', 'join', '$name join to our game') " )
            or die (mysql_error());

        $result = mysql_query("SELECT * FROM users WHERE id=" . $xiaonei_uid);
        $row = mysql_fetch_array($result);
    }
    // print_r($row);
    mysql_close($conn);
    */
?>
</div>
<?php
include_once('footer.php');
?>
