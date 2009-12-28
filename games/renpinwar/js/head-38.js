document.domain="kaixin001.com";
var g_blinkid = 0;
var g_blinkswitch = 0;
var g_blinktitle = document.title;
var g_onlineuser = "";
var g_sysmsg_sound = null;
var g_newmsg_sound = null;
var g_app_num = 0;
var g_appnum = 0;
var g_bappmore = false;
var g_inputtime = 0;

function blinkNewMsg()
{
	var now    = new Date();
	var nowtime = now.getTime();
	if(nowtime - g_inputtime > 5000)
	{
		document.title = g_blinkswitch % 2 ? "【　　　】 - " + g_blinktitle : "【新消息】 - " + g_blinktitle;
	}
	
	g_blinkswitch++;
}

function blinkOnline()
{
	document.title = g_blinkswitch % 2 ? "○" + g_onlineuser + " 上线了 - " + g_blinktitle : "●" + g_onlineuser + " 上线了 - " + g_blinktitle;
	
	g_blinkswitch++;
	
	if (g_blinkswitch > 10)
	{
		stopBlinkNewMsg();
	}
}

function checkNewMsg()
{
	var url = "/home/newmsg.php";
	var pars = "";
	var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { checkNewMsgShow(req.responseText); } });
}

function stopBlinkNewMsg()
{
	if (g_blinkid)
	{
		clearInterval(g_blinkid);
		g_blinkid = 0;
		$("head_msgdiv").style.display = "none";
		document.title = g_blinktitle;
	}
}

var g_oldmsg = g_oldsysmsg = g_oldbbs = g_oldbbsreply = g_oldcomment = g_oldreply = 0;
function checkNewMsgShow(ret)
{
	//过去的版本
	//var r = req.responseText;
	//新版本
	var r = ret;
	if(r.im == "1")
	{
		return;
	}
	stopBlinkNewMsg();
	setTimeout(checkNewMsg, 60000);
	
	var a_msglist = new Array("msg", "sysmsg", "bbs", "bbsreply", "comment", "reply");
	if(r.notice == "1")
	{
		var forbidsound = parseInt(r.forbidsound);
		if (!forbidsound)
		{
			for (i=0; i<a_msglist.length; i++)
			{
				if ($("body_" + a_msglist[i] + "_num"))
				{
					var c = parseInt($("body_" + a_msglist[i] + "_num").innerHTML);
					eval("g_old" + a_msglist[i] + "=c;");
				}
			}

			var newmsg = parseInt(r.msg) + parseInt(r.bbs) + parseInt(r.bbsreply) + parseInt(r.comment) + parseInt(r.reply);
			var sysmsg = parseInt(r.sysmsg);
			
			var newchange = (parseInt(r.msg) - g_oldmsg)
				|| (parseInt(r.bbs) - g_oldbbs)
				|| (parseInt(r.bbsreply) - g_oldbbsreply)
				|| (parseInt(r.comment) - g_oldcomment)
				|| (parseInt(r.reply) - g_oldreply);
			var syschange = (parseInt(r.sysmsg) - g_oldsysmsg);

			for (i=0; i<a_msglist.length; i++)
			{
				eval("g_old" + a_msglist[i] + "=parseInt(r." + a_msglist[i] + ");");
			}

			if (newmsg && newchange)
			{
				if (g_newmsg_sound == null)
				{
					g_newmsg_sound = new SWFObject("http://img1.kaixin001.com.cn/i2/newmsg_sound.1.0.swf", "newmsg_sound_swf", "1", "1", "8", "#ffffff", true);
					g_newmsg_sound.addParam("allowscriptaccess", "always");
					g_newmsg_sound.addParam("wmode", "opaque");
					g_newmsg_sound.addParam("menu", "false");
					g_newmsg_sound.addVariable("autoplay","0");
				}
				g_newmsg_sound.write("head_msgsound_div");
			}
			else if (sysmsg && syschange)
			{
				if (g_sysmsg_sound == null)
				{
					g_sysmsg_sound = new SWFObject("http://img1.kaixin001.com.cn/i2/sysmsg_sound.1.0.swf", "sysmsg_sound_swf", "1", "1", "8", "#ffffff", true);
					g_sysmsg_sound.addParam("allowscriptaccess", "always");
					g_sysmsg_sound.addParam("wmode", "opaque");
					g_sysmsg_sound.addParam("menu", "false");
					g_sysmsg_sound.addVariable("autoplay","0");
				}
				g_sysmsg_sound.write("head_msgsound_div");
			}
		}
		
		$("head_msgdiv").style.display = "block";
		g_blinkid = setInterval(blinkNewMsg, 1000);
	}
	else if (0 && r.online.length)
	{
		g_blinkswitch = 0;
		g_onlineuser = r.online;
		g_blinkid = setInterval(blinkOnline, 500);
	}
	
	for (i=0; i<a_msglist.length; i++)
	{
		if (!parseInt(r[a_msglist[i]]))
		{
			$("head_" + a_msglist[i] + "_num").innerHTML = "";
			if ($("body_" + a_msglist[i] + "_num"))
			{
				$("body_" + a_msglist[i] + "_num").className = "ql2";
				$("body_" + a_msglist[i] + "_num").innerHTML = "0条新";
			}
		}
		else
		{
			$("head_" + a_msglist[i] + "_num").innerHTML = "(" + r[a_msglist[i]] + ")";
			if ($("body_" + a_msglist[i] + "_num"))
			{
				$("body_" + a_msglist[i] + "_num").className = "cr";
				$("body_" + a_msglist[i] + "_num").innerHTML = r[a_msglist[i]] + "条新";
			}
			
			if (a_msglist[i] == "msg")
			{
				if ('function' == typeof(msg_view_checkNewMsg))
				{
					msg_view_checkNewMsg();
				};
			}
		}
	}
}

