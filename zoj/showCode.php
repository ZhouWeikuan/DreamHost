<html>
<?php 
    include_once('db.php'); 

    $ProbID = $_REQUEST['pid'];
    if ($ProbID <= 1000 || ProbID >=9999){
        $ProbID = 1001;
    }
    $table = 'Codes';
    $row = array();
    $order = '';
    $result = fetchResult($table, $ProbID, $order);
    if ($result){
        $row = mysql_fetch_array($result);
    }
?>
<head>
    <link href="global.css" rel="stylesheet" type="text/css" />
    <title>acm zju, zoj <?echo("$ProbID");?> </title>
</head>
<body>
<div id="main" class="tips">
    本站专门讨论zoj上各题解答方案，并附上语法加亮的源代码。欢迎各位同好一起努力，共同进步！
</div>

<div class="tips">
站内搜索: 
<!-- SiteSearch Google -->
<form method="get" action="http://www.google.com/custom" target="google_window">
<table border="0" bgcolor="#ffffff">
<tr><td nowrap="nowrap" valign="top" align="left" height="32">
<a href="http://www.google.com/">
<img src="http://www.google.com/logos/Logo_25wht.gif" border="0" alt="Google" align="middle"></img></a>
</td>
<td nowrap="nowrap">
<input type="hidden" name="domains" value="www.zhouweikuan.cn"></input>
<label for="sbi" style="display: none">输入您的搜索字词</label>
<input type="text" name="q" size="48" maxlength="255" value="" id="sbi"></input>
<label for="sbb" style="display: none">提交搜索表单</label>
<input type="submit" name="sa" value="搜索" id="sbb"></input>
</td></tr>
<tr>
<td>&nbsp;</td>
<td nowrap="nowrap">
<table>
<tr>
<td style='white-space: nowrap;'>
<input type="radio" name="sitesearch" value="" checked id="ss0"></input>
<label for="ss0" title="搜索网络"><font size="-1" color="#000000">Web</font></label></td>
<td style='white-space: nowrap;'>
<input type="radio" name="sitesearch" value="www.zhouweikuan.cn" id="ss1"></input>
<label for="ss1" title="搜索 www.zhouweikuan.cn"><font size="-1" color="#000000">www.zhouweikuan.cn</font></label></td>
</tr>
</table>
<input type="hidden" name="client" value="pub-3444671286856380"></input>
<input type="hidden" name="forid" value="1"></input>
<input type="hidden" name="channel" value="7908087389"></input>
<input type="hidden" name="ie" value="UTF-8"></input>
<input type="hidden" name="oe" value="UTF-8"></input>
<input type="hidden" name="safe" value="active"></input>
<input type="hidden" name="cof" value="GALT:#003324;GL:1;DIV:#66CC99;VLC:FF6600;AH:center;BGC:C5DBCF;LBGC:73B59C;ALC:000000;LC:000000;T:330033;GFNT:333300;GIMP:333300;FORID:1"></input>
<input type="hidden" name="hl" value="zh-CN"></input>
</td></tr></table>
</form>
<!-- SiteSearch Google -->

</div>

<div class="tips">
    <a href="javascript:history.back();"> 返回上一页</a>
</div>
<div id="explain">
    <?php
        echo($row['story']);
    ?>
</div>
<div class="code">
    <?php
        $text = stripslashes($row['HtmlSource']);
        echo($text);
    ?>
</div> 

<div id="commentFrame">
<?php
    $table = 'Comments';
    $row = array();
    $order = ' ORDER BY SubTime';
    $result = fetchResult($table, $ProbID, $order);
    if ($result){
        while($row = mysql_fetch_array($result)){
            $User = stripslashes($row['User']);
            $Url = stripslashes($row['Url']);
            if ($Url){
                $User = "<a href='$Url'> $User </a>";
            }
            $SubTime = $row['SubTime'];
            $Comment = stripslashes($row['Comment']);
            print <<<EOL
            <div class="commentItem">
                <div> 在$SubTime 时，$User 评论： </div>
                <div> $Comment </div>
            </div>
EOL;
        }
    }
?>
</div>

<div class="tips">

<script type="text/javascript"><!--
google_ad_client = "pub-3444671286856380";
/* 468x60, 创建于 10-3-3 */
google_ad_slot = "4732789149";
google_ad_width = 468;
google_ad_height = 60;
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
</div>

<script type="text/javascript" src="ajax.js"> </script>
<div id="newComment">
    <input type="hidden" id="ProbID" value="<?echo($ProbID);?>" />
    <div class="divtitle"> 欢迎添加新评论</div>
    <div id="errorMsg"> </div>
    姓名： <input id="commentUserName" type="text" size="12" maxlength="39" />
    &nbsp; &nbsp; 主页：<input id="commentHomeUrl" type="text" size="32" maxlength="119" />
    &nbsp; &nbsp; <input type="submit" value="提交评论" onclick="javascript:onNewComment();" /> <br>
    <textarea id="commentContent" rows="10" cols="80" maxlength="1023"> </textarea> <br>
</div>

<?php
    include_once('footer.php');
?>

</body>
</html>