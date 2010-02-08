<?php
include_once('db.php');

$res = addNewItemToTable('Codes', $_POST);
print_r($res);

?>