function outputHead(vuid)
{
	var v_html = 
'<div id="head">'
+'	<div class="hd">'
+'		<div class="h1 wl1" style="margin-top:3px;">'
+'			<div style="padding-left:18px;"><a href="/" class="cf" title="开心网"><img src="http://img1.kaixin001.com.cn/i2/kaixinlogo.gif" alt="开心网" width="106" height="36" /></a></div>'
+'		</div>'
+'		<div class="h2">'
+'			<div id="hn1" class="hn_of">'
+'				<div class="hn_tt"><a href="/home/?uid='+vuid+'&t=' + Math.ceil(Math.random() * 100) + '" class="n">首页</a></div>'
+'				<div class="hn_sj"><a href="javascript:xs(1);" class="sj"><img src="http://img1.kaixin001.com.cn/i/r_sj.gif" width="15" height="20" /></a></div>'
+'				<div class="c"></div>'
+'				<div id="hn1_l" class="hn_l">'
+'					<div><a href="/home/?uid='+vuid+'" class="hnm">我的首页</a></div>'
+'					<div class="l1_h">&nbsp;</div>'
+'					<div class="c9 m0_15">我的首页预览：</div>'
+'					<div>'
+'						<a href="/home/?_preview=friend" class="hnm" target=_blank onclick="javascript:hy();">'
+'						<div class="l" style="margin:5px 3px;"><img src="http://img1.kaixin001.com.cn/i/small-tri.gif" width="3" height="5" /></div>'
+'						<div class="l"  style="cursor:pointer;">好友访问时</div>'
+'						<div class="c"></div>'
+'						</a>'
+'					</div>'
+'					<div class="mb10">'
+'						<a href="/home/?_preview=other" class="hnm" target=_blank onclick="javascript:hy();" >'
+'						<div class="l"  style="margin:5px 3px;"><img src="http://img1.kaixin001.com.cn/i/small-tri.gif" width="3" height="5" /></div>'
+'						<div class="l"  style="cursor:pointer;">陌生人访问时</div>'
+'						<div class="c"></div>'
+'						</a>'
+'					</div>'
+'				</div>'
+'			</div>'
+'			<div id="hn_xx1" class="hn_xx"><img src="http://img1.kaixin001.com.cn/i/r_xx13.gif" width="1" height="13" /></div>'
+'			'
+'			<div id="hn2" class="hn_of">'
+'				<div class="hn_tt"><a href="/friend/?t=' + Math.ceil(Math.random() * 100) + '" class="n">好友</a></div>'
+'				<div class="hn_sj"><a href="javascript:xs(2);" class="sj"><img src="http://img1.kaixin001.com.cn/i/r_sj.gif" width="15" height="20" /></a></div>'
+'				<div class="c"></div>'
+'				<!--'
+'				<iframe style="position:absolute;z-index:1;width:expression(this.nextSibling.offsetWidth);height:expression(this.nextSibling.offsetHeight);top:expression(this.nextSibling.offsetTop);left:expression(this.nextSibling.offsetLeft);" frameborder="0" ></iframe>'
+'				-->'
+'				<div id="hn2_l" class="hn_l" style="z-index:2">'
+'					<div><a href="/friend/" class="hnm">我的全部好友</a></div>'
+'					<div><a href="/friend/group.php" class="hnm">好友管理</a></div>'
+'					<div class="l1_h">&nbsp;</div>'
+'					<div><a href="/friend/invite.php" class="hnm">邀请朋友加入</a></div>'
+'					<div><a href="/friend/search.php" class="hnm">查找朋友</a></div>'
+'					<div class="l1_h">&nbsp;</div>'
+'					<div><a href="/friend/index.php?startype=2" class="hnm">我加的机构</a></div>'
+'					<div><a href="/friend/index.php?startype=1" class="hnm">我加的名人</a></div>'
+'					<div><a href="/friend/stars.php?type=1" class="hnm">全部机构名人</a></div>'
+'				</div>'
+'			</div>'
+'			<div id="hn_xx2" class="hn_xx"><img src="http://img1.kaixin001.com.cn/i/r_xx13.gif" width="1" height="13" /></div>'
+'		'
+'			<div id="hn3" class="hn_of">'
+'				<div class="hn_tt"><a href="/group/?t=' + Math.ceil(Math.random() * 100) + '" class="n">群</a></div>'
+'				<div class="hn_sj"><a href="javascript:xs(3);" class="sj"><img src="http://img1.kaixin001.com.cn/i/r_sj.gif" width="15" height="20" /></a></div>'
+'				<div class="c"></div>'
+'				<div id="hn3_l" class="hn_l">'
+'					<div><a href="/group/" class="hnm">我的群</a></div>'
+'					<div><a href="/group/flist.php" class="hnm">好友的群</a></div>'
+'					<div class="l1_h">&nbsp;</div>'
+'					<div><a href="/group/new.php" class="hnm">创建新群</a></div>'
+'					<div><a href="/group/search.php" class="hnm">全部群</a></div>'
+'				</div>'
+'			</div>'
+'			<div id="hn_xx3" class="hn_xx"><img src="http://img1.kaixin001.com.cn/i/r_xx13.gif" width="1" height="13" /></div>'
+'		'
+'			<div id="hn4" class="hn_of" style="padding-right:28px;">'
+'				<div class="hn_tt"><a href="/msg/?t=' + Math.ceil(Math.random() * 100) + '" class="n">消息</a></div>'
+'				<div class="hn_sj"><a href="javascript:xs(4);" class="sj"><img src="http://img1.kaixin001.com.cn/i/r_sj.gif" width="15" height="20" /></a><span  style="position:absolute;top:5px; left:65px;display:none;" id=head_msgdiv><a href="/msg/" class="n" style="margin-top:-5px;"><img src="http://img1.kaixin001.com.cn/i/ddtx.gif" onmouseover="javascript:xs(4);" border=0></a></span></div>'
+'				<div class="c"></div>'
+'				<div id="hn4_l" class="hn_l">'
+'					<div><a href="/msg/inbox.php?t=' + Math.ceil(Math.random() * 100) + '" class="hnm">短消息<span style="padding-left:2px;color:red;" id=head_msg_num></span></a></div>'
+'					<div><a href="/msg/sys.php?t=' + Math.ceil(Math.random() * 100) + '" class="hnm"">系统消息<span style="padding-left:2px;color:red;" id=head_sysmsg_num></span></a></div>'
+'					<div class="l1_h">&nbsp;</div>'
+'					<div><a href="/comment/?t=' + Math.ceil(Math.random() * 100) + '" class="hnm">评论<span style="padding-left:2px;color:red;" id=head_comment_num></span></a></div>'
+'					<div><a href="/comment/send.php?t=' + Math.ceil(Math.random() * 100) + '" class="hnm">评论回复<span style="padding-left:2px;color:red;" id=head_reply_num></span></a></div>'
+'					<div><a href="/comment/uindex.php?t=' + Math.ceil(Math.random() * 100) + '" class="hnm">留言板<span style="padding-left:2px;color:red;" id=head_bbs_num></span></a></div>'
+'					<div><a href="/comment/usend.php?t=' + Math.ceil(Math.random() * 100) + '" class="hnm">留言回复<span style="padding-left:2px;color:red;" id=head_bbsreply_num></span></a></div>'
+'				</div>'
+'			</div>'
+'			<div id="hn_xx4" class="hn_xx"></div>'
+'			'
+'			<div class="c"></div>'
+'		</div>'
+'		<div class="h3" style="position:relative; z-index:9999; float:left; margin-left:245px; *margin-top:2px;">'
+'			<div class="rt_nav">'
+'				<div class="rt_menu"><a href="/friend/invite.php" class="ce">邀请</a></div>'
+'				<div class="l">┊</div>'
+'				<div class="rt_menu"><a href="/friend/search.php" class="ce">找人</a></div>'
+'				<div class="l">┊</div>'
+'				<div class="rt_menu" onmouseover="this.className=\'rt_menu2\';s(\'set_sub\');"  onmouseout="this.className=\'rt_menu\';h(\'set_sub\');"><a href="/set/account.php" class="ce2">设置</a>'
+'					<div class="set_sub" id="set_sub" style="display:none; height:96px;" >'
+'						<p onmouseover="this.className=\'hover\'; $(\'ac_set\').src=\'http://img1.kaixin001.com.cn/i/account_set2.gif\';"  onmouseout="this.className=\'\'; $(\'ac_set\').src=\'http://img1.kaixin001.com.cn/i/account_set.gif\';">'
+'							<a href="/set/account.php"><img src="http://img1.kaixin001.com.cn/i/account_set.gif" alt="账户设置" id="ac_set" align="absmiddle" /> 账户设置</a>'
+'						</p>'
+'						<p onmouseover="this.className=\'hover\';"  onmouseout="this.className=\'\';">'
+'							<a href="/set/privacy.php"><img src="http://img1.kaixin001.com.cn/i/pri_set.gif" alt="隐私设置" align="absmiddle" /> 隐私设置</a>'
+'						</p>'
+'						<p onmouseover="this.className=\'hover\';"  onmouseout="this.className=\'\';">'
+'							<a href="/set/appman.php"><img src="http://img1.kaixin001.com.cn/i/app_set.gif" alt="组件设置" align="absmiddle" /> 组件设置</a>'
+'						</p>'
+'						<p onmouseover="this.className=\'hover\'; $(\'pay_set\').src=\'http://img1.kaixin001.com.cn/i/home/pay2.gif\';"  onmouseout="this.className=\'\'; $(\'pay_set\').src=\'http://img1.kaixin001.com.cn/i/home/pay.gif\';">'
+'							<a href="/pay/index.php"><img src="http://img1.kaixin001.com.cn/i/home/pay.gif" alt="支付中心" id="pay_set" align="absmiddle" /> 支付中心</a>'
+'						</p>'
+'					</div>'
+'				</div>'
+'				<div class="l">┊</div>'
+'				<div class="rt_menu"><a href="/login/logout.php" class="ce">退出</a></div>'
+'				<div class="c"></div>'
+'			</div>'
+'		</div>'
+'		<div class="l" style="padding:3px 0 0 3px; *padding:2px 0 0 3px;"><div style="position:absolute;"><input id="headsearchuser" style="width:72px; height:17px; *height:18px; font-size:12px; border:none; background:#fff url(http://img1.kaixin001.com.cn/i/ns_bg.gif); padding:4px 0 0 19px; *padding:3px 0 0 19px; color:#999;" value="查找好友..." onkeydown="var ret = f2_inputOnkeydown(event ,this);event.cancelBubble = true;return ret;" onkeyup="f2_inputOnkeyup(event,this);event.cancelBubble = true;" onblur="f2_inputOnblur();" onfocus="if (this.value==\'查找好友...\') this.value = \'\';this.className=\'c0\'; f2_inputOnfocus(event,this);" type="text" autocomplete="off"/></div></div>'
+'		<div class="c"></div>'
+'	</div>'
+'</div>'
+'<div id="head_msgsound_div" style="left:0;top:0;position:absolute;"></div>'
+'<div id="main">'
+'	<div class="m1 wl1">'
+'    	<div class="m1t"></div>'
+'    	<div id="app_friend_tip" style="z-index:20000;position:absolute;background:#fff;border:2px solid #F7F7F7;width:160px;height:250px;display:none;">'
+'		</div>';

	document.writeln(v_html);
	new friendSuggest2("headsearchuser" , "请输入好友的姓名，直接进入对方的首页 (支持拼音首字母快捷输入)" , "");
}

