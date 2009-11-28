<?php
include_once('header.php');
include_once('db.php');
include_once('global.php');
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<head>
<title> 人品大战 </title>
<!-- the favicon.ico -->
<link href="favicon.ico" rel="icon" type="image/x-icon" />
<link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
<link href="favicon.ico" rel="bookmark" type="image/x-icon" />

<!-- The css files -->
<link href="css/global.css" rel="stylesheet" type="text/css" />
<link href="css/comment.css" rel="stylesheet" type="text/css" />
<link href="css/renpin.css" rel="stylesheet" type="text/css" />

<!-- the javascript files -->
<script src="js/global.js" language="javascript" type="text/javascript" > </script>
<script src="js/tips.js" language="javascript" type="text/javascript" > </script>

</head> 

<body height="900" width="100%">
<?php
?>

<div id="header">
    <div class="btLine">
        <div class="tc"> 
            <img src="favicon.ico" align="absmiddle" height=32 width=32 />
            <b class="f14">人品大战</b>
            <i><span class="f12"> 看看谁最有魅力! </span></i>
        </div>
    </div>
</div> <!-- id==header -->
<div id="mainFrame">
        <div id="leftSide">
            道具功能目前尚未开发完成，正在构思中的道具如下:<br>
            隐身卡，使用此卡后使用者姓名将隐藏，伤害也相应有所下降；<br>
            疯狂卡，使用此卡后随机选中的一位朋友将受攻击，伤害强化；<br>
        </div> <!-- id==leftSide-->

        <div id="rightSide">
			<h3 class="mmls">你的库藏</h3>
			<div id='event_list'>
			    你尚未购买任何道具。
			<?php 
			?>
			</div>
        </div> <!-- id==rightSide -->
</div> <!-- id == mainFrame -->
<div class="cls"> </div>

<?php
include_once('footer.php');
?>

