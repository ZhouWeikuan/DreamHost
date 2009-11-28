
var g_commentvuid = "0";
var g_commentouid = "0";
var g_commenttype = "0";
var g_commentid = "0";
var g_recentcomment = "";
var g_commenttypetext = "评论";
var g_commenttitle = "";
var g_is_privacy_pwd = "0";
var g_delrefresh = "0";
var g_threaddata = null;
var g_comment_show_type = "single";

var g_homedir = "home";

var e_bold = false;
var e_italic = false;
var e_underline = false;
var e_font = false;
var e_fontsize = false;
var e_color = false;
var e_img = false;
var e_link = false;
var e_media = false;

var g_viewmode = "";

function gotoCommentEditor(obj)
{
	if (typeof(obj) == "undefined")
	{
		return;
	}
	if (typeof(obj.editorArea) == "undefined")
	{
		return;
	}
	var pos = getpos(obj.editorArea);
	window.scroll(0, pos.top);
	if (typeof(obj.getFocus) == "function")
	{
		obj.getFocus();
	}
}

function initComment(vuid, ouid, type, id)
{
	g_commentvuid = vuid;
	g_commentouid = ouid;
	g_commenttype = type;
	g_commentid = id;
	
	if (g_commenttype == "0")
	{
		g_commenttypetext = "留言";
	}
}

function getCommentList(v_start)
{
	var url = "/comment/list.php";
	var pars = "type="+g_commenttype+"&id="+g_commentid+"&uid="+g_commentouid+"&mode="+g_viewmode;
	if (typeof(v_start) != "undefined")
	{
		pars += "&start="+encodeURIComponent(v_start);
	}
	var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { getCommentListShow(req); } });
}


function _getCommentReplyHtml(ouid, rdata, vuid, owneruid, v_tag, silent)
{
	var html = '';
	if (vuid == owneruid
		|| vuid == rdata.uid
		|| (vuid == ouid && rdata.uid != owneruid))
	{
		html += '<div id="replyitem_'+rdata.cid+'"  class="pt3"><div id=replytitle_'+rdata.cid+'  class="hy_of"  onmouseover="this.className=\'hy_on\';s(\'hy2_2_'+rdata.cid+'\');" onmouseout="this.className=\'hy_of\';h(\'hy2_2_'+rdata.cid+'\');">';
	}
	else
	{
		html += '<div id="replyitem_'+rdata.cid+'"  class="pt3"><div id=replytitle_'+rdata.cid+'>';
	}
	html +='<div class="l cuspic">';
	html +='	<a href="/'+g_homedir+'/?uid='+rdata.uid+'" class="funclink sl" title="'+rdata.real_name+'">';
	html +='		<img height="20" width="20" src="'+rdata.icon20+'"/>';
	html +='	</a>';
	html +='</div>';
	var replytip = "的回复";
	if(rdata.noticeuid!=0)
	{
		if(rdata.noticeuid == -1)
		{
			replytip = "回复所有人";
		}
		else
		{
			if(vuid == rdata.noticeuid)
			{
				replytip = "同时回复我";
			}
			else
			{
				replytip = "同时回复"+rdata.noticereal_name;
			}
		}
	}
	if (vuid == rdata.uid)
	{
		html += '<div class="czhy_tx2" style="width:170px;">我'+replytip+'：</div>';
	}
	else
	{
		html += '<div class="czhy_tx2" style="width:170px;"><a href="/'+g_homedir+'/?uid='+rdata.uid+'" class="funclink sl" title="'+rdata.real_name+'">'+rdata.real_name+'</a>'+replytip+'：</div>';
		
	}
	if(parseInt(silent))
	{
		html += '<div class="gw13" style="float:left;"><img src="http://img1.kaixin001.com.cn/i2/lock.gif"/>'+rdata.ctime+'</div>';
	}
	else
	{
		 
		html += '<div class="gw13" style="float:left;">'+rdata.ctime+'</div>';
	}
	if (ouid == vuid)
	{
		html += '<div class="r dn" id="hy2_2_'+rdata.cid+'"><a href="javascript:' + v_tag + 'delComment(\''+rdata.cid+'\', \''+owneruid+'\', \''+owneruid+'\', \''+rdata.ctimestamp+'\')" class="ql2"><img style="margin-top:3px;" src="http://img1.kaixin001.com.cn/i/close.gif" /></a></div>';
	}
	else
	{
		html += '<div class="r dn" id="hy2_2_'+rdata.cid+'"><a href="javascript:' + v_tag + 'delComment(\''+rdata.cid+'\', \''+ouid+'\', \''+owneruid+'\', \''+rdata.ctimestamp+'\')" class="ql2"><img style="margin-top:3px;" src="http://img1.kaixin001.com.cn/i/close.gif" /></a></div>';
	}
	html += '<div class="c"></div>';
	html += '</div>';
	rdata.content = rdata.content.replace(/<img/g , "<img onload='_commentImageResize(this,250);'");
	if (vuid == rdata.uid)
	{
		html += '<div class="hy_wd ml5" id=replycomment_'+rdata.cid+'>'+rdata.content+'</div>';
	}
	else
	{
		html += '<div  class="hy_br ml5" id=replycomment_'+rdata.cid+'>'+rdata.content+'</div>';
	}
	html +="</div>";
	return html;
}

function getCommentReplyHtml(ouid, rdata, silent)
{
	return _getCommentReplyHtml(ouid, rdata, g_commentvuid, g_commentouid, "", silent);
}

function commentFilter(v_str)
{
	
	v_tag = v_str.toLowerCase();
	if (v_str.substr(0, 4) == "<img")
	{
		return v_str;
	}
	if (v_str.substr(0, 3) == "<br")
	{
		return v_str;
	}
	if (v_str.substr(0, 2) == "<p")
	{
		return v_str;
	}
	if (v_str.substr(0, 3) == "</p")
	{
		return v_str;
	}
	if (v_str.substr(0, 2) == "<a")
	{
		return v_str;
	}
	if (v_str.substr(0, 3) == "</a")
	{
		return v_str;
	}
	
	return " ";
}

