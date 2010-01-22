<?php

include_once('facebook.php');
include_once('xiaonei.class.php');

class SNS {
    const XN = 'XIAONEI';
    const FB = 'FACEBOOK';
    public $src;
    public $appInstance;
    public $uid;

    public function __construct($src, $api, $secret) {
        if ($src == SNS::FB) {
            $this->appInstance = new Facebook($api, $secret);
        } else { // xiaonei
            $this->appInstance = new XNApp($api, $secret);
        }
        $this->src = $src;
    }

    public function getInfo($uid){
        $user = array();
        if ($this->src == SNS::FB){
            $user_details = $this->appInstance->api_client->users_getInfo($uid, 'name, pic_square');
            $user = $user_details[0];
            $user['mainurl'] = $user['pic_square'];
            $user['headurl'] = $user['pic_square'];
            $user['tinyurl'] = $user['pic_square'];
        } else if ($this->src == SNS::XN){
            $param = array();
            $param['uids'] = $uid;

            $ans = $this->appInstance->users('getInfo', $param);
            $user = $ans['user'];
        } else {
        }
        return $user;
    }

    public function feed($func, $param){
        if ($this->src == SNS::FB){
            // facebook doesn't support feed any more.
            return;
        } else if ($this->src == SNS::XN){
            $this->appInstance->feed($func, $param);
        } else {
        }
    }
};

if (array_key_exists('fb_sig_api_key', $_REQUEST)){ // facebook applications
    $sns_type = SNS::FB;

    $api_key	= $_REQUEST['fb_sig_api_key']; // 你的 api_key
    $session_key = $_REQUEST['fb_sig_session_key'];
    $secret_key = 'abe89402f3ffcf8128a5322bfb649f60'; // your secret
    $sns_uid = $_REQUEST['fb_sig_user']; // uid is posted, so reduce calling api, 2008.07.21
    $homeurl = "http://apps.facebook.com/chchess/";
    $appID = "261203724659"; // 象棋对战的appId
    $auth_url = 'http://www.facebook.com/tos.php?api_key=' . $api_key . "&v=1.0&canvas&next=";

    $sns = new SNS($sns_type, $api_key, $secret_key);

} else { // xiaonei applications
    $sns_type = SNS::XN;

    $api_key	= $_REQUEST['xn_sig_api_key']; // 你的 api_key
    $session_key = $_REQUEST['xn_sig_session_key'];
    $secret_key = '115004bcdb784c6a9413ea213f59931b'; // your secret
    $sns_uid = $_REQUEST['xn_sig_user']; // uid is posted, so reduce calling api, 2008.07.21
    $homeurl = "http://apps.renren.com/chchess/";
    $appID = "89330"; // 象棋对战的appId
    $auth_url = 'http://app.renren.com/apps/tos.do?api_key=' . $api_key . "&v=1.0&next=";

    $sns = new SNS($sns_type, $api_key, $secret_key);
}

// for test
///*
$dbname = 'chess';
$dbuser = 'root';
$dbpass = 'ldap4$';
$server = "192.168.97.141";
//*/

// for actual server
/*
$dbname = 'zhouweik_chess';
$dbuser = 'zhouweik_weikuan';
$dbpass = 'ldap$';
$server = "www.zhouweikuan.cn";
*/

?>

<script language="JavaScript" type="text/javascript">
    var snsType = '<?echo($sns_type);?>';
    var snsUid= '<?echo($sns_uid);?>';
    var appID = '<?echo($appID);?>';
    var defHomeUrl = '<?echo($homeurl);?>';
</script>

