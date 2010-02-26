<?
include_once('global.php');
include_once('db.php');


function detectTimeOut(&$fld, &$row){
    return false;
}

function updateSync(){
    $gid = $_REQUEST['gid'];
    $row = '';
    if (!checkValidGame($gid, $row)){
        print("gid=-1");
        return ;
    }
    $ans = "type=sync&gid=$gid";
    $role = $_REQUEST['role'];
    global $upper, $down;
    $fld = &$upper;
    if ($role != GameState::SERVER){
        $fld = &$down;
    }
    if (detectTimeOut($fld, $row)){
    }

    $preState = $_REQUEST['state'];
    $ts = time(0);
    $ans .= "&time=$ts";
    $cmd = '';
    if ($row[$fld['state'] ] != $preState){
        $state = $row[$fld['state']];
        $ans .= "&state=$state";
    }
    $lastName = $fld['last'];
    $cmd = "UPDATE games set $lastName='$ts'";

    $msgName = $fld['omsg'];
    if ($row[$msgName] != 'NONE'){
        $msg = $row[$msgName];
        $ans .= "&msg=$msg";
        $cmd .= ", $msgName='NONE'";
    }
    $cmdName = $fld['ocmd'];
    if ($row[$cmdName] != ''){
        $ans .= '&' . $row[$cmdName];
        $cmd .= ", $cmdName=''";
    }
    $cmd .= " WHERE gid=$gid";
    $result = mysql_query($cmd);
    $ans .= "&result=$result&cmd=$cmd";
    print ("$ans");
}

createDBConn();
updateSync();

?>