function getCommentThreadHtml(tid, tdata, canreply)
{
	if (typeof(canreply) == "undefined")
	{
		var canreply = 1;
	}
	var html = '<div class="gw1" id=threaddiv_'+tid;
	if((g_commenttype == "0")
		&& (g_commentvuid == g_commentouid))
	{
		if(tdata[0].friend=="0")
		{
			html += ' onmouseover="javascript:showfrdiv('+tid+');" onmouseout="javascript:hidefrdiv('+tid+');" >';
		}
		else
		{
			html += '>';
		}
	}
	else
	{
		html += '>';
	}
	html += '<div class="q_cygl2" ';
	if(g_comment_show_type == "multiple")
	{
		html += 'style="height:50px;"';
	}
	html +=' ><div class="l50_s"><a href="/'+g_homedir+'/?uid='+tdata[0].uid+'" title="'+tdata[0].real_name+'"><img src="'+tdata[0].icon+'" width="50" height="50" /></a></div>';
	if(g_comment_show_type == "multiple")
	{
		html += '</div><div class="gw12" style="width:269px;">';
	}
	else
	{
		html += '</div><div class="gw12" style="width:320px;">';
	}
	
	var silent = false;
	if (tdata[0].hidden && parseInt(tdata[0].hidden))
	{
		html += '<p><b><a title="此对话仅你们双方可见"><font color=red>【悄悄话】</a></a></font></b></p>';
		silent = true;
	}
	if (g_commentvuid == tdata[0].uid)
	{
		html += '<p class="gw_p1">我说道：</p>';
	}
	else
	{
		if (parseInt(tdata[0].online))
		{
			html += '<p class="gw_p1"><img src="http://img1.kaixin001.com.cn/i/u_zx1.gif" width="18" height="15" align="absmiddle" title="在线" /><a class="funclink sl" href="/'+g_homedir+'/?uid='+tdata[0].uid+'" title="'+tdata[0].real_name+'">'+tdata[0].real_name+'</a>说道：</p>';
		}
		else
		{
			html += '<p class="gw_p1"><a class="funclink sl" href="/'+g_homedir+'/?uid='+tdata[0].uid+'" title="'+tdata[0].real_name+'">'+tdata[0].real_name+'</a>说道：</p>';
		}
	}
	var str = tdata[0].content;
	str = str.replace(/<\/?[^>]+>/gi, commentFilter);
	str = str.replace(/<img[^>]+(src=\"[^\"]+\"|src=\'[^\']+\')[^>]+>/gi, '<img $1>');
	
	html += '<div class="text" style="font-size:12px;color:#000;text-indent:0em;">'+str.replace(/<img/g , "<img onload='_commentImageResize(this,320);'")+'</div>';	
	if(g_comment_show_type == "multiple")
	{
		html +='</div>';
		if(silent)
		{
			html += '<div class="gw13"><img src="http://img1.kaixin001.com.cn/i2/lock.gif"/>'+tdata[0].ctime+'</div>';
		}
		else
		{
			html += '<div class="gw13">'+tdata[0].ctime+'</div>';
		}
		html +='<div class="c"></div>';	
		if(silent)
		{
			html +='<div style="padding-left:90px;margin-top: -10px;">';
		}
		else
		{
			html +='<div style="padding-left:90px;margin-top: -5px;">';
		}
	}	
	if (tdata.length > 1)
	{
		html += '<div id=commentdiv_'+tid+' class="hy_n">';
		for (i=1; i<tdata.length; i++)
		{
			html += getCommentReplyHtml(tdata[0].uid, tdata[i], tdata[0].hidden);
		}
		html += '</div>';
	}
	else
	{
		html += '<div id=commentdiv_'+tid+' class="hy_n" style="display:none;">';
		html += '</div>';
	}
	html += '<p class="gw_p2">';
	var replyaction = "";
	var msgaction = "";
	var delaction = "";
	if (g_commentvuid == tdata[0].uid)
	{
		replyaction = '<a class="otherlink sl-gray" href="javascript:replyComment(\''+tid+'\', \''+g_commentouid+'\','+silent+', '+tdata[0].ctimestamp+', '+canreply+')">回复</a>';
		msgaction = '<a class="otherlink sl-gray" href=/msg/write.php?uids='+g_commentouid+'>短消息</a>';
		delaction = '<a class="otherlink sl-gray" href="javascript:delCommentThread(\''+tid+'\', \''+g_commentouid+'\',\''+tdata[0].ctimestamp+'\' );">删除</a>';
	}
	else if (g_commentvuid == g_commentouid)
	{
		replyaction = '<a class="otherlink sl-gray" href="javascript:replyComment(\''+tid+'\', \''+tdata[0].uid+'\','+silent+', '+tdata[0].ctimestamp+', '+canreply+')">回复</a>';
		msgaction = '<a class="otherlink sl-gray" href=/msg/write.php?uids='+tdata[0].uid+'>短消息</a>';
		delaction = '<a class="otherlink sl-gray" href="javascript:delCommentThread(\''+tid+'\', \''+tdata[0].uid+'\',\''+tdata[0].ctimestamp+'\' );">删除</a>';
	}
	else if (g_commentouid == tdata[0].uid)
	{
		replyaction = '<a class="otherlink sl-gray" href="javascript:replyComment(\''+tid+'\', \'0\','+silent+', '+tdata[0].ctimestamp+', '+canreply+')">回复</a>';
		msgaction = "";
		delaction = "";
	}
	else
	{
		replyaction = '<a class="otherlink sl-gray" href="javascript:replyComment(\''+tid+'\', \''+tdata[0].uid+'\','+silent+', '+tdata[0].ctimestamp+', '+canreply+')">回复</a>';
		msgaction = "";
		delaction = "";
	}
	var actionlist = new Array();
	if (replyaction.length > 0)
	{
		actionlist.push(replyaction);
	}
	if (msgaction.length > 0)
	{
		actionlist.push(msgaction);
	}
	if (delaction.length > 0)
	{
		actionlist.push(delaction);
	}
	html += actionlist.join("&nbsp;┊&nbsp;");
	html += '</p><p><div id=replydiv_'+tid+' style="padding-top:3px;"></div></p></div>';
	if((g_commenttype == "0")
		&& (g_commentvuid == g_commentouid))
	{
		if(tdata[0].friend=="0")
		{
			html += '<div class="l" title="举报陌生人骚扰留言" style="margin-left:-24px;margin-top:3px;"><img id="frimg_'+tid+'" onclick="javascript:reportFR('+tid+', '+tdata[0].uid+');" style="cursor: pointer;" width="14" height="14" alt="举报陌生人骚扰留言" align="absmiddle" src="http://img1.kaixin001.com.cn/i2/tanhao.gif"/></div>';
		}
	}
	if(g_comment_show_type == "single")
	{
		if(silent)
		{
			html += '<div class="gw13"><img src="http://img1.kaixin001.com.cn/i2/lock.gif"/>'+tdata[0].ctime+'</div>';
		}
		else
		{
			html += '<div class="gw13">'+tdata[0].ctime+'</div>';
		}
	}
	html += '<div class="c"></div>';
	html += '</div>';
	
	return html;
}

function getCommentListShow(req)
{
	var r = req.responseText;
	if(r == "0")
	{
		return;
	}
	else
	{
		eval("r="+r);
	}
	
	if (r.total >= 100)
	{
		if ($("limitCommentPrompt"))
		{
			s($("limitCommentPrompt"));
		}
	}
	
	var html = "";
	var tids = r.tids.split(" ");
	for (var i=0; i<tids.length; i++)
	{
		try
		{
			var tid = tids[i];
			if(tid == "")
			{
				continue;
			}
			html += getCommentThreadHtml(tid, r.data[tid], r.threaddata[tid]["canreply"]);
		}
		catch(e)
		{
		}
	}
	g_threaddata = r.threaddata;
	if ($("commenttotal"))
	{
		$("commenttotal").innerHTML = r.total;
	}
	if (r.pagenav["show"])
	{
		var pagenav = '<div id="comment_pagenav" class="tar p10">';
		if (r.pagenav["prev"] >= 0)
		{
			pagenav += '<a href="javascript:void(0);" onclick="javascript:clearCommentList(\'comment\');getCommentList('+r.pagenav["prev"]+');return false;"  class="sl"><<上一页</a>';
		}
		else
		{
			//pagenav += '<span class="sl">上一页</span>';
		}
		if (r.pagenav["next"] >= 0)
		{
			if (r.pagenav["prev"] >= 0)
			{
				pagenav += '&nbsp;&nbsp;&nbsp;';
			}
			pagenav += '<a href="javascript:void(0);" onclick="javascript:clearCommentList(\'comment\');getCommentList('+r.pagenav["next"]+');return false;"  class="sl">下一页>></a>';
		}
		else
		{
			//pagenav += '<span  class="sl">下一页</span>';
		}
		pagenav += '</div>';
		html += pagenav;
		new Insertion.Top("comment", html);
	}
	else
	{
		$("comment").innerHTML = html + $("comment").innerHTML;
	}
}

function clearCommentList(v_id)
{
	var el = $(v_id);
	if (! el)
	{
		return;
	}
	if ($("comment_pagenav"))
	{
		Element.remove("comment_pagenav");
	}
	var elements = $A(el.childNodes);
	for (var i=0; i<elements.length; i++)
	{
		if (typeof(elements[i].className) == "string" && elements[i].className == "gw1")
		{
			Element.remove(elements[i]);
		}
	}
}

function _delCommentThread(v_tid, v_ouid, v_type, v_tag, v_ctime)
{
	if (confirm("你确认要删除这条" + v_type + "和它的所有回复吗？"))
	{
		var url = "/comment/del.php";
		var pars = "thread_cid="+v_tid+"&ouid="+v_ouid+"&ctime="+v_ctime;
		var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { eval(v_tag + "delCommentThreadShow(req)"); } });
	}
}

