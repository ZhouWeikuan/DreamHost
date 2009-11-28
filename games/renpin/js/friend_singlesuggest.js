var fs2_mode = 0;	//0/1 -- 是否支持输入站外名称
var fs2_data = [];
var fs2_dirty = false;
var fs2_pars = "";

var fs2_inputname = "";
var fs2_fsgnrname = "";
var fs2_xxshname = "";
var fs2_allfriendname = "";
var fs2_withex = "";
 
function fs2_hasActive()
{
	for(var i=0; i<fs2_data.length ; i++)
	{
		if(fs2_data[i].type == "active")
		{
			return i;
		}
	}
	return -1;
}

function fs2_superOnclick()
{
	if (fs2_fsgnrname == "")
	{
		$('fsg_nr').style.display = "none";
	}
	else
	{
		$(fs2_fsgnrname).style.display = "none";
	}

	if(fs2_hasActive() != -1)
	{
		if($("active").value != "" && $("suggest").style.display == "none")
		{
			$("active").value = "";
		}
		$("active").focus();
	}
	else
	{
		fs2_data[fs2_data.length] = {type:"active"};
		fs2_superView();
	}

	if (fs2_inputname == "")
	{
		$("superinput").parentNode.className = "it2";
	}
	else
	{
		$(fs2_inputname).parentNode.className = "it1";
	}
}

function fs2_activeFocus()
{
	for(var i=0 ; i<5 ; i++)
	{
		if($("active"))
		{
			$("active").focus();
		}
	}
}

function fs2_superView()
{
	if(fs2_data.length > 0 && fs2_data[0].type == "static")
	{
		var f2_seluid = fs2_data[0].uid;
		if ('function' == typeof(f2_afterseluid))
		{
			f2_afterseluid(f2_seluid);
		}
		fs2_refresh(fs2_data[0].uid);
		
	}
	else
	{
		if ($("fs2_icon"))
		{
			$("fs2_icon").style.display = "none";
		}

		if ('function' == typeof(fs2_onclear))
		{
			fs2_onclear();
		}
	}
	var html = "";
	for(var i=0; i<fs2_data.length ; i++)
	{
		if(fs2_data[i].type == "static")
		{
			if (fs2_data[i].uid == "0" || fs2_data[i].uid == 0)
			{
				html += '<div style="float:left;background:#fff9d7;margin:1px 5px 1px 0; padding:0 5px;">'+fs2_data[i].real_name+'</div>';
			}
			else
			{
				var logo = fs2_logo20(fs2_data[i]);
				if (logo == "")
				{
					html += '<div class="fsg_hy2">'+fs2_data[i].real_name+'&nbsp;<a style="cursor:pointer;" onclick="javascript:fs2_inputDelete('+"'"+i+"'"+');"><img border="0" align="absmiddle" alt="移除" src="http://img1.kaixin001.com.cn/i2/del.gif"/></a></div>';
				}
				else
				{
					html += '<div class="fsg_hy2">'+fs2_data[i].real_name+'&nbsp;&nbsp;'+logo+'&nbsp;<a style="cursor:pointer;" onclick="javascript:fs2_inputDelete('+"'"+i+"'"+');"><img border="0" align="absmiddle" alt="移除" src="http://img1.kaixin001.com.cn/i2/del.gif"/></a></div>';
				}
			}
		}
		else
		{
			html += '<div class="fsg_id" id="activediv" style="width:50px;"><input onkeydown="return fs2_inputOnkeydown(event)" onkeyup="fs2_inputOnkeyup(event)" onblur="fs2_inputOnblur(this);" onfocus="fs2_inputOnfocus(this);" id="active" name="active" type="text" value="" class="fsg_it" size="2" Autocomplete="off" maxlength=50/><div class="fsg_nl" id="suggest" style="display:none;width:210px;"></div><div id="emptysuggest" class="fsg_nl" style="padding-left:7px;background:#eeeeee;color:#666666;width:220px;">请输入好友的姓名(开心网上姓名)</div></div></div>';
		}
	}

	if (fs2_inputname == "")
	{
		$("superinput").innerHTML = html==""?"&nbsp;":html;
	}
	else
	{
		$(fs2_inputname).innerHTML = html==""?"&nbsp;":html;
	}
	
	fs2_activeFocus();
}

function fs2_inputDelete(index)
{
	var fs2_data2 = [];
	var len = fs2_data.length;
	var j = 0;
	for (var i=0; i<len; i++)
	{
		if (i == index)
		{
			continue;
		}
		fs2_data2[j] = fs2_data[i];
		j++;
	}
	fs2_data = fs2_data2;
	fs2_dirty = true;
	fs2_superView();
	return;
}

