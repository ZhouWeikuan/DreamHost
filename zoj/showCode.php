<html>
<?php 
    include_once('header.php'); 
    include_once('db.php'); 

    $id = $_REQUEST['pid'];
    if ($id <= 1000 || id >=9999){
        $id = 1001;
    }
    $table = 'Codes';
    $row = array();
    $result = fetchResult($table, $id);
    if ($result){
        $row = mysql_fetch_array($result);
    }
?>
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

<div id="comments">
<?php
    $table = 'Comments';
    $row = array();
    $result = fetchResult($table, $id);
    if ($result){
        while($row = mysql_fetch_array($result)){
            $User = $row['User'];
            $SubTime = $row['SubTime'];
            $Comment = $row['Comment'];
            print <<<EOL
            <div class="commentItem">
                <div> $User  on $SubTime </div>
                <div> $Comment </div>
            </div>
EOL;
        }
    } else {
    print <<<EOL
    <div class="commentItem">
        如果有什么意见或建议，请添加评论。
    </div>
EOL;
    }
?>
</div>
<div id="newComment">
    add new comment here;
</div>

<?php
    include_once('footer.php');
?>

</body>
</html>
