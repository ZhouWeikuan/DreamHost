<?php

function isAppFriends($me, $obj){
    global $xn;
    $arr = array('uids1'=> $me, 'uids2'=>$obj);
    $ans = $xn->friends('areFriends', $arr);
    $ret = $ans['friend_info']['are_friends'];
    return $ret;
}

function getAppFriends(){
    global $xn;
    $list = $xn->friends('getAppUsers');
    $f_arr = $list['uid'];
    return $f_arr;
}

// passed in:
//      $uid,  the user's xiaonei_id, that we want to query
function getRankInFriends($xn_uid, $uid){
    $arr = getAppFriends();
    if (!is_array($arr)){
        return 1;
    }
    array_push($arr, $xn_uid);
    $rank = -1;
    $cmd = "select count(id) as rank from users where id in (" . implode($arr, ", ") . ") "
         . "AND score >= (select score from users where id = $uid)";
    //print($cmd);
    $result = mysql_query($cmd);
    if ($result){
        $row = mysql_fetch_array($result);
        $rank = $row['rank'];
    }
    return $rank;
}

function formatName($id, $name){
    $ans = "<a href=\"javascript:visitUser($id);\" > $name </a>";
    return $ans;
}



?>