function fs2_getHotNum()
{
	var obj;
	var num=0;
	var hotnum = -1;
	while((obj = $("suggest_"+num)) != null)
	{
		if(obj.className == "sgt_on")
		{
			hotnum = num;
		}
		num++;
	}
	return {"hotnum":hotnum,"totalnum":num};
}

function fs2_inputOnblur(thisobj)
{
	$("suggest").style.display = "none";
	$("emptysuggest").style.display = "none";
	if($("active") && $("active").value != "")
	{
		$("active").value = "";
	}

	if (fs2_inputname == "")
	{
		$("superinput").parentNode.className = "it1";
	}
	else
	{
		$(fs2_inputname).parentNode.className = "it1";
	}
}

function fs2_inputOnfocus(thisobj)
{
	if(fs2_data.length > 1)
	{
		$("emptysuggest").style.display = "none";
		return false;
	}
	if(thisobj.value == "")
	{
		$("emptysuggest").style.display = "block";
		$("emptysuggest").innerHTML = "请输入好友的姓名(支持拼音首字母输入)";
		
	}
}


function fs2_inputOnkeydown(evnt)
{
	if(fs2_data.length > 1)
	{
		if (evnt.preventDefault)
		{
			evnt.preventDefault();
		}
		else
		{
			evnt.returnValue = 0;
		}
	}
	
	
	$("active").style.width = b_strlen($("active").value)*6+20 + "px";
	if (evnt.keyCode == 13)
	{
		return false;
	}
	var activenum = fs2_hasActive();
	//BACKSPACE
	if(evnt.keyCode == 8 && fs2_data[activenum-1] && $("active").value=="")
	{
		var fs2_data2 = [];
		var j=0;
		for(var i=0; i<fs2_data.length ; i++)
		{
			
			if(activenum-1 == i)
			{
				continue;
			}
			fs2_data2[j] = fs2_data[i];
			j++;
		}
		fs2_data = fs2_data2;
		fs2_dirty = true;
		fs2_superView();
		return;
	}

	//LEFT
	if(evnt.keyCode == 37 && fs2_data[activenum-1] && $("active").value=="")
	{
		return;
		var obj = fs2_data[activenum];
		fs2_data[activenum] = fs2_data[activenum-1];
		fs2_data[activenum-1] = obj;
		fs2_superView();
		return;
	}
	//RIGHT
	if(evnt.keyCode == 39 && fs2_data[activenum+1] && $("active").value=="")
	{
		return;
		var obj = fs2_data[activenum];
		fs2_data[activenum] = fs2_data[activenum+1];
		fs2_data[activenum+1] = obj;
		fs2_superView();
		return;
	}
	
	
	var hotinfo = fs2_getHotNum();
	var hotnum = hotinfo.hotnum;
	var num = hotinfo.totalnum;
	//DOWN
	if(evnt.keyCode == 40)
	{
		if($("suggest_0") != null && $("suggest").style.display == "block")
		{
			if(hotnum == -1)
			{
				$("suggest_0").className = "sgt_on";
			}
			else
			{
				var nextnum = hotnum == num-1 ? 0 : hotnum+1;
				$("suggest_"+hotnum).className = "sgt_of";
				$("suggest_"+nextnum).className = "sgt_on";
			}
			return false;
		}
	}
	//UP
	if(evnt.keyCode == 38)
	{
		if($("suggest_0") != null && $("suggest").style.display == "block")
		{
			if(hotnum == -1)
			{
				$("suggest_"+(num-1)).className = "sgt_on";
			}
			else
			{
				var prevnum = hotnum == 0 ? num-1 : hotnum-1;
				$("suggest_"+hotnum).className = "sgt_of";
				$("suggest_"+prevnum).className = "sgt_on";
			}
		}
	}

}
function fs2_inputOnkeyup(evnt)
{
	
	//ENTER
	if (evnt.keyCode == 13)
	{
		var hotinfo = fs2_getHotNum();
		var hotnum = hotinfo.hotnum;
		var totalnum = hotinfo.totalnum;
		var hasuser = $("suggest").style.display == "block" && hotnum!=-1 && totalnum>0;
		if (fs2_mode == 1 && !hasuser && $("active").value.length)
		{
			var escape_real_name = $("active").value.replace(/&/g, "&amp;");
			escape_real_name = escape_real_name.replace(/</g, "&lt;");
			escape_real_name = escape_real_name.replace(/>/g, "&gt;");
			var friendobj = {uid:"0",real_name:escape_real_name,real_name_unsafe:$("active").value,type:"static"};

			var activenum = fs2_hasActive();
			for(var i=fs2_data.length ; i> activenum ; i--)
			{
				fs2_data[i] = fs2_data[i-1];
			}
			fs2_data[activenum] = friendobj;
			fs2_dirty = true;
			
			fs2_superView();
		}
		else if (hasuser)
		{
			var friendobj = fs2_frienddata[hotnum];
			friendobj.type = "static";
		
			var activenum = fs2_hasActive();
			for(var i=fs2_data.length ; i> activenum ; i--)
			{
				fs2_data[i] = fs2_data[i-1];
			}
			fs2_data[activenum] = friendobj;
			fs2_dirty = true;
			
			fs2_superView();
		}
	}
	if(evnt.keyCode == 38 || evnt.keyCode == 40)
	{
	}
	else if (evnt.keyCode == 27)
	{
		fs2_suggestClose();
	}
	else
	{
		fs2_ajax_submit();
	}

}