function _outputApp(v_icon, v_link, v_title, v_aid, v_index_num)
{
	if (-1 == v_link.indexOf("?"))
	{
		v_link += "?t=" + Math.ceil(Math.random() * 100);
	}
	else
	{
		v_link += "&t=" + Math.ceil(Math.random() * 100);
	}
	v_html = 
'<div style="margin:12px 15px 12px 15px;" onmouseover="javascript:if(\'' + v_index_num + '\'==\'1\'){$(\'app_friend_' + v_aid + '\').style.display=\'block\';}" onmouseout="javascript:$(\'app_friend_' + v_aid + '\').style.display=\'none\';">'
+'	<div class="l"><img src="' + v_icon + '" width="28" height="24" align="absmiddle" /> <b><a href="' + v_link + '" class="sl f14" title="' + v_title + '" >' + v_title + '</a></b></div>'
+'	<div class="l" id="app_friend_' + v_aid + '" style="display:none;padding:8px 3px;cursor:pointer;" onclick="javascript:a_appfriend_show(' + v_aid + ' , \'' + v_link + '\' , \'' + v_title + '\');"><img src="http://img1.kaixin001.com.cn/i2/xiasanjiao.gif" width="7" height="4" alt="快速查看你所有好友的' + v_title + '内容" align="absmiddle" /></div>'
+'	<div class="c"></div>'
+'</div>';

	return v_html;
}

