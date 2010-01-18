<?php
include_once('header.php');

function createDBConn(){
    global $conn;
    $conn = mysql_connect('localhost', 'root', 'ldap4$') or die(mysql_error());
    mysql_select_db("test", $conn) or die(mysql_error());
}

function sendNewsFeed($uid){
    global $xn;

    $data = array('gamename'=>'人品大战', 'creator'=>'咱家');
    $data = json_encode($data);
    $params = array (
        "template_id" => 1,
        "title_data" => $data,
        "body_data" => $data
    );

    try {
        $xn->feed('publishTemplatizedAction', $params);
    } catch (Exception $e){
        print $e->getMessage();
    }
}

function getUserInfo($uid){
    global $xn;
    mysql_query('BEGIN');
    $ts = time(0);
    $result = mysql_query("SELECT * FROM users WHERE id=" . $uid);
    if ($result){
        $row = mysql_fetch_array($result);
    }
    if (!$result || !$row || $row['era'] < $ts - 24 * 60*60){
        $param = array();
        $param['uids'] = $uid;
        $ans = $xn->users('getInfo', $param);
        $user = $ans['user'];
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
            $cmd = "UPDATE users SET name='$name', iconurl='$icon', era='$ts' WHERE id=$uid";
        } else {
            $cmd = "INSERT INTO users (id, name, iconurl, era) VALUES ('$uid', '$name', '$icon', '$ts') ";
        }
        mysql_query($cmd) or die(mysql_error());
        $result = mysql_query("SELECT * FROM users WHERE id=" . $uid);
        $row = mysql_fetch_array($result);
        sendNewsFeed($uid);
    }
    mysql_query('COMMIT');
    return $row;
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

