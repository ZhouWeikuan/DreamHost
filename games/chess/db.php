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
    $cmd = "UPDATE games set " . $fld['state'] . "='OVER', " . $fld['ostate']  . "='OVER', "
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
    $cmd = "UPDATE games set " . $fld['state'] . "='OVER', " . $fld['ostate']  . "='OVER', "
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
        // createServer($uid);
        // return;
    }
    print($ans);
}

function newRound(&$env){
    $gid = $env['gid'];
    $uid = $env['uid'];
    $ans = "type=newRound&uid=$uid";
    $ts  = time(0);
    $cmd = "SELECT * FROM games where gid = $gid LIMIT 1";
    $result = mysql_query($cmd);
    if ($result ){
        $row = mysql_fetch_array($result);
        if ($row){
            $gid = $row['gid'];
        }
    }
    $role = $env['role'];
    global $upper, $down;
    $fld = &$upper;
    if ($role != GameState::SERVER){
        $fld = &$down;
    }
    $state = $fld['state'];
    $last = $fld['last'];
    $ostate = $fld['ostate'];
    $cmd = "UPDATE games set $state='START', $last='$ts' WHERE gid=$gid ";
    if ($row[$ostate] == GameState::START){
        $fcolor = $fld['color'];
        $color  = $row[$fcolor];
        $focolor= $fld['ocolor'];
        $ocolor = $row[$focolor];
        $fcmd = $fld['cmd'];
        $ocmd = $fld['ocmd'];
        $cmd = "UPDATE games set $state='INIT', $ostate='INIT', $last='$ts',"
            . " $fcmd='method=INIT&color=$color', $ocmd='method=INIT&color=$ocolor', "
            . " $fcolor='$ocolor', $focolor='$color' WHERE gid=$gid";
    }

    if ($gid > 0){ // there is a game
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

function updateDraw(&$env, $value){
    $gid = $env['gid'];
    if (!checkValidGame($gid, $row)){
        print ("gid=$gid");
        return;
    }

    $ts  = time(0);
    $uid = $env['uid'];
    $role = $env['role'];
    $ans = "type=updateDraw&uid=$uid";
    global $upper, $down;
    $fld = &$upper;
    if ($role != GameState::SERVER){
        $fld = &$down;
    }
    $fld_msg = $fld['msg'];
    $last = $fld['last'];
    $cmd = "UPDATE games SET $fld_msg='$value', $last='$ts' WHERE gid=$gid";
    $result = mysql_query($cmd);
    if ($result){
        $ans .= "&gid=$gid";
    } else {
        $ans .= "&gid=-1";
    }
    print($ans);
}

function askDraw(&$env){
    updateDraw($env, 'ASKDRAW');
}

function notDraw(&$env){
    updateDraw($env, 'NOTDRAW');
}

function acceptDraw(&$env){
    updateDraw($env, 'DRAW');
}

function doInfo(){
    $lns = array();
    $rns = array();
    $ans = "type=doInfo";
    $cmd = 'select gid,name from games,users '
         . 'where gid>0 and games.uid=users.id order by gid';
    $res = mysql_query($cmd);
    while ($row = mysql_fetch_array($res)){
        array_push($lns, $row['name']);
    }

    $cmd = 'select gid,name from games,users '
         . 'where gid>0 and games.did=users.id order by gid';
    $res = mysql_query($cmd);
    while ($row = mysql_fetch_array($res)){
        array_push($rns, $row['name']);
    }
    $lns = implode(',', $lns);
    $rns = implode(',', $rns);
    $ans .= "&lns=$lns";
    $ans .= "&rns=$rns";
    print($ans);
}

?>

