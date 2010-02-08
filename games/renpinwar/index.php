<?php
include_once('header.php');
include_once('db.php');
include_once('global.php');
include_once('html_head.php');
?>

<body height="900" width="100%">
<?
    /// echo ("xiaonei id is:" . $lookupUser);
    createDBConn();
    $row = getUserInfo($lookupUser);
    /// print_r($row);
?>

<div id="header">
    <div class="btLine">
        <div class="tc"> 
            <img src="favicon.ico" align="absmiddle" height=32 width=32 />
            <b class="f14">人品大战</b>
            <i><span class="f12"> 看看谁最有魅力! </span></i>
        </div>
    </div>
</div> <!-- id==header -->
<div id="mainFrame">
        <div id="leftSide">
            <div class="nav" >
                <div class="navbg"  onmouseover="javascript:showDivNavTips('home');" 
                                    onmouseout="javascript:closeDivNavTips();">
                    <h4 class="sy"><a href="javascript:onHref('/index.php');" class="sl2">首页</a></h4>	
                </div>
                <div class="navbg"  onmouseover="javascript:showDivNavTips('tool');" 
                                    onmouseout="javascript:closeDivNavTips();">
                    <h4 class="ph"><a href="javascript:onHref('/tool.php');" class="sl2">道具</a></h4>
                </div>
                <div class="navbg"  onmouseover="javascript:showDivNavTips('rank');" 
                                    onmouseout="javascript:closeDivNavTips();">
                    <h4 class="ph"><a href="javascript:onHref('/top.php')" class="sl2">排名</a></h4>
                </div>
                <div class="navbg"  onmouseover="javascript:showDivNavTips('help');" 
                                    onmouseout="javascript:closeDivNavTips();">
                    <h4 class="help"><a href="javascript:onHref('/help.php')" class="sl2">帮助</a></h4>
                </div>
            </div>
            <div class="tips" id="divNavTips"> </div> <br>
            <div class="dealimg"> <img src="<? echo($row['iconurl']) ?>" height=120 width=120 /> </div> 
            <div class="dealinfo">
                <div> 用户信息: </div>
                <div>
                    <strong class="f14 dblue"> <?echo($row['name']);?> </strong>
                </div>
                <div> 人品指数: 
                    <? echo($row['score']); ?> </a>
                    <!-- span onmouseover="javascript:showDivRPTips('<echo($row["name"]);>');" 
                          onmouseout="javascript:closeDivRPTips();">
                        <a href="javascript:onHref('/rank.php?obj=<echo($lookupUser);>');" > 
                    </span -->
                </div>
                <div id='divRPTips' class="tips" style="display:none;"> </div>
                <div > &nbsp; </div>
                <div> 好友排名: <? echo(getRankInFriends($xiaonei_uid, $lookupUser));?> </div>
                <div> &nbsp; </div>
            </div>
            <div class="cls">
            <?php if ($xiaonei_uid==$lookupUser) { ?>
                <div class='wysft'>
                    <span onmouseover="javascript:showDivSettingTips();" 
                          onmouseout="javascript:closeDivSettingTips();" 
                          onclick="javascript:setmsg(<?echo($xiaonei_uid);?>);" style="cursor:pointer;">
                    设置</span></div>
                <div id='divSettingTips' class="tips"></div>
                <div id='divPopSettings' class="popup"></div>
                <div class='wysft'>
                    <span onmouseover="javascript:showDivHelpTips();" 
                          onmouseout="javascript:closeDivHelpTips();" 
                          onclick="javascript:doFriends('<?echo($xiaonei_uid);?>', 'help');"
                          style='cursor:pointer;'>
                    助友</span></div>
                <div id='divHelpTips' class="tips"></div>
                <div class='wysft'>
                    <span  onmouseover="javascript:showDivHarmTips();" 
                          onmouseout="javascript:closeDivHarmTips();" 
                           onclick="javascript:doFriends('<?echo($xiaonei_uid);?>', 'harm');"
                        style='cursor:pointer;'>损友</span></div>
                <div id='divHarmTips' class="tips"></div>
            <?php } elseif(isAppFriends($xiaonei_uid, $lookupUser)) { ?>
                <div class='wysft'>
                    <span  onmouseover="javascript:showDivHelpTips();" 
                          onmouseout="javascript:closeDivHelpTips();" 
onclick='javascript:doFriends("<?echo($xiaonei_uid);?>", "help", "<?echo($lookupUser);?>", "<?echo($row['name'])?>");' 
                        style='cursor:pointer;'>帮助他</span></div>
                <div id='divHelpTips' class="tips"></div>
                <div class='wysft'>
                    <span  onmouseover="javascript:showDivHarmTips();" 
                           onmouseout="javascript:closeDivHarmTips();" 
onclick='javascript:doFriends("<?echo($xiaonei_uid);?>", "harm", "<?echo($lookupUser);?>", "<?echo($row['name']);?>");' 
                        style='cursor:pointer;'>陷害他</span></div>
                <div id='divHarmTips' class="tips"></div>
            <?php } else { ?>
                <div> &nbsp; </div>
                <div> &nbsp; </div>
                <div> &nbsp; </div>
            <?php } ?>
            </div>

            <div class='info'>
                <?
                    $score = $row['score'];
                    $result = mysql_query("SELECT * FROM rank WHERE score>=" . $score . " limit 1");
                    if ($result){
                        $row = mysql_fetch_array($result);
                    }
                    if ($result && $row) {
                        $txt = $row['text'];
                    } else {
                        $txt = '你是个神秘的人,人品未知!';
                    }
                    echo("$txt");
                ?>
            </div>
            <div id="divPop" class="popup"> </div>
            <div class="cls"> </div>
        </div> <!-- id==leftSide-->

        <div id="rightSide">
            <div class="deal_navbg2" onclick="javascript:inviteFriends();">
                 <h4> 邀请好友前来助阵 </h4>
            </div>
            <div class="cls"> </div>
			<h3 class="mmls">活动记录</h3>
			<div id='event_list'>
			<?php 
                $txt = "SELECT * FROM events WHERE id=$lookupUser or obj=$lookupUser "
                        . "ORDER BY stage DESC limit 5";
                $result = mysql_query($txt);
                if ($result){
                    $row = mysql_fetch_array($result);
                }
                if (!$result || !$row){
                    echo("<span class='c9' style='padding:8px 0 0px 25px;'>近期没有活动记录</span>");
                } else {
                    for ( ;$row; $row=mysql_fetch_array($result)) {  
                        $txt = $row['message'];
                        $stage = $row['stage'];
                        echo <<<HISEND
                    <div class="p7_0">
                        <div class="l"><img src="http://img1.kaixin001.com.cn/i/slave/che.gif" alt="购物车" /></div>
                        <div class="histy_mx">
                            <div style="float:left;"> $txt </div>
                            <div style="float:right;">$stage</div>
                            <div class="cls"></div>
                        </div>
                        <div class="cls"></div>
                    </div>
HISEND;
                    }
               }
			?>
			</div>
        </div> <!-- id==rightSide -->
</div> <!-- id == mainFrame -->
<div class="cls"> </div>

<?php
include_once('footer.php');
?>