function outputApp(v_icon, v_link, v_title, v_aid, v_index_num)
{
	document.writeln(_outputApp(v_icon, v_link, v_title, v_aid, v_index_num));
}

function _setApplistHiddenHead()
{
	if (g_app_num==-1) return '';
	g_appnum++;
	if (g_appnum>g_app_num && !g_bappmore)
	{
		g_bappmore = true;
		return '<span id=applistmore style="display:none">';
	}
	return '';
}

function setApplistHiddenHead()
{
	document.writeln(_setApplistHiddenHead());
}

function _setApplistHiddenTail()
{
	if (g_app_num==-1) return '';
	if (g_bappmore)
	{
		return '</span><div id=applistscroll class="tar" style="margin-top:-10px;"><img src="http://img1.kaixin001.com.cn/i2/xiala.gif" width="5" align="absmiddle"> <a href="javascript:showAppmore();" class="sl-gray"  style="text-decoration:none;" title="列出我的全部组件">展开</a>&nbsp;&nbsp;</div>';
	}
	return '';
}

function setApplistHiddenTail()
{
	document.writeln(_setApplistHiddenTail());
}

function outputHead2()
{
	document.write('<div class="tac mb5"><img src="http://img1.kaixin001.com.cn/i/index_app.gif" width="120" height="2" /></div> <div style="position:relative;"> <div class="install_tips" id="install_tips" style="position:absolute; left:110px; top:-7px; z-index:99; display:none;"> <div class="tar" style="padding:7px 15px 0 0;"><img src="http://img1.kaixin001.com.cn/i2/black_del.gif" title="关闭" style="cursor:pointer;" onclick="h(\'install_tips\')" /></div> <p style="padding:0px 20px;">点击这里，添加各种实用或游戏组件</p></div> <div class="p5 m0_10 tac"><img src="http://img1.kaixin001.com.cn/i/index_app_add1.gif" width="9" height="9" title="添加组件" /> <a href="/app/list.php" class="sl2">添加组件</a></div> </div> <div class="p5 m0_10 tac" style="margin-top:-8px;"><img src="http://img1.kaixin001.com.cn/i/index_app_set1.gif" width="9" height="9" title="组件设置" /> <a href="/set/appman.php" class="sl2">组件设置</a></div></div>');
}

