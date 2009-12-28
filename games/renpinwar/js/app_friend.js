


function a_appfriend_show(aid , appurl , appname)
{
	a_appfriend_hidden();
	var url = "/interface/appfriend.php";
	var text = encodeURIComponent(text);

	var pars = "aid=" + aid;
	if(-1 == appurl.indexOf('?'))
	{
		appurl = appurl+'?';
	}
	var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { a_appfriend_ajaxshow(req , aid , appurl , appname); } });
	
}

function a_appfriend_ajaxshow(req , aid , appurl , appname)
{
	r = req.responseText;
//	alert(r);
	eval("r="+r);
	var html = '<div style="border:1px solid #CFCFCF;padding:5px;*height:238px;"><div><div class="l">好友的'+appname+'&nbsp：</div><div class="r"><a href="javascript:a_appfriend_hidden();"><img src="/i2/shut.gif" width="8" height="7" alt="关闭" align="absmiddle" /></a></div><div class="c" style="height:1px;"></div></div>';
	html += '<div style="height:219px; overflow:scroll; overflow-x:hidden;">';
	for(var i=0 ; i<r.length ; i++)
	{
		html += '<div class="bb1d8"><a  style="cursor:pointer;" class="sl2_r" href="'+appurl+'&uid='+r[i].uid+'"><div class="l" style="width:5em;">'+r[i].name+'</div><div class="l" style="width:3em;">'+'('+r[i].index_num+')</div><div class="l" style="width:2em;">'+'&gt;&gt;</div><div class="c"></div></a>'+'</div>';
	}
	if(r.length == 0)
	{
		html += '<div class="p5 c9">你的好友还没有添加过该组件</div>';
	}
	html += '</div></div>';
	$("app_friend_tip").innerHTML = html;
	$("app_friend_tip").style.display = "block";
	
	var pos = getpos($("app_friend_"+aid));
        $("app_friend_tip").style.left = parseInt(pos.left) + "px";
	$("app_friend_tip").style.top = parseInt(pos.bottom + 2) + "px";
	
}

function a_appfriend_hidden()
{
	$("app_friend_tip").innerHTML = "";
	$("app_friend_tip").style.display = "none";
}