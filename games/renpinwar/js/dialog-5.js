
var g_agt = navigator.userAgent.toLowerCase();
var is_opera = (g_agt.indexOf("opera") != -1);
var g_title = "";
var g_iframeno = 0;
var g_dialog_sWord;
var g_dialog_sButton;
var g_dialog_sAction;
var g_dialog_excss;

function exist(s)
{
	return $(s)!=null;
}
function myInnerHTML(idname, html)
{
	if (exist(idname))
	{
		$(idname).innerHTML = html;
	}
}
function dialog(v_w, v_h, v_title /*, v_needhead*/)
{
	var width = v_w;
	var height = v_h;
	var title = v_title;
	g_title = title;
	
	var sBox = '\
		<div id="dialogBox" style="display:none;z-index:19999;width:'+width+'px;">\
			<div class=ts460 style="position:absolute;top:0px;width:'+width+'px;filter:alpha(opacity=40);-moz-opacity:0.4;opacity:0.4;filter:\'alpha(opacity=40)\'"><img src="http://img1.kaixin001.com.cn/i/h460_t.gif" width="'+width+'" height="8" /></div>\
			<div style="position:absolute;height:'+height+'px;top:8px;" >\
			<table border="0" cellpadding="0" cellspacing="0">\
			<tr style="height:'+(height)+'px;"><td style="background:#000000;width:7px;filter:alpha(opacity=40);-moz-opacity:0.4;opacity:0.4;filter:\'alpha(opacity=40)\'"></td>\
			<td style="width:'+(width-14)+'px;">\
				<div style="border:1px solid #565656;">\
				<table width="100%" border="0" cellpadding="0" cellspacing="0">\
				';
	if(typeof arguments[3] != "undefined")
	{
		var sClose = '<a href="###" onclick="javascript:new dialog().close();"><img src="http://img1.kaixin001.com.cn/i2/knowme/close.gif" width="10" alt="关闭"></a>';
		if(0 == arguments[3])
		{
			sBox +=	'\
					<tr valign="top">\
						<td id="dialogBody" style="height:' + (height-2) + 'px" bgcolor="#ffffff"></td>\
					</tr>\
			';
		}
		else
		{
			sBox +=	'\
						<tr height="24" bgcolor="#ffffff">\
							<td>\
								<div class="ts3" style="background:#ffffff;border-bottom:1px solid #ffffff;">\
									<div id="dialogBoxTitle" class="ts31" >'+title+'</div>\
									<div id="dialogClose" class="ts32" style="margin-top:5px;margin-right:5px;">' + sClose + '</div>\
								</div>\
							</td>\
						</tr>\
						<tr valign="top">\
							<td id="dialogBody" style="height:' + (height-28) + 'px" bgcolor="#ffffff"></td>\
						</tr>\
			';
		}
	}
	else
	{
		var sClose = '<a href="###" onclick="javascript:new dialog().close();"><b>×</b></a>';
		sBox +=	'\
					<tr height="24" bgcolor="#6795B4">\
						<td>\
							<div class="ts3">\
								<div id="dialogBoxTitle" class="ts31">'+title+'</div>\
								<div id="dialogClose" class="ts32">' + sClose + '</div>\
							</div>\
						</td>\
					</tr>\
					<tr valign="top">\
						<td id="dialogBody" style="height:' + (height-28) + 'px" bgcolor="#ffffff"></td>\
					</tr>\
		';
	}
		
	sBox += '\
				</table>\
				</div>\
			</td>\
			<td style="background:#000000;width:7px;filter:alpha(opacity=40); -moz-opacity:0.4;opacity:0.4;filter:\'alpha(opacity=40)\'"></td></tr>\
			</table>\
			</div>\
			<div class=ts460 style="position:absolute;top:'+(height+8)+'px;width:'+width+'px;filter:alpha(opacity=40);-moz-opacity:0.4;opacity:0.4;filter:\'alpha(opacity=40)\'"><img src="http://img1.kaixin001.com.cn/i/h460_b.gif" width="'+width+'" height="8" /></div>\
		</div><div id="dialogBoxShadow" style="display:none;z-index:19998;"></div>\
	';
	
	var sIfram = '\
		<iframe id="dialogIframBG" name="dialogIframBG" frameborder="0" marginheight="0" marginwidth="0" hspace="0" vspace="0" scrolling="no" style="position:absolute;z-index:19997;display:none;"></iframe>\
	';
	
	var sBG = '\
		<div id="dialogBoxBG" style="position:absolute;top:0px;left:0px;width:100%;height:100%;"></div>\
	';
	
	this.init = function()
	{
		$('dialogCase') ? $('dialogCase').parentNode.removeChild($('dialogCase')) : function(){};
		var oDiv = document.createElement('span');
		oDiv.id = "dialogCase";
		if (!is_opera)
		{
			oDiv.innerHTML = sBG + sIfram + sBox;
		}
		else
		{
			oDiv.innerHTML = sBG + sBox;
		}
		document.body.appendChild(oDiv);
	}

	this.open = function(_sUrl)
	{		
		this.show();
		var openIframe = "<iframe width='100%' height='100%' name='iframe_parent' id='iframe_parent' src='" + _sUrl + "' frameborder='0' scrolling='no'></iframe>";
		myInnerHTML('dialogBody', openIframe);
	}

	this.show = function()
	{
		this.middle('dialogBox');
		if ($('dialogIframBG'))
		{
			$('dialogIframBG').style.top = $('dialogBox').style.top;
			$('dialogIframBG').style.left = $('dialogBox').style.left;
			$('dialogIframBG').style.width = $('dialogBox').offsetWidth + "px";
			$('dialogIframBG').style.height = $('dialogBox').offsetHeight + "px";
			$('dialogIframBG').style.display = 'block';
		}
		if (!is_opera) {
			this.shadow();
		}
	}
	
	this.reset = function()
	{
		this.close();
	}

	this.close = function()
	{
		if (window.removeEventListener) 
		{
			window.removeEventListener('resize', this.event_b, false);
			window.removeEventListener('scroll', this.event_b, false);
		} 
		else if (window.detachEvent) 
		{
			try {
				window.detachEvent('onresize', this.event_b);
				window.detachEvent('onscroll', this.event_b);
			} catch (e) {}
		}
		if ($('dialogIframBG')) {
			$('dialogIframBG').style.display = 'none';
		}
		$('dialogBox').style.display='none';
		$('dialogBoxBG').style.display='none';
		$('dialogBoxShadow').style.display = "none";
		if (typeof(parent.onDialogClose) == "function")
		{
			parent.onDialogClose($('dialogBoxTitle').innerHTML);
		}
	}

	this.shadow = function()
	{
		this.event_b_show();
		if (window.attachEvent)
		{
			window.attachEvent('onresize', this.event_b);
			window.attachEvent('onscroll', this.event_b);
		}
		else
		{
			window.addEventListener('resize', this.event_b, false);
			window.addEventListener('scroll', this.event_b, false);
		}
	}
	
	this.event_b = function()
	{
		var oShadow = $('dialogBoxShadow');
		
		if (oShadow.style.display != "none")
		{
			if (this.event_b_show)
			{
				this.event_b_show();
			}
		}
	}
	
	this.event_b_show = function()
	{
		var oShadow = $('dialogBoxShadow');
		oShadow['style']['position'] = "absolute";
		oShadow['style']['display']	= "";		
		oShadow['style']['opacity']	= "0.2";
		oShadow['style']['filter'] = "alpha(opacity=20)";
		oShadow['style']['background']	= "#000";
		var sClientWidth = parent ? parent.document.body.offsetWidth : document.body.offsetWidth;
		var sClientHeight = parent ? parent.document.body.offsetHeight : document.body.offsetHeight;
		var sScrollTop = parent ? (parent.document.body.scrollTop+parent.document.documentElement.scrollTop) : (document.body.scrollTop+document.documentElement.scrollTop);
		oShadow['style']['top'] = '0px';
		oShadow['style']['left'] = '0px';
		oShadow['style']['width'] = sClientWidth + "px";
		oShadow['style']['height'] = (sClientHeight + sScrollTop) + "px";
	}

	this.middle = function(_sId)
	{
		$(_sId)['style']['display'] = '';
		$(_sId)['style']['position'] = "absolute";

		var sClientWidth = parent.document.body.clientWidth;
		var sClientHeight = parent.document.body.clientHeight;
		var sScrollTop = parent.document.body.scrollTop+parent.document.documentElement.scrollTop;

		var sleft = (sClientWidth - $(_sId).offsetWidth) / 2;
		var iTop = sScrollTop + 80;
		var sTop = iTop > 0 ? iTop : 0;

		$(_sId)['style']['left'] = sleft + "px";
		$(_sId)['style']['top'] = sTop + "px";
	}
}

