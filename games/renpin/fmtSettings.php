<?php
include_once('db.php');

$uid = $_REQUEST['obj'];
createDBConn();
$cmd = "SELECT * FROM msg where id = $uid";
$result = mysql_query($cmd);
$row = "";
if ($result){
    $row = mysql_fetch_array($result);
}
if (!$result || !$row){
    $cmd = "INSERT INTO msg (id) values ($uid)";
    $result = mysql_query($cmd);
    $cmd = "SELECT * FROM msg where id = $uid";
    $result = mysql_query($cmd);
    $row = "";
    if ($result){
        $row = mysql_fetch_array($result);
    }
}

?>
<span class="poptitle"> 信息设置 </span>
<input type=hidden id="obj" value="<?echo($uid);?>"> </input>
当你帮助别人时：<input type=text size=20 id="dohelp" value="<?echo($row['dohelp'])?>"> </input> <BR>
当你陷害别人时：<input type=text size=20 id="doharm" value="<?echo($row['doharm'])?>"> </input> <BR>
当别人帮助你时：<input type=text size=20 id="helpped" value="<?echo($row['helpped'])?>"> </input> <BR>
当别人陷害你时：<input type=text size=20 id="harmed" value="<?echo($row['harmed'])?>"> </input> <BR>
<BR>
<form method="post" action="saveSettings.php">
<input type="button" value="提交" onclick="javascript:savePopupSettings();"> </input>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
<input type="button" value="取消" onclick="javascript:closePopupSettings();"> </input>

