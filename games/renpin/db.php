<?php

function createDBConn(){
    global $conn;
    $conn = mysql_connect('localhost', 'root', 'ldap4$') or die(mysql_error());
    mysql_select_db("test", $conn) or die(mysql_error());
}

// make sure $conn connects to the database already
function fetchMsg($uid){
    global $conn;
    $cmd = "SELECT msg.*, users.name FROM msg, users WHERE msg.id = $uid and users.id = $uid";
    $result = mysql_query($cmd, $conn);
    $row = mysql_fetch_array($result);
    if (!$result || !$row){
        $sec = "INSERT INTO msg (id) values ($uid)";
        mysql_query($sec, $conn);
        $result = mysql_query($cmd, $conn);
        $row = mysql_fetch_array($result);
    }
    return $row;
}

function updateRenPin($id, $val){
    $cmd = "select score from users where id = $id ";
    $result = mysql_query($cmd);
    $row = mysql_fetch_array($result);
    $score = $row['score'];
    if (!$score) $score = 60;
    $score += $val;
    $cmd = "update users set score = $score where id = $id";
    mysql_query($cmd);
}

function updateEvent($id, $obj, $type, $msg){
    $cmd = "INSERT INTO events (id, obj, type, message, stage) VALUES"
         . " ($id, $obj, '$type', '$msg', now())";
    //echo($cmd);
    $result = mysql_query($cmd);
    return $result;
}

function fetchOneDayCount($fro, $to){
    $cmd = "SELECT COUNT(id) as cnt FROM events WHERE id=$fro AND obj=$to "
         . "AND stage > date_sub(now(), interval 3 hour)";
    $result = mysql_query($cmd);
    $row = mysql_fetch_array($result);
    $cnt = $row['cnt']?$row['cnt']:0;
    return $cnt;
}


?>

