<?php

require_once('xiaonei.class.php');

$api_key	= $_REQUEST['xn_sig_api_key']; // 你的 api_key
$session_key = $_REQUEST['xn_sig_session_key'];
$secret_key = '115004bcdb784c6a9413ea213f59931b'; // your secret
$xiaonei_uid = $_REQUEST['xn_sig_user']; // uid is posted, so reduce calling api, 2008.07.21
$homeurl = "http://apps.renren.com/chchess/";

$xn = new XNApp($api_key, $secret_key);
$server = "192.168.1.84";
// $server = "www.zhouweikuan.cn";

?>

