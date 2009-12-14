<?php

function createDBConn(){
    global $conn;
    $conn = mysql_connect('localhost', 'root', 'ldap4$') or die(mysql_error());
    mysql_select_db("chess", $conn) or die(mysql_error());
}

function checkValidGame($gid, &$row){
    if ($gid < 0){
        return false;
    }

    $cmd = "SELECT * FROM games WHERE gid=$gid";
    $result = mysql_query($cmd);
    if ($result){
        $row = mysql_fetch_array($result);
    }
    if (!$row){
        return false;
    }
    return true;
}

function doMove(&$env){
    $gid = $env['gid'];
    $row = '';
    if (!checkValidGame($gid, $row)){
        print ("gid=$gid");
        return;
    }
    $ans = "type=doMove&gid=$gid";
    $cmdStr = "method=MOVE&color=" . $env['color']. "&oldRow=" . $env['oldRow'] . "&oldCol=".$env['oldCol']
            . "&newRow=" . $env['newRow'] . "&newCol=" . $env['newCol']; 
    $role = $env['role'];
    global $upper, $down;
    $fld = &$upper;
    if ($role != GameState::SERVER){
        $fld = &$down;
    }
    $ans .= "&fld=$fld";

    $cmd = "UPDATE games set " . $fld['state'] . "='WAIT', " . $fld['ostate']  . "='MOVE', "
         . $fld['cmd'] . "='$cmdStr' WHERE gid=$gid" ;
    $result = mysql_query($cmd);
    $ans .= "&cmd='$cmd'&result=$result";
    print($ans);
}

function doWin(&$env){
    $gid = $env['gid'];
    $row = '';
    if (!checkValidGame($gid, $row)){
        print ("gid=$gid");
        return;
    }
    $ans = "type=doWin&gid=$gid";
    $msgStr = GameState::LOSE;
    $role = $env['role'];
    global $upper, $down;
    $fld = &$upper;
    if ($role != GameState::SERVER){
        $fld = &$down;
    }
    $cmd = "UPDATE games set " . $fld['state'] . "='END', " . $fld['ostate']  . "='END', "
         . $fld['msg'] . "='$msgStr' WHERE gid=$gid" ;
    $result = mysql_query($cmd);
    $ans .= "&cmd='$cmd'&result=$result";
    print($ans);
}

function doLose(&$env){
    $gid = $env['gid'];
    $row = '';
    if (!checkValidGame($gid, $row)){
        print ("gid=$gid");
        return;
    }
    $ans = "type=doLose&gid=$gid";
    $msgStr = GameState::WIN; 
    $role = $env['role'];
    global $upper, $down;
    $fld = &$upper;
    if ($role != GameState::SERVER){
        $fld = &$down;
    }
    $cmd = "UPDATE games set " . $fld['state'] . "='END', " . $fld['ostate']  . "='END', "
         . $fld['msg'] . "='$msgStr' WHERE gid=$gid" ;
    $result = mysql_query($cmd);
    $ans .= "&cmd='$cmd'&result=$result";
    print($ans);
}

function createServer($uid){
    $ans = "type=command&uid=$uid";
    $ts  = time(0);
    $sts = GameState::SERVER;
    $cmd = "DELETE FROM games where uid='$uid'";
    $result = mysql_query($cmd);
    $cmd = "INSERT INTO games (uid, ustate, ulast) values ('$uid', '$sts', '$ts')";
    $result = mysql_query($cmd);
    if ($result){
        $ans .= "&insert=true";
        $cmd = "SELECT gid FROM games where uid='$uid'";
        $result = mysql_query($cmd);
        $row = mysql_fetch_array($result);
        if ($result && $row){
            $gid = $row['gid'];
            $ans .= "&gid=$gid";
        } else {
            $ans .= "&gid=-1";
        }
    } else {
        $ans .= "&insert=false";
        $ans .= "&gid=-1";
    }
    print($ans);
}

function updateState(&$env){
    $gid = $env['gid'];
    $field = $env['field'];
    $state = $env['state'];
    $row = '';
    if (!checkValidGame($gid, $row)){
        print("gid=-1");
        return;
    }
    $ans = "type=updateState&gid=$gid";
    $cmd = "UPDATE games SET $field='$state' WHERE gid=$gid";
    $result = mysql_query($cmd);
    $ans .= "&cmd=$cmd&result=$result";
    print($ans);
}

function findServer($uid){
    $gid  = -1;
    $ans = "type=findServer&uid=$uid";
    $ts  = time(0);
    $sts = GameState::CLIENT;
    $cmd = "SELECT gid FROM games where did < 0 LIMIT 1";
    $result = mysql_query($cmd);
    if ($result ){
        $row = mysql_fetch_array($result);
        if ($row){
            $gid = $row['gid'];
        }
    }

    if ($gid > 0){ // there is a game
        $cmd = "UPDATE games set ustate='INIT', ucmd='method=INIT&color=BLACK', did=$uid, dstate='INIT', dcmd='method=INIT&color=RED', dlast='$ts' WHERE gid=$gid";
        $result = mysql_query($cmd);
        $ans .= "&cmd=$cmd";
        if ($result){
            $ans .= "&gid=$gid";
        } else {
            $ans .= "&gid=-1";
        }
    } else { // no games found, turn to server?
        createServer($uid);
        return;
    }
    print($ans);
}

function askDraw(){
}

function acceptDraw(){
}

?>

