<?php
$conn = 0;

function createDBConn(){
    global $conn;
    if (!$conn){
        $conn = mysql_connect('localhost', 'root', 'ldap4$') or die(mysql_error());
        mysql_select_db("zoj", $conn) or die(mysql_error());
    }
}

function fetchResult($table, $pid){
    createDBconn();
    $cmd = "SELECT * FROM $table where ProbID = $pid";
    $result = mysql_query($cmd);
    return $result;
}

function fetchProbList($action, $val){
    createDBconn();
    $table = 'Codes';
    $suff = '';
    if ($action == 'next'){
        $suff = "WHERE ProbID > $val ORDER BY ProbID LIMIT 20";
    } else if ($action == 'prev') { // prev
        $suff = "WHERE ProbID < $val ORDER BY ProbID DESC LIMIT 20";
    } else {
        $suff = "ORDER BY ProbID LIMIT 20";
    }
    $cmd = "SELECT ProbID FROM $table " . $suff;
    // print "$action\n$cmd\n";
    $result = mysql_query($cmd);
    return $result;
}

function addNewItemToTable($table, $arr){
    createDBConn();
    $fields = '';
    $values = '';
    foreach ($arr as $k => &$v){
        if ($fields) {
            $fields .= "," . $k;
        } else {
            $fields = $k;
        }
        if ($k == "HtmlSource"){
            $v = "'" . addslashes($v) . "'";
        }
        if ($values){
            $values .= "," . $v;
        } else {
            $values = $v;
        }
    }
    $cmd = "INSERT INTO $table ($fields) VALUES ($values)";
    // print "$cmd\n";
    $result = mysql_query($cmd) or print mysql_error();
    return $result;
}

?>

