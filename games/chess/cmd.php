<?
include_once('global.php');
include_once('db.php');

$method = $_REQUEST['method'];
$uid = $_REQUEST['uid'];

createDBConn();

switch($method){
    case 'MOVE':
        doMove($_REQUEST);
        break;
    case 'SERVER':
        createServer($uid);
        break;
    case 'CLIENT':
        findServer($uid);
        break;
    case 'ASKDRAW':
        askDraw();
        break;
    case 'DRAW':
        acceptDraw();
        break;
    case 'NOTDRAW':
        notDraw();
        break;
    case 'LOSE':
        doLose($_REQUEST);
        break;
    case 'WIN':
        doWin($_REQUEST);
        break;
    case 'START':
        newRound($_REQUEST);
        break;
    case 'UPDATE':
        updateState($_REQUEST);
        break;
    default:
        break;
}

?>