function showAppmore()
{
	if ($("applistmore").style.display=="none") 
	{
		$("applistmore").style.display="block";
		$("applistscroll").innerHTML = '<img src="http://img1.kaixin001.com.cn/i2/shouqi.gif" width="5" align="absmiddle"> <a href="javascript:showAppmore();" class="sl-gray"  style="text-decoration:none;">收起</a>&nbsp;&nbsp;';
	}
	else
	{
		$("applistmore").style.display="none";
		$("applistscroll").innerHTML = '<img src="http://img1.kaixin001.com.cn/i2/xiala.gif" width="5" align="absmiddle"> <a href="javascript:showAppmore();" class="sl-gray"  style="text-decoration:none;">展开</a>&nbsp;&nbsp;';
	}
}

function f2_gotouser(f2_seluid)
{
	if (parseInt(f2_seluid))
	{
		window.location = "/home/?uid=" + f2_seluid;
	}
}

function outputAppInfo()
{
	if (g_allapp_num > g_prevapp_num)
	{
		var url = "/app/left.php";
		var pars = "";
		var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { outputAppInfoAjaxShow(req); } });
	}
}

function outputAppInfoAjaxShow(req)
{
	eval("data="+req.responseText);

	var v_html = '';
	for (var i=0; i<data.length; i++)
	{
		v_html += _setApplistHiddenHead();
		v_html += _outputApp(data[i]["icon"], data[i]["link"], data[i]["title"], data[i]["aid"], data[i]["index_num"]);
	}
	v_html += _setApplistHiddenTail();
	$("head_applist").innerHTML =v_html;
}

function outputTail()
{
	document.writeln('<div class="c"></div>'
+'</div>'
+'<div id="b">'
+'	<div class="b1"><a href="/s/about.html" class="c6" target="_blank">关于我们</a><span>┊</span><a href="/s/job.html" class="c6" target="_blank">诚聘英才</a><span>┊</span><a href="/s/contact.html" class="c6" target="_blank">联系方式</a><span>┊</span><a href="/t/feedback.html" class="c6" target="_blank">意见反馈</a><span>┊</span><a href="/s/help.html" class="c6" target="_blank">帮助中心</a>　 &copy; 2007 - 2009 kaixin001.com &nbsp;<a class=c6 href=http://www.miibeian.gov.cn target=_blank>京ICP证080482号</a> </div>'
+'</div>');
}

function g_poolchatmsg()
{
	pchat.poolchatmsg();
}
