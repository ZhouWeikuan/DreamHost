<?php
include_once('header.php');
include_once('global.php');
include_once('db.php');

function getAppUsers(){
    $list = getAppFriends();
    if (!is_array($list)){
        print <<<EOL
        <div class="flist">
            没有好友在玩此游戏！
        </div>
EOL;
        return;
    }
    $flst = implode($list, ",");
    createDBConn();
    global $conn;
    $cmd = "SELECT id, name FROM users where id in ($flst)";
    $result = mysql_query($cmd);
    echo('<div class="flist">');
    while( ($row = mysql_fetch_array($result))){
        $id = &$row['id'];
        $name = &$row['name'];
        print <<<EOL
    <input class="friend" type="radio" value="$id" onclick="javascript:setTxtObj(this);"> $name </input>
EOL;
    }
    echo('</div>');
}

function errorExceedLimitedCount($name){
    print <<<EOL
    <div class="warning">
        你对${name}动作次数已经超过限制，请过三小时后再试！
    </div>
EOL;
}

function harmOther(){
    global $xiaonei_uid;
    global $lookupUser;
    global $conn;
    createDBConn();
    $yourMsg = fetchMsg($lookupUser);
    $cnt = fetchOneDayCount($xiaonei_uid, $lookupUser);
    if ($cnt >= 1){
        return errorExceedLimitedCount($yourMsg['name']);
    }
    $myMsg = fetchMsg($xiaonei_uid);
    $val = rand(3, 5);
    updateRenpin($xiaonei_uid, -1);
    updateRenpin($lookupUser, -$val);
    $myName = formatName($xiaonei_uid, $myMsg['name']);
    $yourName = formatName($lookupUser, $yourMsg['name']);
    $doharm = $myMsg['doharm'];
    $harmed = $yourMsg['harmed'];
    $msg =<<<EOL
    ＂${doharm}＂，${myName}突然袭击${yourName}，只用了一招就伤害了${yourName}${val}点人品；
     ${yourName}顿时发飙，对${myName}说：＂${harmed}＂。
EOL;
    $result = updateEvent($xiaonei_uid, $lookupUser, "harm", $msg)?"成功!":"失败!";
    echo('<div class="notice">');
    echo($msg);
    echo('</div>');
}

function helpOther(){
    global $xiaonei_uid;
    global $lookupUser;
    global $conn;
    createDBConn();
    $yourMsg = fetchMsg($lookupUser);
    $cnt = fetchOneDayCount($xiaonei_uid, $lookupUser);
    if ($cnt >= 1){
        return errorExceedLimitedCount($yourMsg['name']);
    }
    $myMsg = fetchMsg($xiaonei_uid);
    $val = rand(3, 5);
    updateRenpin($xiaonei_uid, 1);
    updateRenpin($lookupUser, $val);
    $myName = formatName($xiaonei_uid, $myMsg['name']);
    $yourName = formatName($lookupUser, $yourMsg['name']);
    $dohelp = $myMsg['dohelp'];
    $helpped = $yourMsg['helpped'];
    $msg =<<<EOL
    ＂${dohelp}＂，${myName}带着微笑帮助${yourName}改善人际关系，提高了${yourName}${val}点人品；
     ${yourName}向${myName}投来感激的的目光，对${myName}说：＂${helpped}＂。
EOL;
    $result = updateEvent($xiaonei_uid, $lookupUser, "help", $msg)?"成功!":"失败!";
    echo('<div class="notice">');
    echo($msg);
    echo('</div>');
}

// echo($_REQUEST['method']);
$func = $_REQUEST['method'];
$callstr = "${func}();";
// echo($callstr);
eval($callstr);
//getAppUsers();
?>
