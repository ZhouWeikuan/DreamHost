<?

class GameState {
    const TIMELIMIT = 300; // 5 minutes

    const NONE   = 'NONE';
    const START  = 'START';
    const SERVER = 'SERVER';
    const CLIENT = 'CLIENT';
    const INIT   = 'INIT';
    const MOVE   = 'MOVE';
    const WAIT   = 'WAIT';
    const OVER   = 'OVER';

    const ASKDRAW = 'ASKDRAW';
    const NOTDRAW = 'NOTDRAW';
    const DRAW    = 'DRAW';
    const LOSE    = 'LOSE';
    const WIN     = 'WIN';
};

$upper = array(
    'id' => 'uid',          'msg' => 'umsg',
    'state' => 'ustate',    'last' => 'ulast',
    'color' => 'ucolor',    'oid' => 'did',
    'omsg' => 'dmsg',       'ostate' => 'dstate',
    'olast' => 'dlast',     'ocolor' => 'dcolor',
    'cmd' => 'ucmd',        'ocmd'  => 'dcmd'
);

$down = array(
    'id' => 'did',          'msg' => 'dmsg', 
    'state' => 'dstate',    'last' => 'dlast',
    'color' => 'dcolor',    'oid' => 'uid',
    'omsg' => 'umsg',       'ostate' => 'ustate',
    'olast' => 'ulast',     'ocolor' => 'ucolor',
    'cmd' => 'dcmd',        'ocmd'  => 'ucmd'
);

?>