function fs2_ajax_submit()
{
	var url = "/interface/suggestfriend.php";
	var text = encodeURIComponent($("active").value);
	var pars = "pars="+fs2_pars+"&text=" + text;
	var myAjax = new Ajax.Request(url, {method: "get", parameters: pars, onComplete: function (req) { fs2_ajax_show(req); } });
}

var fs2_frienddata = [];
function fs2_ajax_show(req)
{
	var arr = eval(req.responseText);   
	fs2_frienddata = arr;
	
	if(arr.length == 0)
	{
		$("suggest").style.display = "none";
		if(fs2_data.length > 1)
		{
			$("emptysuggest").style.display = "none";
		}
		else
		{
			$("emptysuggest").style.display = "block";
		}
		if($("active").value == "")
		{
			$("emptysuggest").innerHTML = "请输入好友的姓名(支持拼音首字母输入)";
		}
		else
		{
			if (fs2_mode == 1)
			{
				$("emptysuggest").innerHTML = "姓名不在好友列表哦";
			}
			else
			{
				$("emptysuggest").innerHTML = "姓名不在好友列表哦，请重新输入";
			}
		}
		
		return;
	}
	
	var html = "";
	for(var i=0 ; i<arr.length ; i++)
	{
		html += '<div id=suggest_'+i+' class="sgt_of" style="width:200px;" onmouseover="fs2_suggestOnmouseover(this)" onmousedown="fs2_suggestOnmousedown(this);">'+arr[i].real_name+'　'+fs2_logo20(arr[i])+'</div>';
	}
	$("suggest").innerHTML = html;
	$("suggest").style.display = "block";
	$("emptysuggest").style.display = "none";
	
	if($("suggest_0") != null && $("suggest").style.display == "block")
	{
		$("suggest_0").className = "sgt_on";
	}
	
}

function fs2_suggestcloseOnMouseover()
{
	var num = 0;
	while((obj = $("suggest_"+num)) != null)
	{
		if (obj.className == "sgt_on")
		{
			obj.className= "sgt_of";
		}
		num++;
	}
}

function fs2_suggestClose()
{
	fs2_superView();
}


function fs2_suggestOnmouseover(thisobj)
{
	var arr = thisobj.id.split('_');
	var thisnum = arr[1];
	
	var obj;
	var num=0;
	while((obj = $("suggest_"+num)) != null)
	{
		if(thisnum == num)
		{
			obj.className = "sgt_on";
		}
		else
		{
			obj.className = "sgt_of";
		}
		num++;
	}
}

function fs2_suggestOnmousedown(thisobj)
{
	var arr = thisobj.id.split('_');
	var num = arr[1];
	var friendobj = fs2_frienddata[num];
	friendobj.type = "static";

	var activenum = fs2_hasActive();
	for(var i=fs2_data.length ; i> activenum ; i--)
	{
		fs2_data[i] = fs2_data[i-1];
	}
	fs2_data[activenum] = friendobj;
	fs2_dirty = true;
	
	fs2_superView();
}