function delCommentThread(v_tid, v_ouid, v_ctime)
{
	return _delCommentThread(v_tid, v_ouid, g_commenttypetext, "", v_ctime);
}

function delCommentThreadShow(req)
{
	var r = req.responseText;
	if(r == "0")
	{
		return;
	}
	
	h('threaddiv_'+r);
}

function _delComment(v_cid, v_ouid, v_owner, v_tag, v_ctime)
{
	if (confirm("你确认要删除这条回复吗？"))
	{
		var url = "/comment/del.php";
		var pars = "cid="+v_cid+"&ouid="+v_ouid+"&owner="+v_owner+"&ctime="+v_ctime;
		var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { eval(v_tag + "delCommentShow(req)"); } });
	}
}

function delComment(v_cid, v_ouid, v_owner, v_ctime)
{
	return _delComment(v_cid, v_ouid, v_owner, "", v_ctime);
}

function delCommentShow(req)
{
	var r = req.responseText;
	if(r == "0")
	{
		return;
	}
	
	h('replycomment_'+r);
	h('replytitle_'+r);
}
function _checkNoticeuids(v_tid, v_uid, v_real_name)
{
	if($("chs_tip_"+v_tid))
	{
		$("noticeuid_"+v_tid).value = v_uid;		
		$("chs_tip_"+v_tid).innerHTML='同时回复给'+v_real_name;
		h("chs_rep_"+v_tid);
	}
}
function _checkNewsNoticeuids(v_tid, v_uid, v_real_name)
{
	if($("chs_tip_news_"+v_tid))
	{
		$("noticeuid_news_"+v_tid).value = v_uid;		
		$("chs_tip_news_"+v_tid).innerHTML='同时回复给'+v_real_name;
		h("chs_rep_news_"+v_tid);
	}
}
function switchdisplay(id)
{
	if($(id).style.display == "none")
	{
		s(id);
	}
	else
	{
		h(id);
	}
}
function _replyComment(v_tid, v_ouid, v_tag, v_silent, v_ctime)
{
	var v_noticeuids = null;
	if(g_threaddata&& g_threaddata[v_tid])
	{
		v_noticeuids = g_threaddata[v_tid].noticeuids;
	}
	var html = '<div class="mb5 mt5">'
	html += '<div class="l" style="width:300px;">';
//	html += '<span class="it_s"><textarea id="commentcontent__THREAD_CID_" cols="40" rows="2" class="it1" onfocus="this.className=\'it2\';" onblur="this.className=\'it1\';"></textarea></span>';
	html += '<div id="commentcontent__THREAD_CID_" name="commentcontent__THREAD_CID_"></div>';
	html += '</div>';
	html += '<div class="c"></div>';
	html += '</div>';
	if(v_noticeuids && v_noticeuids.length >0)
	{
		html += '<div>';
	}
	else
	{
		html += '<div>';
	}
	
	if(v_silent)
	{
		html += '<div class="l" style="width:168px;" title="此对话仅你们双方可见"><input type="checkbox" checked disabled id="hidden__THREAD_CID_" name="hidden__THREAD_CID_" value="1"  title="此对话仅你们双方可见"><font color="#999999">&nbsp;悄悄话</font></div>';
	}
	else
	{
		if(v_noticeuids && v_noticeuids.length >0)
		{
			/*if(v_noticeuids.length == 1)
			{
				html += '<div class="l" style="width:168px;"><input type="checkbox" checked  title="同时回复给'+v_noticeuids[0].real_name+'" id="chknotice__THREAD_CID_"  style="*margin-left:-4px;"  name="chknotice__THREAD_CID_" value="1">同时回复给'+v_noticeuids[0].real_name+'<input type="hidden" id="noticeuid__THREAD_CID_"  name="noticeuid__THREAD_CID_" value="'+v_noticeuids[0].uid+'" /></div>';
			
			}
			else*/
			if(v_noticeuids.length > 0)
			{
				html += '<div class="l" style="width:168px;"><input type="checkbox"  checked  id="chknotice__THREAD_CID_"  name="chknotice__THREAD_CID_"  style="*margin-left:-4px;" value="1"/> ';
				html += '<span id="chs_tip__THREAD_CID_"></span>';
				html +='<input type="hidden" id="noticeuid__THREAD_CID_"  name="noticeuid__THREAD_CID_" />';
				html += '<span class="chs_reply" onclick="switchdisplay(\'chs_rep__THREAD_CID_\');">';
				html +='<img src="http://img1.kaixin001.com.cn/i2/a_down.gif" title="选择回复对象">';
				html +='<div class="chsr_area" id="chs_rep__THREAD_CID_" style="display:none">';
				html +='<div class="chs_bg">选择<img src="http://img1.kaixin001.com.cn/i2/a_down.gif" /></div>';
				html +='<div class="reply_list">';
				var uid = 0;
				var real_name = "";
				var uids = "";
				var allhtml = "";
				var sephtml = "";
				for(var i=0; i<v_noticeuids.length; i++)
				{
					uid = v_noticeuids[i].uid;
					if(i!=v_noticeuids.length-1)
					{
						uids+=uid+":";
					}
					else
					{
						uids+=uid;
					}
					real_name = v_noticeuids[i].real_name;				
					sephtml +='<a href="javascript:_checkNoticeuids('+v_tid+','+uid+',\''+real_name+'\')">'+real_name+'</a>';
				}
				if(v_noticeuids.length > 1)
				{
					allhtml ='<a href="javascript:_checkNoticeuids('+v_tid+',\''+uids+'\',\'所有人\')">所有人</a>';
				}
				html += allhtml + sephtml;
				html +='		</div>'
				html +='	</div>'
				html +='</span>'
				html +='</div>';
			}
		}
		else
		{
			html += '<div class="l" style="width:168px;">&nbsp;</div>';
		}
	}
	html += '<div class="l" style="padding-left:10px;"><div class="rbs1"><input type="button" id="commentbtn__THREAD_CID_" value="回复" title="快捷方式 Ctrl+Enter" class="rb1-12" onmouseover="this.className=\'rb2-12\';" onmouseout="this.className=\'rb1-12\';" onclick="' + v_tag + 'replyCommentSubmit(_THREAD_CID_,_OTHER_UID_, _CTIME_)" style="width:42px;"  /></div>';
	html += '<div class="flw5" >&nbsp;</div>';
	html += '<div class="gbs1"><input type="button" id="btn_fb" value="取消" title="取消" class="gb1-12" onmouseover="this.className=\'gb2-12\';" onmouseout="this.className=\'gb1-12\';" onclick="' + v_tag + 'cancelReply(_THREAD_CID_)"  style="width:42px;" /></div>';
	html += '<div class="flw5">&nbsp;</div><div id="commentprompt__THREAD_CID_" style="display:none;" class="c6 p010">提交中...</div>';
	html += '<div class="c"></div>';
	html += '</div></div><div class="c"></div>';
	html = html.replace(/_THREAD_CID_/g , v_tid);
	html = html.replace(/_OTHER_UID_/g , v_ouid);
	html = html.replace(/_CTIME_/g , v_ctime);
	$("replydiv_"+v_tid).innerHTML = html;
	if(!v_silent)
	{
		//只有多于一个通知者时，才需要设置默认通知者
		if(v_noticeuids && v_noticeuids.length >0)
		{
				var uid = 0;
				var real_name = "";
				for(var i=0; i<v_noticeuids.length; i++)
				{
					if(v_noticeuids[i].isdefault == 1)
					{
						uid = v_noticeuids[i].uid;
						real_name = v_noticeuids[i].real_name;	
						_checkNoticeuids(v_tid, uid, real_name);
					}
				}
		}
	}
//	$("commentcontent_"+v_tid).focus();
	eval('e_onkeydown = function (evnt){evt = evnt || window.event;if (evt){var keyCode = evt.charCode || evt.keyCode;if (keyCode ==13){if (evt.ctrlKey){'+v_tag+'replyCommentSubmit('+v_tid+','+v_ouid+', '+v_ctime+'); }}}}');
	eval('comment_editor_'+v_tid+' = new webEditor("comment_editor_'+v_tid+'" , $("commentcontent_'+v_tid+'") , 268, 80, "");');
	eval('comment_editor_'+v_tid+'.init("");');
	setTimeout(v_tag + "setReplyEditorFocus('"+v_tid+"')", 1000);
}

