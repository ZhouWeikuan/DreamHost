<html>
<?php 
    include_once('header.php'); 
    include_once('db.php'); 
    $action = $_REQUEST['action'];
    // print "$action\n";
    $pid = $_REQUEST['pid'];
    if ($pid == ''){
        $pid = 1000;
    }
    $result = fetchProbList($action, $pid);
    $probs = array();
    $count = 0;
    while($row=mysql_fetch_array($result)){
        array_push($probs, $row);
        ++$count;
    }
    if ($action == 'prev'){
        array_reverse($probs);
    }
?>
<body>
<div id="main" class="tips">
    本站专门讨论zoj上各题解答方案，并附上语法加亮的源代码。欢迎各位同好一起努力，共同进步！
</div>

<div id="probList" class="tips">
    已解决题目列表如下：
    <div class="probFrame">
    <?php
        $prev = 9999;
        $next = 1000;
        foreach($probs as &$row){
            $pid = $row['ProbID'];
            if ($prev > $pid)
                $prev = $pid;
            if ($next < $pid)
                $next = $pid;
        print <<<EOL
        <div class="probItem">
            <a href="showCode.php?pid=$pid"> ZOJ $pid </a>
        </div>
EOL;
        }
        if (0==$count){
        print <<<EOL
        <div class="probItem">
            没有了...
        </div>
EOL;
        }
    ?>
    </div>
    <div class="probPage">
        <a href="index.php?pid=<?echo($prev);?>&action=prev"> 上一页 </a>
        <a href="index.php?pid=<?echo($next);?>&action=next"> 下一页 </a>
    </div>
</div>

<?php
    include_once('footer.php');
?>

</body>
</html>