function openWindow(_sUrl, _sWidth, _sHeight, _sTitle /*,_sNeedHead*/)
{
	if(typeof arguments[4] != "undefined")
	{
		var oEdit = new dialog(_sWidth, _sHeight, _sTitle, arguments[4]);
	}
	else
	{
		var oEdit = new dialog(_sWidth, _sHeight, _sTitle);
	}
	oEdit.init();
	oEdit.open(_sUrl);
}

function openAlert(_sWord, _sButton , _sWidth, _sHeight, _sTitle , _sAction, _sButton2, _sAction2)
{
	return _openAlert(_sWord, _sButton , _sWidth, _sHeight, _sTitle , _sAction, "", _sButton2, _sAction2);
}

function openAlertBlue(_sWord, _sButton , _sWidth, _sHeight, _sTitle , _sAction)
{
	var excss = '.rbs1{border:1px solid #d7e7fe; float:left;}\n' +
'.rb1-12,.rb2-12{height:23px; color:#fff; font-size:12px; background:#355582; padding:3px 5px; border-left:1px solid #fff; border-top:1px solid #fff; border-right:1px solid #6a6a6a; border-bottom:1px solid #6a6a6a; cursor:pointer;}\n' +
'.rb2-12{background:#355582;}\n';
	return _openAlert(_sWord, _sButton , _sWidth, _sHeight, _sTitle , _sAction, excss);
}