//为了简单，不考虑悄悄话
function _replyCommentNews(v_tid, v_ouid, v_tag, v_ctime)
{	
	var v_noticeuids = c4_g_threaddata[v_tid]["noticeuids"];
	var html ='<div style="padding-left:38px;">';
	html += '<div class="fb_d2">';
	html += '<div  id="commentcontent_news__THREAD_CID_" name="commentcontent_news__THREAD_CID_"></div>';
	html += '</div>';
	//html += '<div class="l" style="width: 295px;"></div>';
	
	if(v_noticeuids && v_noticeuids.length >0)
	{
		/*if(v_noticeuids.length == 1)
		{
			html += '<div class="l" style="width:295px;"><input type="checkbox" checked  title="同时回复给'+v_noticeuids[0].real_name+'" id="chknotice_news__THREAD_CID_"  style="*margin-left:-4px;"  name="chknotice_news__THREAD_CID_" value="1">同时回复给'+v_noticeuids[0].real_name+'<input type="hidden" id="noticeuid_news__THREAD_CID_"  name="noticeuid_news__THREAD_CID_" value="'+v_noticeuids[0].uid+'" /></div>';
		
		}
		else */
		if(v_noticeuids.length > 0)
		{
			html += '<div class="l" style="width:295px;"><input type="checkbox"  checked  id="chknotice_news__THREAD_CID_"  name="chknotice_news__THREAD_CID_"  style="*margin-left:-4px;" value="1"/> ';
			html += '<span id="chs_tip_news__THREAD_CID_"></span>';
			html +='<input type="hidden" id="noticeuid_news__THREAD_CID_"  name="noticeuid_news__THREAD_CID_" />';
			html += '<span class="chs_reply" onclick="switchdisplay(\'chs_rep_news__THREAD_CID_\');">';
			html +='<img src="http://img1.kaixin001.com.cn/i2/a_down.gif" title="选择回复对象">';
			html +='<div class="chsr_area" id="chs_rep_news__THREAD_CID_" style="display:none">';
			html +='<div class="chs_bg">选择<img src="http://img1.kaixin001.com.cn/i2/a_down.gif" /></div>';
			html +='<div class="reply_list">';
			var uid = 0;
			var real_name = "";
			var uids = "";
			var allhtml = "";
			var sephtml = "";
			
			for(var i=0; i<v_noticeuids.length; i++)
			{
				uid = v_noticeuids[i].uid;
				if(i!=v_noticeuids.length-1)
				{
					uids+=uid+":";
				}
				else
				{
					uids+=uid;
				}
				real_name = v_noticeuids[i].real_name;				
				sephtml +='<a href="javascript:_checkNewsNoticeuids('+v_tid+','+uid+',\''+real_name+'\')">'+real_name+'</a>';
			}
			if(v_noticeuids.length > 1)
			{
				allhtml ='<a href="javascript:_checkNewsNoticeuids('+v_tid+',\''+uids+'\',\'所有人\')">所有人</a>';
			}
			html += allhtml + sephtml;
			
			html +='		</div>'
			html +='	</div>'
			html +='</span>'
			html +='</div>';
		}
	}
	else
	{
		//html += '<div class="l" style="padding-top:3px;width:58px;">&nbsp;</div>';
		html += '<div class="l" style="width:295px;">&nbsp;</div>';
	}
	html += '<div class="rbs1">';
	html += '<input type="button" id="commentbtn_news__THREAD_CID_" value="回复" title="快捷方式 Ctrl+Enter" class="rb1-12" onmouseover="this.className=\'rb2-12\';" onmouseout="this.className=\'rb1-12\';" onclick="'+v_tag+'replyCommentSubmit(_THREAD_CID_,_OTHER_UID_, _CTIME_)" style="width:42px;" /></div>';
	html +='<div class="flw5">&nbsp;</div>';
	html +='<div class="gbs1"><input type="button" id="commentbtn_cancel_news__THREAD_CID_" value="取消" title="取消" class="gb1-12" onmouseover="this.className=\'gb2-12\';" onmouseout="this.className=\'gb1-12\';" onclick="'+v_tag+'cancelReply(_THREAD_CID_);"  style="width:42px;" /></div>';
	html += '<div class="flw5">&nbsp;</div><div id="commentprompt_news__THREAD_CID_" style="display:none;" class="c6 p010">提交中...</div>';
	html +='<div class="c" style="height:0px; line-height:0px;"></div>';
	html +='</div>';	
	html = html.replace(/_THREAD_CID_/g , v_tid);
	html = html.replace(/_OTHER_UID_/g , v_ouid);
	html = html.replace(/_CTIME_/g , v_ctime);
	$("replydiv_news_"+v_tid).innerHTML = html;
	
	//只有多于一个通知者时，才需要设置默认通知者
	if(v_noticeuids && v_noticeuids.length >0)
	{
			var uid = 0;
			var real_name = "";
			for(var i=0; i<v_noticeuids.length; i++)
			{
				if(v_noticeuids[i].isdefault == 1)
				{
					uid = v_noticeuids[i].uid;
					real_name = v_noticeuids[i].real_name;	
					_checkNewsNoticeuids(v_tid, uid, real_name);
				}
			}
	}
	
	eval('e_toolbarbg = "#F3F5F9";');
	eval('e_onkeydown = function (evnt){evt = evnt || window.event;if (evt){var keyCode = evt.charCode || evt.keyCode;	if (keyCode ==13){if (evt.ctrlKey){'+v_tag+'replyCommentSubmit('+v_tid+','+v_ouid+', '+v_ctime+'); }}}}');
	eval('comment_editor_news_'+v_tid+' = new webEditor("comment_editor_news_'+v_tid+'" , $("commentcontent_news_'+v_tid+'") , 385, 40, "");');
	eval('comment_editor_news_'+v_tid+'.init("");');
	setTimeout(v_tag+"setReplyEditorFocus('"+v_tid+"')", 1000);		
}

function replyComment(v_tid, v_ouid, silent, ctime, canreply)
{
	if (typeof(canreply) != "undefined" && ! canreply)
	{
		alert("6个月前的"+g_commenttypetext+"，不可回复");
		return;
	}
	return _replyComment(v_tid, v_ouid, "", silent, ctime);
}

function setReplyEditorFocus(v_tid)
{
	eval('comment_editor_'+v_tid+'.getFocus();');
}

function cancelReply(thread_cid)
{
	$("replydiv_"+thread_cid).innerHTML = "";
}

