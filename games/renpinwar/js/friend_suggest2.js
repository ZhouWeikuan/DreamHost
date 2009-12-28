
/*
导航栏专用
useage:
<input id="input" onkeydown="return f2_inputOnkeydown(event ,this)" onkeyup="f2_inputOnkeyup(event,this)" onblur="f2_inputOnblur();" type="text" value="" autocomplete="off"/>
*/

var f2_inputid = "";	//input id
var f2_frienddata = [];	//friend data
var f2_seluid = 0;	//selected uid
var f2_word1 = "";
var f2_word2 = "";
var f2_pars = "";


function friendSuggest2(inputid , word1 , word2)
{
	f2_inputid = inputid;
	f2_word1 = word1;
	f2_word2 = word2;
	
	var obj = $(f2_inputid);
	if($("f2_suggest") != null)
	{
		if($("f2_suggest").parentNode != obj.parentNode)
		{
			$("f2_suggest").parentNode.removeChild($("f2_suggest"));
		}
		else
		{	
			return;
		}
	}
	
	var pos = getpos($(f2_inputid));
	
	var html = '<div class="fsg_nl" id="f2_suggest" style="display:none;border-width: 1px 1px 1px 1px; z-index:99999;width:'+(pos.right - pos.left - 5 )+'px;"></div><div id="f2_emptysuggest" class="fsg_nl" style="z-index:99999;display:none;font-size:12px;padding-left:7px;background:#eeeeee;color:#666666;width:'+(pos.right - pos.left - 9)+'px;border-width:1px 1px 1px 1px;"></div>';
	new Insertion.After(f2_inputid , html);
	f2_adjustPos();
}

function f2_adjustPos()
{
	var pos = getpos($(f2_inputid));
	try
	{
		$("f2_suggest").style.left = parseInt(pos.left) + "px";
		$("f2_suggest").style.top = parseInt(pos.bottom+1) + "px";
		$("f2_suggest").style.width = parseInt(pos.right - pos.left - 5 + 12) + "px";
		
		$("f2_emptysuggest").style.left = parseInt(pos.left) + "px";
		$("f2_emptysuggest").style.top = parseInt(pos.bottom+1) + "px";
		$("f2_emptysuggest").style.width = parseInt(pos.right - pos.left - 9 + 11) + "px";
	}
	catch(e)
	{
	}
}

function f2_inputOnfocus(event,thisobj)
{
	if(thisobj.value == "")
	{
		f2_adjustPos();
		$("f2_emptysuggest").innerHTML = f2_word1;
		$("f2_emptysuggest").style.display = "block";
	}
}

function f2_inputOnkeydown(evnt,thisobj)
{
	if (evnt.keyCode == 13)
	{
		return false;
	}
	
	var hotinfo = f2_getHotNum();
	var hotnum = hotinfo.hotnum;
	var num = hotinfo.totalnum;
	//DOWN
	if(evnt.keyCode == 40)
	{
		if($("f2_suggest_0") != null && $("f2_suggest").style.display == "block")
		{
			if(hotnum == -1)
			{
				$("f2_suggest_0").className = "sgt_on";
			}
			else
			{
				var nextnum = hotnum == num-1 ? 0 : hotnum+1;
				$("f2_suggest_"+hotnum).className = "sgt_of";
				$("f2_suggest_"+nextnum).className = "sgt_on";
			}
			return false;
		}
		
	}
	//UP
	if(evnt.keyCode == 38)
	{
		if($("f2_suggest_0") != null && $("f2_suggest").style.display == "block")
		{
			if(hotnum == -1)
			{
				$("f2_suggest_"+(num-1)).className = "sgt_on";
			}
			else
			{
				var prevnum = hotnum == 0 ? num-1 : hotnum-1;
				$("f2_suggest_"+hotnum).className = "sgt_of";
				$("f2_suggest_"+prevnum).className = "sgt_on";
			}
		}
		
	}
	
	
}

