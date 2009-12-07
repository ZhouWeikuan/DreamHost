<?
$str = array();
foreach ( $_REQUEST as $k=>&$v){
    array_push($str, "$k=$v");
}

$str = implode("&", $str);
print ($str);

?>
