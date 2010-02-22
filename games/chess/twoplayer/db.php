<?php
include_once('config.php');

function createDBConn(){
    global $conn, $dbuser, $dbpass, $dbname;
    $conn = mysql_connect('localhost', $dbuser, $dbpass) or die(mysql_error());
    mysql_select_db($dbname, $conn) or die(mysql_error());
}

function begin(){
    mysql_query('BEGIN');
}

function commit(){
    mysql_query('COMMIT');
}

function rollback(){
    mysql_query('ROLLBACK');
}

function sendNewsFeed($uid){
    global $sns;

    $data = array('gamename'=>'chinese chess(象棋对战)', 'creator'=>'we(咱家)');
    $data = json_encode($data);
    $params = array (
        "template_id" => 1,
        "title_data" => $data,
        "body_data" => $data
    );

    try {
        $sns->feed('publishTemplatizedAction', $params);
    } catch (Exception $e){
        print $e->getMessage();
    }
}

function getUserInfo($uid){
    global $sns, $sns_type;
    begin();
    $ts = time(0);
    $result = mysql_query("SELECT * FROM users WHERE id=" . $uid);
    if ($result){
        $row = mysql_fetch_array($result);
    }
    if (!$result || !$row || $row['era'] < $ts - 3 * 24 * 60 * 60){
        $user = $sns->getInfo($uid);
        $name = $user['name'];
        $icon = $user['mainurl'];
        if (!$icon){
            $icon = $user['headurl'];
        }
        if (!$icon){
            $icon = $user['tinyurl'];
        }
        // echo ("name is " . $name);
        if ($row){
            $cmd = "UPDATE users SET name='$name', sns='$sns_type', iconurl='$icon', era='$ts' WHERE id=$uid";
        } else {
            $cmd = "INSERT INTO users (id, sns, name, iconurl, era) "
                 . "VALUES ('$uid', '$sns_type', '$name', '$icon', '$ts') ";
        }
        mysql_query($cmd) or die(mysql_error());
        $result = mysql_query("SELECT * FROM users WHERE id=" . $uid);
        $row = mysql_fetch_array($result);
        sendNewsFeed($uid);
    }
    commit();
    return $row;
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

    begin();
    $state = $fld['state'];
    $ostate = $fld['ostate'];
    $cmd = "SELECT $state FROM games WHERE gid=$gid";
    $res = mysql_query($cmd);
    $cur = '';
    if ($res){
        $row = mysql_fetch_array($res);
        if ($row){
            $cur = $row[$state];
        }
    }
    if ($cur != GameState::OVER) {
        $cmd = "UPDATE games set $state='WAIT', $ostate='MOVE', "
            . $fld['cmd'] . "='$cmdStr' WHERE gid=$gid" ;
    } else {
        $cmd = "UPDATE games set " . $fld['cmd'] . "='$cmdStr' WHERE gid=$gid" ;
    }
    $result = mysql_query($cmd);
    if (mysql_error()){
        rollback();
    } else {
        commit();
    }
    $ans .= "&result=$result";
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
    $ans .= "&result=$result";
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
    $ans .= "&result=$result";
    print($ans);
}

function doEnter(&$env){
    $gid = $env['gid'];
    $uid = $env['uid'];
    $role = $env['role'];
    $name = '未知';
    $cmd = "SELECT name FROM users WHERE id=$uid LIMIT 1";
    $res = mysql_query($cmd);
    if ($res){
        $row = mysql_fetch_array($res);
        if ($row){
            $name = $row['name'];
        }
    }

    $ans = "type=doEnter&gid=$gid";
    global $upper, $down;
    $fld = &$upper;
    if ($role != GameState::SERVER){
        $fld = &$down;
    }

    $oid = $fld['oid'];
    $cmd = "SELECT $oid, name FROM games, users WHERE gid=$gid AND users.id = games.$oid LIMIT 1";
    $res = mysql_query($cmd);
    if ($res){
        $row = mysql_fetch_array($res);
        if ($row){
            $ans .= "&msg=ENTER&name=" . $row['name'];
        }
    }
    
    $msg = $fld['msg'];
    $cmd = "UPDATE games SET $msg='ENTER&name=$name' WHERE gid=$gid";
    $res = mysql_query($cmd);

    print($ans);
}