function _replyCommentSubmit(thread_cid, other_uid, ouid, type, id, v_tag, ctime)
{
	var noticeuid = 0;
	if($("noticeuid_"+thread_cid) 
		&& $("chknotice_"+thread_cid)
		&& $("chknotice_"+thread_cid).checked)
	{
		if($("chknotice_"+thread_cid).value)
		{
			noticeuid = $("noticeuid_"+thread_cid).value;
		}
	}
	var hidden = 0;
	if($("hidden_"+thread_cid))
	{
		if($("hidden_"+thread_cid).value)
		{
			hidden = $("hidden_"+thread_cid).value;
		}
	}
//	var content = $("commentcontent_"+thread_cid).value;
	var content = eval('comment_editor_'+thread_cid+'.getHtml();');
	if (content.length == 0)
	{
		alert("请输入回复内容。");
//		$("commentcontent_"+thread_cid).focus();
		eval('comment_editor_'+thread_cid+'.getFocus();');
		return;
	}
	
	$("commentbtn_" + thread_cid).disabled = true;
	s("commentprompt_" + thread_cid);

	var url = "/comment/reply.php";
//	var pars = "owner="+ouid+"&thread_cid="+thread_cid+"&type="+type+"&id="+id+"&ouid="+other_uid+"&texttype=plain&content="+encodeURIComponent(content);
	var pars = "owner="+ouid+"&thread_cid="+thread_cid+"&type="+type+"&id="+id+"&ctime="+ctime+"&ouid="+other_uid+"&texttype="+eval('comment_editor_'+thread_cid+'.getTextType();')+"&content="+encodeURIComponent(content)+"&noticeuid="+encodeURIComponent(noticeuid)+"&hidden="+hidden;
	var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { eval(v_tag + "addCommentReplyShow(req, '"+other_uid+"', '"+thread_cid+"')"); } });
}

function replyCommentSubmit(thread_cid, other_uid, ctime)
{
	return _replyCommentSubmit(thread_cid, other_uid, g_commentouid, g_commenttype, g_commentid, "", ctime);
}

function _addCommentReplyShow(req, v_ouid, v_tag, thread_cid)
{
	$("commentbtn_" + thread_cid).disabled = false;
	h("commentprompt_" + thread_cid);
	
	var r = req.responseText;
	if(r == "0")
	{
		alert("回复失败");
		return;
	}
	else if(r == "-1")
	{
		alert("对方关闭了评论功能");
		return;
	}
	else
	{
		eval("r="+r);
	}

	var html = eval(v_tag + "getCommentReplyHtml('"+v_ouid+"', r, "+r.hidden+")");
	$("commentdiv_"+r.thread_cid).innerHTML += html;
	s("commentdiv_"+r.thread_cid);
	
//	$("commentcontent_"+r.thread_cid).value="";
	eval('comment_editor_'+r.thread_cid+'.setContent();');
	$("replydiv_"+r.thread_cid).innerHTML = "";
}

function addCommentReplyShow(req, v_ouid, thread_cid)
{
	return _addCommentReplyShow(req, v_ouid, "", thread_cid);
}

function addCommentSubmit(v_btn, v_prompt)
{
	if (!parseInt(g_commentvuid))
	{
		alert("请登录后发表" + g_commenttypetext + "。");
		return;
	}
	var content = comment_editor.getHtml();
	if (content.replace(/(&nbsp;|<br\/?>|<\/?P>|\s*)/g, "").length == 0)
	{
		alert("请输入" + g_commenttypetext + "内容。");
		comment_editor.getFocus();
		return;
	}
	if (content == g_recentcomment)
	{
		return;
	}
	g_recentcomment = content;

	if (v_btn) v_btn.disabled = true;
	if ($(v_prompt)) s(v_prompt);
	
	var hidden = 0;
	if ($('comment_hiddenmsg')
		&& $('comment_hiddenmsg').checked)
	{
		hidden = 1;
	}
	
	var url = "/comment/post.php";
	var pars = "type="+g_commenttype+"&id="+g_commentid+"&ouid="+g_commentouid+"&texttype="+comment_editor.getTextType()+"&content="+encodeURIComponent(content)+"&title="+encodeURIComponent(g_commenttitle)+"&hidden="+hidden+"&ispwd="+g_is_privacy_pwd;
	var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { addCommentShow(req, v_btn, v_prompt); } });
}

function addCommentShow(req, v_btn, v_prompt)
{
	if (v_btn) v_btn.disabled = false;
	if ($(v_prompt)) h(v_prompt);

	var r = req.responseText;
	if(r == "0")
	{
		g_recentcomment = "";
		alert(g_commenttypetext + "失败");
		return;
	}
	else
	{
		eval("r=["+r+"]");
	}
	
	var html = getCommentThreadHtml(r[0].thread_cid, r);

	$("comment").innerHTML = html + $("comment").innerHTML;
	
	comment_editor.setContent("");
}






//COMMENT2

function c2_replyComment(v_tid, v_ouid, v_silent, ctime, canreply)
{
	g_threaddata = c2_g_threaddata;
	if (typeof(canreply) != "undefined" && ! canreply)
	{
		alert("6个月前的"+c2_g_commenttypetext+"，不可回复");
		return;
	}
	return _replyComment(v_tid, v_ouid, "c2_", v_silent, ctime);
}

function c2_setReplyEditorFocus(v_tid)
{
	return setReplyEditorFocus(v_tid);
}

function c2_cancelReply(thread_cid)
{
	return cancelReply(thread_cid);
}

function c2_replyCommentSubmit(thread_cid,other_uid)
{
	return _replyCommentSubmit(thread_cid, other_uid, c2_g_mainthreaddata[thread_cid].owneruid, c2_g_mainthreaddata[thread_cid].type, c2_g_mainthreaddata[thread_cid].id, "c2_", c2_g_mainthreaddata[thread_cid].ctime);
}

function c2_addCommentReplyShow(req, v_ouid, thread_cid)
{
	return _addCommentReplyShow(req, v_ouid, "c2_", thread_cid);
}

function c2_getCommentReplyHtml(ouid, rdata, silent)
{
	return _getCommentReplyHtml(ouid, rdata, c2_g_commentvuid, c2_g_mainthreaddata[rdata.thread_cid].owneruid, "c2_", silent);
}

function c2_delComment(v_cid, v_ouid, v_owner, v_ctime)
{
	return _delComment(v_cid, v_ouid, v_owner, "c2_", v_ctime);
}

function c2_delCommentShow(req)
{
	var r = req.responseText;
	if(r == "0")
	{
		return;
	}
	
	if(g_delrefresh == "1")
	{
		var href = window.location.href;
		var re = /t=(\d+)/g;
		if(re.test(href))
		{
			href = href.replace(re , "t="+Math.ceil(Math.random()*100));
		}
		else
		{
			if(-1 == href.indexOf('?'))
			{
				href = href+"?t="+Math.ceil(Math.random()*100);
			}
			else
			{
				href = href+"&t="+Math.ceil(Math.random()*100);
			}
		}
		window.location.href = href;
		exit;
	}
	
/*	$('replycomment_'+r).innerHTML = "此回复已被我删除";
	$('replycomment_'+r).className = "hy_br";
	$('replycomment_'+r).style.color = "#8692A2";
	h('hy2_2_' + r);
	$('replytitle_'+r).onmouseover = function () {};
	$('replytitle_'+r).onmouseout = function () {};*/
	$('replyitem_'+r).innerHTML ="";
	h('replyitem_'+r);
}


function c2_delCommentThread(v_tid, v_ouid, v_ctime)
{
	return _delCommentThread(v_tid, v_ouid, c2_g_commenttypetext, "c2_", v_ctime);
}


