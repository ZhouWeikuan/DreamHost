<?php
include_once('db.php');

function onNewComment(){
    createDBConn();
    $uid = $_REQUEST["uid"];
    if ($ProbID <= 0){
        print("不合法的用户编号： $uid\n");
        return;
    }
    $txt  = urldecode($_REQUEST["Comment"]);
    $txt  = addslashes($txt);
    $cmd = "INSERT INTO comments SET txt='$txt', uid='$uid'";
    $result = mysql_query($cmd);
    if (!$result){
        print(mysql_error());
        return;
    }

    if ($result){
        $cmd = "SELECT uid, name, iconurl, txt, era FROM comments, users "
                . "WHERE users.id = comments.uid ORDER BY era DESC LIMIT 1";
        // print($cmd);
        $result = mysql_query($cmd);
        if (!$result){
            print(mysql_error());
            return;
        }
        $row = mysql_fetch_array($result);
        $SubTime = $row['era'];
        $icon = $row['iconurl'];
        $User = $row['name'];
        $uid = 'http://renren.com/profile.do?id=' + $row['uid'];
        $User = "<a href='$Url'> $User </a>";

        $Comment = stripslashes($row['txt']);
        print <<<EOF
            <div> <img src="$icon" class="dealimg"></img> $User 于$SubTime 时发表评论： </div>
            <div> $Comment </div>
EOF;
    }
    
}

$fun = $_REQUEST["method"];
if ($fun == "onNewComment"){
    onNewComment();
} else {
    print("Unknown method $fun!\n");
}

?>
