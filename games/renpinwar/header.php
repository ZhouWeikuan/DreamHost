<?php

$api_key	= $_REQUEST['xn_sig_api_key']; // 你的 api_key
$session_key = $_REQUEST['xn_sig_session_key'];
$secret_key	= 'fdcb2b65fc5b4e3fbc40372a472ed401'; // 你的 secret
$xiaonei_uid = $_REQUEST['xn_sig_user']; // uid is posted, so reduce calling api, 2008.07.21
$homeurl = "http://apps.renren.com/renpinwar/";

/*
if (!$xiaonei_uid){
    $url = 'http://app.renren.com/apps/tos.do?api_key=' . $api_key . "&v=1.0&next=";
    header("Location: $url");
}*/
$lookupUser = $xiaonei_uid;
if ($_REQUEST['obj']){
    $lookupUser = $_REQUEST['obj'];
}

require_once('xiaonei.class.php');

// init
$xn = new XNapp($api_key,$secret_key);

// get logged in userid
//$loggedInUser = $xn->users('getLoggedInUser');
//$xiaonei_uid = $loggedInUser[0][0];

?>