function c2_delCommentThreadShow(req, v_ouid)
{
	var r = req.responseText;
	if(r == "0")
	{
		return;
	}
	
	if(g_delrefresh == "1")
	{
		var href = window.location.href;
		var re = /([?&]{1}t=)\d+/;
		if(re.test(href))
		{
			href = href.replace(re , "$1"+Math.ceil(Math.random()*100));
		}
		else
		{
			if(-1 == href.indexOf('?'))
			{
				href = href+"?t="+Math.ceil(Math.random()*100);
			}
			else
			{
				href = href+"&t="+Math.ceil(Math.random()*100);
			}
		}
		window.location.href = href;
		exit;
	}

	var html = "<div style='color:#8692A2;'>此"+c2_g_commenttypetext+"已被我删除</div>";
	html += '<div class="gw_p2"><a href="/msg/write.php?uids=' + v_ouid + '" class="otherlink sl" title="短消息" target="_blank">短消息</a></div>';
	$('rightdiv_'+r).innerHTML = html;
}



var g3_commentvuid = 0;
var g3_commentisadmin = 0;
var g3_commenttype = 0;
var g3_commentid = 0;
var g3_commentgid = 0;

var g3_recentcomment= "";

function c3_initComment(vuid, isadmin , gid, type, id)
{
	g3_commentvuid = vuid;
	g3_commentisadmin = isadmin;
	g3_commentgid = gid;
	g3_commenttype = type;
	g3_commentid = id;
}

function c3_getCommentList()
{
	var url = "/group/commentlist.php";
	var pars = "type="+g3_commenttype+"&id="+g3_commentid+"&gid="+g3_commentgid;
	var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { c3_getCommentListShow(req); } });
}

function c3_getCommentListShow(req)
{
	var r = req.responseText;
	if(r == "0")
	{
		return;
	}
	else
	{
		eval("r="+r);
	}
	
	var html = "";
	for (var i=0 ; i<r.length ; i++)
	{
		html += c3_getCommentThreadHtml(r[i]);
	}
	$("comment").innerHTML = html + $("comment").innerHTML;
}



function c3_getCommentThreadHtml(tdata)
{
	var html = '<div class="gw1" id=threaddiv_'+tdata.cid+'>';
	html += '<div class="q_cygl2"><div class="l50_s"><a href="/'+g_homedir+'/?uid='+tdata.uid+'" title="'+tdata.real_name+'"><img src="'+tdata.icon+'" width="50" height="50" /></a></div>';
	html += '</div><div class="gw12">';
	if (g3_commentvuid == tdata.uid)
	{
		html += '<p class="gw_p1">我说道：</p>';
	}
	else
	{
		if (parseInt(tdata.online))
		{
			html += '<p class="gw_p1"><img src="http://img1.kaixin001.com.cn/i/u_zx1.gif" width="18" height="15" align="absmiddle" title="在线" /><a class="funclink sl" href="/'+g_homedir+'/?uid='+tdata.uid+'" title="'+tdata.real_name+'">'+tdata.real_name+'</a>说道：</p>';
		}
		else
		{
			html += '<p class="gw_p1"><a class="funclink sl" href="/'+g_homedir+'/?uid='+tdata.uid+'" title="'+tdata.real_name+'">'+tdata.real_name+'</a>说道：</p>';
		}
	}
	var str = tdata.content;
	str = str.replace(/<\/?[^>]+>/gi, commentFilter);
	str = str.replace(/<img[^>]+(src=\"[^\"]+\"|src=\'[^\']+\')[^>]+>/gi, '<img $1>');
	
	html += '<p class="text" style="font-size:12px;">'+str.replace(/<img/g , "<img onload='_commentImageResize(this,350);'")+'</p>';
	html += '<p class="gw_p2">';
	html += '<a class="otherlink sl-gray" href=/msg/write.php?uids='+tdata.uid+'>短消息</a>';
	if(g3_commentisadmin
		|| g3_commentvuid == tdata.uid)
	{
		html += ' ┊ <a class="otherlink sl-gray" href="javascript:c3_delCommentThread(\''+tdata.cid+'\');">删除</a>';
	}
	html += '</p></div>';
	html += '<div class="gw13">'+tdata.ctime+'</div>';
	html += '<div class="c"></div>';
	html += '</div>';
	return html;
}


function c3_addCommentSubmit(v_btn, v_prompt)
{
	var content = comment_editor.getHtml();
	if (content.trim().length == 0)
	{
		alert("请输入评论内容。");
		comment_editor.getFocus();
		return;
	}
	if (content == g3_recentcomment)
	{
		return;
	}
	g3_recentcomment = content;

	if (v_btn) v_btn.disabled = true;
	if ($(v_prompt)) s(v_prompt);

	var url = "/group/commentpost.php";
	var pars = "type="+g3_commenttype+"&id="+g3_commentid+"&gid="+g3_commentgid+"&texttype="+comment_editor.getTextType()+"&content="+encodeURIComponent(content);
	var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { c3_addCommentShow(req, v_btn, v_prompt); } });
}


function c3_addCommentShow(req, v_btn, v_prompt)
{
	if (v_btn) v_btn.disabled = false;
	if ($(v_prompt)) h(v_prompt);

	var r = req.responseText;
	if(r == "0")
	{
		g3_recentcomment = "";
		alert("评论失败");
		return;
	}
	else
	{
		eval("r="+r);
	}
	
	var html = c3_getCommentThreadHtml(r);
	$("comment").innerHTML = html + $("comment").innerHTML;
	comment_editor.setContent("");
}


function c3_delCommentThread(v_cid)
{
	if (confirm("你确认要删除这条评论吗？"))
	{
		var url = "/group/commentdel.php";
		var pars = "cid="+v_cid+"&gid="+g3_commentgid;
		var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { c3_delCommentThreadShow(req); } });
	}
}

function c3_delCommentThreadShow(req)
{
	var r = req.responseText;
	if(r == "0")
	{
		return;
	}
	
	h('threaddiv_'+r);
}

//COMMENT4
var c4_g_commentouid = 0;
var c4_g_commentvuid = 0;
var c4_g_mainthreaddata = null;
var c4_g_threaddata = null;

function c4_replyComment(v_tid, v_ouid, ctime, canreply)
{
	if (typeof(canreply) != "undefined" && ! canreply)
	{
		alert("6个月前的对话，不可回复。");
		return;
	}
	return _replyCommentNews(v_tid, v_ouid, "c4_", ctime);
}

function c4_setReplyEditorFocus(v_tid)
{
	eval('comment_editor_news_'+v_tid+'.getFocus();');
}

function c4_cancelReply(thread_cid)
{
	$("replydiv_news_"+thread_cid).innerHTML = "";
}

function c4_replyCommentSubmit(thread_cid,other_uid)
{
	return _c4_replyCommentSubmit(thread_cid, other_uid, c4_g_mainthreaddata[thread_cid].owner_uid, c4_g_mainthreaddata[thread_cid].type, c4_g_mainthreaddata[thread_cid].id, c4_g_mainthreaddata[thread_cid].ctime);
}
function _c4_replyCommentSubmit(thread_cid, other_uid, ouid, type, id, ctime)
{
	var noticeuid = 0;
	if($("noticeuid_news_"+thread_cid) 
		&& $("chknotice_news_"+thread_cid)
		&& $("chknotice_news_"+thread_cid).checked)
	{
		if($("chknotice_news_"+thread_cid).value)
		{
			noticeuid = $("noticeuid_news_"+thread_cid).value;
		}
	}
//	var content = $("commentcontent_"+thread_cid).value;
	var content = eval('comment_editor_news_'+thread_cid+'.getHtml();');
	if (content.length == 0)
	{
		alert("请输入回复内容。");
//		$("commentcontent_"+thread_cid).focus();
		eval('comment_editor_news_'+thread_cid+'.getFocus();');
		return;
	}
	
	$("commentbtn_news_" + thread_cid).disabled = true;
	s("commentprompt_news_" + thread_cid);

	var url = "/comment/freply.php";
	var pars = "owner="+ouid+"&thread_cid="+thread_cid+"&type="+type+"&id="+id+"&ctime="+ctime+"&ouid="+other_uid+"&texttype="+eval('comment_editor_news_'+thread_cid+'.getTextType();')+"&content="+encodeURIComponent(content)+"&noticeuid="+encodeURIComponent(noticeuid);
	var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { eval("c4_addCommentReplyShow(req, '"+other_uid+"', '"+thread_cid+"')"); } });
}