//all friend
function fs2_viewAllfriend()
{
	if($("suggest"))
	{
		$("suggest").style.display = "none";
	}

	var fsgnrname = "fsg_nr";
	if (fs2_fsgnrname != "")
	{
		fsgnrname = fs2_fsgnrname;
	}

	var xxshname = "xx_sh";
	if (fs2_xxshname != "")
	{
		xxshname = fs2_xxshname;
	}

	if($(fsgnrname).style.display == "block")
	{
		$(fsgnrname).style.display = "none";
		$(xxshname).innerHTML = '<img src="http://img1.kaixin001.com.cn/i/xx_xx1.gif" class="cp" onmouseover="this.src=\'http://img1.kaixin001.com.cn/i/xx_xx2.gif\';" onmouseout="this.src=\'http://img1.kaixin001.com.cn/i/xx_xx1.gif\';" alt="选择好友" />';
	}
	else
	{
		var url = "/interface/suggestfriend.php";
		var pars = "pars="+fs2_pars+"&type=all";
		var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { fs2_ajax_allfriendshow(req); } });
		
		$(fsgnrname).style.display = "block";
		$(xxshname).innerHTML = '<img src="http://img1.kaixin001.com.cn/i/xx_xs1.gif" class="cp" onmouseover="this.src=\'http://img1.kaixin001.com.cn/i/xx_xs2.gif\';" onmouseout="this.src=\'http://img1.kaixin001.com.cn/i/xx_xs1.gif\';" alt="选择好友" />';

	}
}


var fs2_allfrienddata = [];
function fs2_ajax_allfriendshow(req)
{
	var arr = eval(req.responseText);
	fs2_allfrienddata = arr;
	var html = "";
	for(var i=0 ; i<Math.ceil(arr.length/3)*3 ; i++)
	{	
		if(i%3 == 0)
		{
			html += '<div class="sgt_of" style="width:300px;">\n';
		}
		if(arr[i])
		{
			html += '<div class="l" style="width:100px;"><input id="radio'+i+'" type="radio" name="friend"/>'+arr[i].real_name+'&nbsp;&nbsp;'+fs2_logo20(arr[i])+'</div>\n';
		}
		if(i%3 == 2)
		{
			html += '<div class="c"></div>\n';
			html += '</div>\n';
		}
	}
	
	if (fs2_allfriendname == "")
	{
		$("allfriend").innerHTML = html;
	}
	else
	{
		$(fs2_allfriendname).innerHTML = html;
	}
}

function fs2_selectFriend()
{
	for(var i=0; i<fs2_allfrienddata.length ; i++)
	{
		if($("radio"+i).checked)
		{
			var obj = fs2_allfrienddata[i];
			obj.type = "static";
			fs2_data[0] = fs2_allfrienddata[i];
		}
	}
	var fs2_data2 = [];
	var j=0;
	for(var i=0; i<fs2_data.length ; i++)
	{
		if(fs2_data[i].type == "active")
		{
			continue;
		}
		
		fs2_data2[j] = fs2_data[i];
		j++;
	}
	fs2_data = fs2_data2;
	fs2_dirty = true;

	if (fs2_fsgnrname == "")
	{
		$('fsg_nr').style.display = "none";
	}
	else
	{
		$(fs2_fsgnrname).style.display = "none";
	}

	var xxshname = "xx_sh";
	if (fs2_xxshname != "")
	{
		xxshname = fs2_xxshname;
	}

	$(xxshname).innerHTML = '<img src="http://img1.kaixin001.com.cn/i/xx_xx1.gif" class="cp" onmouseover="this.src=\'http://img1.kaixin001.com.cn/i/xx_xx2.gif\';" onmouseout="this.src=\'http://img1.kaixin001.com.cn/i/xx_xx1.gif\';" alt="选择好友" />';

	fs2_superView();
}

function fs2_refresh(uid)
{
	var url = "/interface/user.php";
	var pars = "uid=" + uid ;
	if (fs2_withex != "")
	{
		pars += "&withex=1&t="+(new Date()).getTime();
	}
	var myAjax = new Ajax.Request(url, {method: "get", parameters: pars, onComplete: function (req) { fs2_refreshShow(req); } });
}


function fs2_refreshShow(req)
{
	var r = req.responseText;
	eval("r="+r);
	if ($("icon120"))
	{
		$("icon120").src = r.logo120;
	}
	if ($("icon50"))
	{
		$("icon50").src = r.logo50;
	}
	if ($("icon25"))
	{
		$("icon25").src = r.logo25;
	}
	if ($("fs2_icon"))
	{
		$("fs2_icon").style.display = "block";
	}
	
	if ('function' == typeof(fs2_onrefresh))
	{
		fs2_onrefresh(r);
	}
}

function fs2_logo20(obj)
{
	var logo20 = "";
	if(typeof obj.logo20 != "undefined")
	{
		logo20 = "<img src='"+obj.logo20+"' align=absmiddle width=15 />";
	}
	return logo20;
}

