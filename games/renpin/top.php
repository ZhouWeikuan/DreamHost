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
<?php
    createDBConn();
    $friends = getAppFriends();
    array_push($friends, $xiaonei_uid);
    $cmd = "SELECT * FROM users WHERE id in (" . implode($friends, ", ") .") ORDER BY score DESC LIMIT 5";
    $result = mysql_query($cmd);
    $row = mysql_fetch_array($result);
    $rank = 1;
    while($row ){
?>
            <div>
            <div class="dealtopimg"> <img src=<? echo($row['iconurl']) ?> height=60 width=60 /> </div> 
            <div class="dealtopinfo">
                <div> 用户信息: </div>
                <div>
                    <a href="javascript:visitUser(<? echo($row['id']); ?>);">
                        <strong class="f14 dblue"> <?echo($row['name']);?> </strong>
                    </a>
                </div>
                <div> 人品指数: <? echo($row['score']); ?> </a> </div>
            </div>
            <div class="cls"> 名次: <? echo($rank++);?> </div>
            <div> &nbsp; </div>
            </div>
<?
        $row = mysql_fetch_array($result);
    }
?>
            <div class="cls"> </div>
        </div> <!-- id==leftSide-->

        <div id="rightSide">
            <!-- 右边是排名方法。-->
        </div> <!-- id==rightSide -->
</div> <!-- id == mainFrame -->
<div class="cls"> </div>

<?php
include_once('footer.php');
?>