function c4_addCommentReplyShow(req, v_ouid, thread_cid)
{
	return _c4_addCommentReplyShow(req, v_ouid, "c4_", thread_cid);
}
function _c4_addCommentReplyShow(req, v_ouid, v_tag, thread_cid)
{
	$("commentbtn_news_" + thread_cid).disabled = false;
	h("commentprompt_news_" + thread_cid);
	
	var r = req.responseText;
	if(r == "0")
	{
		alert("回复失败");
		return;
	}
	else if(r=="-1")
	{
		alert("对方关闭了评论功能");
		return;
	}
	else
	{
		eval("r="+r);
	}

	var html = eval(v_tag + "getReplyItemHtml(r,c4_g_commentvuid,'"+v_ouid+"', c4_g_commentvuid)");
	$("commentdiv_news_"+r.thread_cid).innerHTML += html;
	s("commentdiv_news_"+r.thread_cid);
	
//	$("commentcontent_"+r.thread_cid).value="";
	eval('comment_editor_news_'+r.thread_cid+'.setContent();');
	$("replydiv_news_"+r.thread_cid).innerHTML = "";
}

// rdata 帖子数据
// vuid 访问用户
// ouid 主人
// puid 帖子发起者
function c4_getReplyItemHtml(rdata, vuid, ouid, puid)
{
	var reply = "";
	
	var real_name = "";
	vuid = parseInt(vuid, 10);
	if(rdata.puid == vuid)
	{
		real_name = '我';
	}
	else
	{
			real_name = '<A class=sl title='+rdata.pname+' href="/home/?uid='+rdata.puid+'">'+rdata.pname+'</A>';
	}
	var title = "";
	if(vuid == ouid
		|| vuid == rdata.puid
		|| (vuid == puid && rdata.puid != ouid))
	{
		title = '<DIV  id=replytitle_news_'+rdata.cid+' onmouseover="this.style.backgroundColor=\'#EEF0F4\';s(\'hy2_2_news_'+rdata.cid+'\');" onmouseout="this.style.backgroundColor=\'#F3F5F9\';h(\'hy2_2_news_'+rdata.cid+'\');" style="background-color:#F3F5F9;height:20px;"><div class="l">'+real_name+'&nbsp;&nbsp;</div><div class="l" style="COLOR: #8692a2">'+rdata.ctime+'</div>';
		if (puid == vuid)
		{
			title += '<div class="r dn"  id="hy2_2_news_'+rdata.cid+'" style="margin-right:10px;color:#000000;"><a href="javascript:c4_delComment(\''+rdata.cid+'\', \''+ouid+'\', \''+ouid+'\', '+rdata.ctimestamp+')" class="ql2"><img src="http://img1.kaixin001.com.cn/i/close.gif" style="margin-top: 3px;" /></a></div>';
		}
		else
		{
			title += '<div class="r dn"  id="hy2_2_news_'+rdata.cid+'" style="margin-right:10px;color:#000000;"><a href="javascript:c4_delComment(\''+rdata.cid+'\', \''+puid+'\', \''+ouid+'\', '+rdata.ctimestamp+')" class="ql2"><img src="http://img1.kaixin001.com.cn/i/close.gif" style="margin-top: 3px;" /></a></div>';
		}
		
		title +='<div class="c"></div></div>';
	
	}
	else
	{
		title = '<DIV  id=replytitle_news_'+rdata.cid+'><SPAN>'+real_name+'&nbsp;&nbsp;</SPAN><SPAN style="COLOR: #8692a2">'+rdata.ctime+'</SPAN></DIV>';
	}
	
	rdata.content = rdata.content.replace(/<img/g , "<img onload='_commentImageResize(this,350);'");
	
	reply +='<DIV class="mt10" id="replyitem_news_'+rdata.cid+'">	<div style="width:20px; height:20px; border:1px solid #fff; margin-right:5px;" class="l"><a title="'+rdata.pname+'" href="/home/?uid='+rdata.puid+'"><img src="'+rdata.picon20+'" width=20 height=20></a></div>	<DIV style="PADDING-LEFT: 2px; WIDTH: 365px" class=l>';

	reply += title;

	reply += '<DIV style="COLOR: #333333"  id=replycomment_news_'+rdata.cid+'>'+rdata.content+'</DIV></DIV><DIV class="c" style="height:0px;line-height:0px;"></DIV></DIV>';
	
	return reply;
}
function reply_unfold(tid)
{
	var obj = $("divfold_content_news_"+tid);
	var tcount = c4_g_threaddata[tid].count;
	var foldcount = tcount;
	if(obj.style.display =="block")
	{
		$('spnfold_news_'+tid).innerHTML = "展开"+foldcount+"条回复";
		h("divfold_content_news_"+tid);
	}
	else
	{
		$('spnfold_news_'+tid).innerHTML = "收起"+foldcount+"条回复";
		s("divfold_content_news_"+tid);
	}
}
function c4_getCommentReplyHtml(tid, tdata)
{
	var tcount = tdata.count;
	var foldcount = 0;
	if(tcount > 2)
	{
		foldcount = tcount - 2;
	}
	var reply = '<DIV style="WIDTH: 400px;MARGIN: 0 0 0 38px;padding:0;"><DIV style="padding:0;margin:0;"  id="commentdiv_news_'+tid+'" >';
	if(foldcount > 0)
	{
		reply +='<DIV style="MARGIN-TOP:2px; padding-top:2px; display: block; MARGIN-BOTTOM: -5px" id="divfold_news_'+tid+'"><IMG src="http://img1.kaixin001.com.cn/i/home/zk.gif" width=11>&nbsp;<A style="COLOR: #8692a2" href="javascript:reply_unfold('+tid+')"><span id="spnfold_news_'+tid+'">展开'+tcount+'条回复</span></a></A>			</DIV>			';
	}
	reply+='<div id="divfold_content_news_'+tid+'" style="display:none;margin-top:2px;">';
	
	for(var i=1; i<tcount-1; i++)
	{
		reply += c4_getReplyItemHtml(tdata[i], parseInt(c4_g_commentvuid, 10), tdata.ouid, tdata[0].puid);
	}
	reply+='</div>';
	var i= tcount - 1;
	if(i>0)
	{
		reply += c4_getReplyItemHtml(tdata[i], parseInt(c4_g_commentvuid, 10), tdata.ouid, tdata[0].puid);
	}
	reply+='</div></div>';
	return reply;
}

function c4_delComment(v_cid, v_ouid, v_owner, v_ctime)
{
	_delComment(v_cid, v_ouid, v_owner, "c4_", v_ctime);
}

function c4_delCommentShow(req)
{
	var r = req.responseText;
	if(r == "0")
	{
		return;
	}	
	$('replyitem_news_'+r).innerHTML = "";
	h('replyitem_news_'+r);
	/*$('replycomment_news_'+r).innerHTML = "此对话已被我删除";
	$('replycomment_news_'+r).className = "hy_br";
	$('replycomment_news_'+r).style.color = "#8692A2";
	h('hy2_2_news_' + r);
	$('replytitle_news_'+r).onmouseover = function () {};
	$('replytitle_news_'+r).onmouseout = function () {};*/
}


