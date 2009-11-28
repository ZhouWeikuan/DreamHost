<?php
include_once('db.php');

function onNewComment(){
    createDBConn();
    $ProbID = $_REQUEST["ProbID"];
    if ($ProbID < 1000 || $ProbID > 9999){
        print("不合法的题目编号： $ProbID\n");
        return;
    }
    $Com  = urldecode($_REQUEST["Comment"]);
    $Com  = addslashes($Com);
    $suff = "SET Comment='$Com', ProbID=$ProbID";

    $User = urldecode($_REQUEST["User"]);
    $User = addslashes($User);
    if ($User){
        $suff .= ", User='$User'";
    }
    $Url  = urldecode($_REQUEST["Url"]);
    $Url  = addslashes($Url);
    if ($Url){
        $suff .= ", Url='$Url'";
    }
    $cmd = "INSERT INTO Comments $suff";
    $result = mysql_query($cmd);
    if (!$result){
        print(mysql_error());
        return;
    }

    if ($result){
        $cmd = "SELECT * FROM Comments ORDER BY SubTime DESC LIMIT 1";
        // print($cmd);
        $result = mysql_query($cmd);
        if (!$result){
            print(mysql_error());
            return;
        }
        $row = mysql_fetch_array($result);
        $SubTime = $row['SubTime'];
        $User = $row['User'];
        $Url = $row['Url'];
        if ($Url){
            $User = "<a href='$Url'> $User </a>";
        } 
        $Comment = &$row['Comment'];
        print <<<EOF
            <div> 在$SubTime 时，$User 评论： </div>
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