function f2_inputOnkeyup(evnt,thisobj)
{
	var hasthisperson = false;
	for(var i=0 ; i<f2_frienddata.length ; i++)
	{
		if(f2_frienddata[i].real_name == $(f2_inputid).value)
		{
			hasthisperson = true;
		}
	}
	if(hasthisperson == false)
	{
		f2_seluid = 0;
	}
	//ENTER
	if (evnt.keyCode == 13)
	{
		var hotinfo = f2_getHotNum();
		var hotnum = hotinfo.hotnum;
		var totalnum = hotinfo.totalnum;
		if ($("f2_suggest").style.display == "block" && hotnum!=-1 && totalnum>0)
		{
			//填入input
			$(f2_inputid).value = f2_frienddata[hotnum].real_name_unsafe;
			f2_seluid = f2_frienddata[hotnum].uid;
			if ('function' == typeof(f2_gotouser))
			{
				f2_gotouser(f2_seluid);
			}
			$("f2_suggest").style.display = "none";
				
		}
	}
	else if(evnt.keyCode == 38 || evnt.keyCode == 40)
	{
	}
	else
	{
		f2_ajax_submit();
	}
	
	
}


function f2_ajax_submit()
{
	var url = "/interface/suggestfriend.php";
	var text = encodeURIComponent($(f2_inputid).value);
	var pars = "text=" + text + "&pars=" + f2_pars;
	var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { f2_ajax_show(req); } });
}

function f2_ajax_show(req)
{
	var arr = eval(req.responseText);   
	f2_frienddata = arr;
	
	if(arr.length == 0)
	{
		$("f2_suggest").style.display = "none";
		if($(f2_inputid).value == "")
		{
			$("f2_emptysuggest").innerHTML = f2_word1;
			$("f2_emptysuggest").style.display = "block";
		}
		else
		{
			if(f2_word2 == "")
			{
				$("f2_emptysuggest").style.display = "none";
			}
			else
			{
				$("f2_emptysuggest").innerHTML = f2_word2;
				$("f2_emptysuggest").style.display = "block";
			}
		}
		return;
	}
	
	var html = "";
	
	for(var i=0 ; i<arr.length ; i++)
	{
		html += '<div id=f2_suggest_'+i+' class="sgt_of" style="border-width: 1px 1px 1px 1px;font-size:12px;width:'+(parseInt($("f2_suggest").style.width)-10)+'px;" onmouseover="f2_suggestOnmouseover(this)" onmousedown="f2_suggestOnmousedown(this);">'+arr[i].real_name+'&nbsp;&nbsp;'+f2_logo20(arr[i])+'</div>';
	}
	$("f2_suggest").innerHTML = html;
	$("f2_suggest").style.display = "block";
	$("f2_emptysuggest").style.display = "none";
	f2_adjustPos();
	
	
	if($("f2_suggest_0") != null && $("f2_suggest").style.display == "block")
	{
		$("f2_suggest_0").className = "sgt_on";
	}
	
}

function f2_getHotNum()
{
	var obj;
	var num=0;
	var hotnum = -1;
	while((obj = $("f2_suggest_"+num)) != null)
	{
		if(obj.className == "sgt_on")
		{
			hotnum = num;
		}
		num++;
	}
	return {"hotnum":hotnum,"totalnum":num};
}


function f2_suggestOnmouseover(thisobj)
{
	var arr = thisobj.id.split('_');
	var thisnum = arr[2];
	
	var obj;
	var num=0;
	while((obj = $("f2_suggest_"+num)) != null)
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

function f2_suggestOnmousedown(thisobj)
{
	var arr = thisobj.id.split('_');
	var num = arr[2];
	
	$(f2_inputid).value = f2_frienddata[num].real_name_unsafe;
	f2_seluid = f2_frienddata[num].uid;
	if ('function' == typeof(f2_gotouser))
	{
		f2_gotouser(f2_seluid);
	}
	$("f2_suggest").style.display = "none";

}

function f2_inputOnblur()
{
	if($("f2_suggest"))
	{
		$("f2_suggest").style.display = "none";
	}
	$("f2_emptysuggest").style.display = "none";
}

function f2_logo20(obj)
{
	var logo20 = "";
	if(typeof obj.logo20 != "undefined")
	{
		logo20 = "<img src='"+obj.logo20+"'  align=absmiddle width=15  />";
	}
	return logo20;
}