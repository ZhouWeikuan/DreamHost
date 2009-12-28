<html xmlns="http://www.w3.org/1999/xhtml">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<head>
<title> 人品大战 </title>
<!-- the favicon.ico -->
<link href="favicon.ico" rel="icon" type="image/x-icon" />
<link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
<link href="favicon.ico" rel="bookmark" type="image/x-icon" />

<!-- The css files -->
<link href="css/global.css" rel="stylesheet" type="text/css" />
<link href="css/comment.css" rel="stylesheet" type="text/css" />
<link href="css/renpin.css" rel="stylesheet" type="text/css" />

<!-- the javascript files -->
<script language="javascript" type="text/javascript">
    var xn_sig_time = "<?php echo($_REQUEST['xn_sig_time']); ?>";
    var xn_sig_added = "<?php echo($_REQUEST['xn_sig_added']); ?>" ;
    var xn_sig_user = "<?php echo($_REQUEST['xn_sig_user']); ?>" ;
    var xn_sig_session_key = "<?echo($_REQUEST['xn_sig_session_key']); ?>" ;
    var xn_sig_expires = "<?php echo($_REQUEST['xn_sig_expires']);?>" ;
    var xn_sig_api_key = "<?php echo($_REQUEST['xn_sig_api_key']);?>" ;
    var theOtherUser = "<?php echo($lookupUser);?>" ;

function JS_redirect(url) {
    if (window.parent) {
        window.parent.location.href = url;
    } else {
        window.location.href = url;
    }
}

<?
    if (!$xiaonei_uid){
        $url = 'http://app.renren.com/apps/tos.do?api_key=' . $api_key . "&v=1.0&next=";
?>
        JS_redirect("<?php echo($url);?>");
<?
    }
?>

</script>
<script src="js/global.js" language="javascript" type="text/javascript" > </script>
<script src="js/tips.js" language="javascript" type="text/javascript" > </script>

</head> 