function _openAlert(_sWord, _sButton , _sWidth, _sHeight, _sTitle , _sAction, _excss, _sButton2, _sAction2)
{
	var oEdit = new dialog(_sWidth, _sHeight, _sTitle);
	oEdit.init();
	oEdit.show();
	var framename = "iframe_parent_" + g_iframeno++;
	
	g_dialog_sWord = _sWord;
	g_dialog_sButton = _sButton;
	g_dialog_sAction = _sAction;
	g_dialog_excss = _excss;
	g_dialog_sButton2 = _sButton2;
	g_dialog_sAction2 = _sAction2;
	
	var openIframe = "<iframe width='100%' height='100%' name='"+framename+"' id='"+framename+"' src='http://www.kaixin001.com/interface/diablank.php' frameborder='0' scrolling='no' onload=\"javascript:_openAlert_write('" + framename + "')\"></iframe>";
	myInnerHTML('dialogBody', openIframe);

	//setTimeout("", 0);
}

function _openAlert_write(framename)
{
	var _sWord = g_dialog_sWord;
	var _sButton = g_dialog_sButton;
	var _sAction = g_dialog_sAction;
	var _sButton2 = g_dialog_sButton2;
	var _sAction2 = g_dialog_sAction2;
	var _excss = g_dialog_excss;
		
	var iframe = window.frames[framename];
	if (_excss && _excss.length)
	{
		
		 try
	    {
	        iframe.document.getElementsByTagName('head').item(0).innerHTML += '<style>'+_excss + '</style>';
	    }
	    catch(exc)
	    {
			var ss = iframe.document.createElement('style');
		    ss.type="text/css";
		    ss.styleSheet.cssText= _excss;
		    iframe.document.getElementsByTagName('head').item(0).appendChild(ss);		    
	    }	    		
	}
	if(_sAction == undefined)
	{
		_sAction = "new parent.dialog().reset();";
	}
	iframe.document.body.innerHTML = alertHtml(_sWord , _sButton , _sAction, _sButton2, _sAction2);
}

function alertHtml(_sWord , _sButton , _sAction, _sButton2, _sAction2)
{
	var html = "";
	
	var html = '<div class="ts4">\
			<div class="ts45" style="border-top:none;padding-top:0;">\
				 '+_sWord+'\
				<div class="c"></div>\
			</div>\
			<div class="ts42 r">\
				<div class="rbs1"><input type="button" style="width:65px;" value="'+_sButton+'" title="'+_sButton+'" class="rb1-12" onmouseover="this.className=\'rb2-12\';" onmouseout="this.className=\'rb1-12\';" onclick="javascript:'+_sAction+'" /></div>';
	
	if (typeof(_sButton2) != "undefined")
	{
		if (typeof(_sAction2) == "undefined")
		{
			_sAction2 = "new parent.dialog().reset();";
		}
		html += '<div class="flw5">&nbsp;</div><div class="rbs1"><input type="button" style="width:65px;" value="'+_sButton2+'" title="'+_sButton2+'" class="rb1-12" onmouseover="this.className=\'rb2-12\';" onmouseout="this.className=\'rb1-12\';" onclick="javascript:'+_sAction2+'" /></div>';
	}
	html += '<div class="c"></div></div>';
	html += '</div>';
	return html;
}
