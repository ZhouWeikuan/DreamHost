<?
include_once('global.php');
include_once('db.php');

$method = $_REQUEST['method'];
$action = $_REQUEST['action'];

createDBConn();
if ($action == 'submit'){
    // when receive a new score
    // action == submit
    // pname  == user's name
    // pscore == user's score
    $pname = $_REQUEST['pname'];
    $pscore = $_REQUEST['pscore'];
    $ans = addNewScore($pname, $pscore);
    print ($ans);
} else {
    // when the user request a score
    // action == get
    // we should return 10 names and scores
    // name1 == user's name ; score1 == user's score
    // name2 == user's name ; score2 == user's score
    // name3 == user's name ; score3 == user's score
    // ....
    $res = getTop10();
    print($res);
}

?>
