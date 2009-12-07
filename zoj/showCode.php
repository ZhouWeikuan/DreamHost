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
<script type="text/javascript" src="ajax.js"> </script>
<div id="newComment">
    <input type="hidden" id="ProbID" value="<?echo($ProbID);?>" />
    <div class="divtitle"> 请添加新评论</div>
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