function c4_delCommentThread(v_tid, v_ouid, v_ctime)
{
	return _delCommentThread(v_tid, v_ouid, "对话", "c4_", v_ctime);
}



function c4_delCommentThreadShow(req, v_ouid)
{
	var r = req.responseText;
	if(r == "0")
	{
		return;
	}	
	var html = '<div style="color:#8692A2;" class="p010">此对话已被我删除</div>';
//	html += '<div class="gw_p2"><a href="/msg/write.php?uids=' + v_ouid + '" class="otherlink sl" title="短消息" target="_blank">短消息</a></div>';
	$('rightdiv_news_'+r).innerHTML = html;
}


function c4_getCommentThreadHtml(tid, tdata, canreply)
{
	if (typeof(canreply) == "undefined")
	{
		canreply = 1;
	}
	var html = "";
	html +='<div class="gw1" style="padding-left:0px;padding-right:0px;width:545px;">';
	html +='	<div class="l zj" style="margin-left:-5px;padding-top:0px;">';
	html +='		<div class="l50_s" style="padding-left:0;*padding-left:2px;">';
	html +='			<a title="'+tdata.oname+'" href="/home/?uid='+tdata.ouid+'"><img height="50" width="50" src="'+tdata.oicon50+'"/></a>';
	html +='		</div>';
	html +='		<div class="zj2" style="margin-top: -5px;margin-left:-15px;*margin-left:-5px;">';
if(tdata.online)
{
	html +='<img src="http://img1.kaixin001.com.cn/i/u_zx1.gif" width="18" height="15" align="absmiddle" title="在线" />';
}
	html +='			<a class="sl" title="'+tdata.oname+'" href="/home/?uid='+tdata.ouid+'">'+ tdata.oname+'</a>';
	html +='		</div>';
	html +='	</div>';
	var pname = "";
	if(tdata[0].puid == c4_g_commentvuid)
	{
		pname = "我";
	}
	else
	{
		pname = '<a class="sl" title="'+tdata[0].pname+'" href="/home/?uid='+tdata[0].puid+'">'+tdata[0].pname+'</a>';
	}
	html +='	<div class="gw12" style="width:460px;">';
	html +='		<div><div class="l">'+	tdata.appname+'&nbsp;</div>'+tdata.apphtml+'<div class="c"></div></div>';
	html +='		<div><img src="http://img1.kaixin001.com.cn/i/home/bgt.gif" width="454" /></div>';
	
	html +='		<div  id="rightdiv_news_'+tid+'" style="background:transparent url(http://img1.kaixin001.com.cn/i/home/bg.gif) repeat-y scroll 0 0;width:454px;margin-top:-5px;margin-top:0px;position:relative;">';
	html +='			<div style="position:absolute; left:340px;top:3px;">'+tdata.pichtml+'</div>';
	html +='			<div id="first_news_'+tid+'" style="width:425px;margin-left:10px;padding-top:2px;">';
	html +='   				<div class="l" style="width:20px; height:20px; border:1px solid #fff; margin-right:5px;"><a href="/home/?uid='+tdata[0].puid+'" title="'+tdata[0].pname+'" ><img height="20" width="20" src="'+tdata[0].picon20+'" /></a></div>';
	html +='   				<div class="l" style="width:365px;">';
	html +='					<div class="l" style="width:290px;">';
	html +='						<div style="padding-left:2px;">';
	html +='							<span style="color:#336699;">'+pname;
	html +='							</span>';
	html +='							<span style="color:#8692A2;">'+tdata[0].ctime+'</span>';
	html +='						</div>';
	tdata[0].content = tdata[0].content.replace(/<img/g , "<img onload='_commentImageResize(this,350);'");
	var pos = tdata[0].content.indexOf("<!--");
	var showcontent = tdata[0].content;
	if(pos != -1)
	{
		showcontent = tdata[0].content.substring(0, pos);
	}
	html +='						<div style="color:#333333;padding-left:2px;">'+showcontent+'</div>';
	html +='					</div>';
	html +='						<div class="c"></div>';
	html +='					</div>';
	html +='					<div class="c"></div>';
	html +='				</div>';
	html +=c4_getCommentReplyHtml(tid, tdata);
	
	html +='				<br class="c" style="height:0px;line-height:0px;"/>';
	html +='				<div style="margin:0 0 0 38px;">';
	var action = c4_getActionHtml(c4_g_commentvuid, tdata.ouid, tdata[0].puid, tid, tdata.cutime, tdata.comright, tdata.oname, canreply);	
	html += action;
	html +='				</div>';
	html +='				<div class="c"></div>';
	html +='				<div id=replydiv_news_'+tid+' style="padding-top:3px;"></div>';
	html +='			</div>';
	html +='			<div><img src="http://img1.kaixin001.com.cn/i/home/bgb.gif" width="454" /></div>';
	html +='		</div>';
	html +='		<div class="gw13"></div>';
	html +='		<div class="c"></div>';
	html +='	</div>'; 
	return html;
}
function c4_getActionHtml(vuid, ouid, puid, tid, ctime, comright, oname, canreply)
{
	if(comright == -2)
	{
		action = '<div class="c6" style="padding-top:2px;"><a class="sl" title='+oname+' href="/home/?uid='+ouid+'">'+oname+'</a>关闭了留言评论功能</div>';
	}
	else
	{
		action = '<div class="gw_p2" style="padding-top:2px;">';
		var replyaction = "";
		var delaction = "";
		if(vuid == puid)
		{
			replyaction = '<a href="javascript:c4_replyComment('+tid+', '+ouid+','+ctime+', '+canreply+')" class="sl-gray" title="回复">回复</a>';
			delaction = '<a href="javascript:c4_delCommentThread('+tid+','+ouid+','+ctime+')" class="sl-gray" title="删除">删除</a>';
		}
		else if (ouid == puid)
		{
			replyaction = '<a href="javascript:c4_replyComment('+tid+', 0,'+ctime+', '+canreply+')" class="sl-gray" title="回复">回复</a>';
		}
		else
		{
			replyaction = '<a href="javascript:c4_replyComment('+tid+', '+puid+','+ctime+', '+canreply+')" class="sl-gray" title="回复">回复</a>';
		}
		if (replyaction.length > 0 && delaction.length > 0)
		{
			replyaction += '&nbsp;┊&nbsp;';
		}
		action += replyaction + delaction;
		action += '</div>';
	}
	return action;
}
function c4_getCommentListShow(req)
{
	var r = req.responseText;
	if(r == "0")
	{
		return;
	}
	else
	{
		eval("r="+r);
	}
	var html = "";
	var tids = r.tids.split(" ");
	c4_g_mainthreaddata = r.maindata;
	c4_g_threaddata = r.data;
	for (var i=0; i<tids.length; i++)
	{
		try
		{
			var tid = tids[i];
			if(tid == "")
			{
				continue;
			}		
			html += c4_getCommentThreadHtml(tid, r.data[tid], r.maindata[tid]["canreply"]);
		}
		catch(e)
		{
		}
	}

	if(r.tids == "")
	{
		if($("nonewstipdiv"))
		{
			if(c4_g_commentvuid == c4_g_commentouid)
			{
				$("nonewstipdiv").innerHTML = "没有朋友间对话";
				s("nonewsdiv");
			}
			else
			{
				$("nonewstipdiv").innerHTML = "没有"+g_home_ta+"的对话";
				s("nonewsdiv");
			}
		}
	}
	

	$("divnews").innerHTML = html;
}

function c4_getCommentList()
{
	var url = "/comment/flist.php";
	var pars = "uid="+c4_g_commentouid+"&_preview="+g_viewmode;
	var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { c4_getCommentListShow(req); } });
}

function c5_getCommentList()
{
	var url = "/comment/mflist.php";
	var pars = "";
	var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { c4_getCommentListShow(req); } });
}
