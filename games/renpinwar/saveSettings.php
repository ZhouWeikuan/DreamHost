<?php
include_once('db.php');

$uid = $_REQUEST['obj'];
$dohelp = ($_REQUEST['dohelp']);
$doharm = ($_REQUEST['doharm']);
$helpped= ($_REQUEST['helpped']);
$harmed = ($_REQUEST['harmed']);
createDBConn();
$cmd = "UPDATE msg set dohelp='$dohelp', doharm='$doharm', "
       . " helpped='$helpped', harmed='$harmed' where id = $uid";
$result = mysql_query($cmd);
if ($result) {
    echo("<span class='notice'> 信息已成功保存! </span><BR>");
} else {
    echo("<span class='notice'> 保存出错，请呆会重试! </span><BR>");
}
?>
<BR>
<input type="button" value="确认" onclick="javascript:closePopupSettings();"> </input>