function doLeave(&$env){
    $gid = $env['gid'];
    $uid = $env['uid'];
    $role = $env['role'];
    $name = '未知';
    $cmd = "SELECT name FROM users WHERE id=$uid LIMIT 1";
    $res = mysql_query($cmd);
    if ($res){
        $row = mysql_fetch_array($res);
        if ($row){
            $name = $row['name'];
        }
    }

    $ans = "type=doLeave&gid=$gid";
    global $upper, $down;
    $fld = &$upper;
    if ($role != GameState::SERVER){
        $fld = &$down;
    }
    
    $msg = $fld['msg'];
    $id = $fld['id'];
    $cmd = "UPDATE games SET $id=-1, $msg='LEAVE&name=$name' WHERE gid=$gid";
    $res = mysql_query($cmd);

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
    $ans .= "&result=$result";
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
        if ($result){
            $ans .= "&gid=$gid";
        } else {
            $ans .= "&gid=-1";
        }
    } else { // no games found, turn to server?
        $ans .= "&gid=-1";
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
    $ans = "type=doInfo&method=INFO&ret=OK";
    $cmd = 'select gid,name from games,users where gid>0 and games.uid=users.id order by gid';
    $res = mysql_query($cmd);
    while ($row = mysql_fetch_array($res)){
        array_push($lns, $row['name']);
    }
    $lns = implode(',', $lns);

    $cmd = 'select gid,name from games,users where gid>0 and games.did=users.id order by gid';
    $res = mysql_query($cmd);
    while ($row = mysql_fetch_array($res)){
        array_push($rns, $row['name']);
    }
    $rns = implode(',', $rns);

    $ans .= "&lns=$lns&rns=$rns";
    print($ans);
}

function doSeat(&$env){
    // method, uid, gid, role;
    $uid = $env['uid']; 
    $gid = $env['gid']; 
    $role = $env['role']; 
    $ts  = time(0) - GameState::TIMELIMIT;
    $ans = "type=doSeat&gid=$gid&role=$role";

    global $upper, $down;
    $fld = &$upper;
    if ($role != GameState::SERVER){
        $fld = &$down;
    }
    $fld_id = $fld['id'];

    $cmd = "UPDATE games SET uid=-1 WHERE (uid=$uid AND ustate='OVER') OR (uid > 0 AND ulast < $ts)";
    mysql_query($cmd);

    $cmd = "UPDATE games SET did=-1 WHERE (did=$uid AND dstate='OVER') OR (did > 0 AND dlast < $ts)";
    mysql_query($cmd);

    begin();
    $cmd = "SELECT uid, did FROM games WHERE uid=$uid OR did=$uid LIMIT 1";
    $res = mysql_query($cmd);
    $row = '';
    if ($res) {
        $row = mysql_fetch_array($res);
    }

    if ($row){
        $ans .= "&ret=error&reason='You have already in a room!'";
    } else {
        $cmd = "SELECT uid, did FROM games WHERE gid=$gid LIMIT 1";
        $res = mysql_query($cmd);
        if ($res) {
            $row = mysql_fetch_array($res);
        }
        if ($row && $row[$fld_id] == -1){
            $ts = time(0);
            $state = $fld['state'];
            $msg = $fld['msg'];
            $fcmd = $fld['cmd'];
            $last = $fld['last'];
            $cmd = "UPDATE games set $fld_id='$uid', $state='OVER', $msg='NONE', $last='$ts',"
                . "$fcmd='' WHERE gid='$gid'";
            if (mysql_query($cmd)){
                $ans .= "&ret=ok";
            } else {
                $ans .= "&ret=error&reason='can't update the table!'";
            }
        } else {
            $ans .= "&ret=error&reason='There is someone there already!'";
        }
    }
    $ans .= "&method=SEAT";
    
    if (mysql_error()){
        rollback();
    } else {
        commit();
    }

    print($ans);
}

function fetchComments(){
    $cmd = "SELECT cid, sns, uid, name, iconurl, txt, comments.era as era FROM comments, users " 
         . "WHERE users.id = comments.uid ORDER BY cid DESC;";
    $res = mysql_query($cmd);
    return $res;
}

?>

