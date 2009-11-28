
var facetitle = ["大笑","微笑","亲亲","抱抱","色色","好失望哟","好困哦","害羞","酷呆了","晕倒","眨眼","鬼脸","小声点",
"吃惊","翻白眼","干杯","困惑","啥？","睡觉","再见了","眼泪哗哗地","你好讨厌","我吐","怒骂","闭嘴","打你",
"真的生气了","超级棒","不咋地","魅力四射","心都碎了","爱","吻","玫瑰凋谢了","玫瑰盛开了","生日蛋糕","礼物","苹果","西瓜",
"咖啡","足球","握手","星星","精灵","小丑","大怒","生病了","小可爱","小心非典","嘴馋了","警察","抓狂了",
"不爽","汗","思考中","见钱眼开","呲牙","晕头转向","好好爱你哦","猪头","便便","月亮","音乐","饭","真衰",
"偷笑","下雨","猫猫","狗狗","骷髅","书呆子","太阳","邮件","帅帅男孩","妩媚女孩","药丸","鄙视","烧香", 
"呲牙咧嘴", "拜拜", "奋斗", "嗯", "胜利", "作揖", "OK", "地雷", "菜刀", "鼓掌", "哼哼", "可怜", "委屈", "糗大了", 
"阴险", "傲慢", "快哭了", "泪流满面", "示爱", "坏笑"];

//浏览器类型
var e_isOpera = false;
var e_isIE = false;
var e_isFF = false;
//工具按钮开关
var e_bold = true;
var e_italic = true;
var e_underline = true;
var e_JustifyLeft = false;
var e_JustifyCenter = false;
var e_JustifyRight = false;
var e_InsertUnorderedList=false;
var e_InsertOrderedList=false;
var e_font = true;
var e_fontsize = true;
var e_color = true;
var e_backcolor = false;
var e_img = true;
var e_link = true;
var e_media = true;
var e_audio = false;
var e_face = true;
var e_uploadimg = false;
var e_piclink = false;
var e_grppiclink = false;
var e_iframeno = 0;
var e_toolbarbg = "#ffffff";

var g_gid = 0;
var g_inputchange = 0;

//回调函数
var e_onkeypress = null;
var e_onkeydown = null;
var e_onkeyup = null;
var e_init_content = "";
var e_onwebeditfocus = null;

function webEditor(id,editorArea,width,height,toolbarpos)
{
	//初始化变量
	this.iframeno = e_iframeno++;
	this.id = id;
	this.editorArea = editorArea;
	this.width = width;
	this.height = height;
	this.toolbarpos = toolbarpos;
	//组件
	this.toolbar = null;
	this.iframe = null;
	this.textArea = null;
	//信号量
	this.range = null;
	this.seltype = null;
	this.openPanel = '';
	//上传图片文件
	this.uploadfile = "";
	//相册图片
	this.picfile = "";
	//群相册图片
	this.grppicfile = "";

	this.autoclose_timer = null;
}

function gEditor_SetInputTime()
{
	var now = new Date();
	g_inputtime = now.getTime();	
}

webEditor.prototype.$ = function(s)
{
	if(document.getElementById)
	{
		return eval('document.getElementById("' + s + '")');
	}
	else
	{
		return eval('document.all.' + s);
	}
}

webEditor.prototype.getUA = function()
{
	var UA = navigator.userAgent.toLowerCase();
	e_isOpera  = (UA.indexOf('opera') != -1);
	e_isFF = (UA.indexOf('firefox')!= -1);
	e_isIE = document.all ? true : false;
}

webEditor.prototype.drawEditor = function()
{
	var htmlstr;
	
	if(e_isOpera)
	{
		htmlstr = '<textarea style="font-size:14px;width:'+this.width+'px;height:'+this.height+'px;" id="'+this.id+'_aid" name="'+this.id+'_aid"></textarea>';
	}
	else
	{
		var framename = this.id+'_fid_'+(++this.iframeno);
		if (this.toolbarpos == "right")
		{
			htmlstr = '<div id="'+this.id+'_eid" style="float:left;border:1px #808080 solid;width:'+(this.width-50)+'px;height:'+this.height+'px;"><div class="it1"><iframe id="'+framename+'" name="'+framename+'" style="width:'+(this.width-50-2)+'px; height: '+(this.height-2)+'px;" frameborder=0 marginwidth=0 scrolling=auto src="http://www.kaixin001.com/interface/blank.php" onfocus="javascript:'+this.id+'.iframeOnfocus();" onblur="javascript:'+this.id+'.iframeOnblur();" onload="javascript:'+this.id+'.postInit();"></iframe></div></div><div id="'+this.id+'_tid" style="float:left;background-color:'+e_toolbarbg+';"></div><div style="clear:both;"></div>';
		}
		else
		{
			htmlstr = '<div id="'+this.id+'_tid" style="width:'+(this.width+2)+'px;background-color:'+e_toolbarbg+';"></div>'
				+'<div id="'+this.id+'_eid" style="border:1px #808080 solid;width:'+this.width+'px;height:'+this.height+'px;"><div class="it1"><iframe id="'+framename+'" name="'+framename+'" style="width:'+(this.width-2)+'px; height: '+(this.height-2)+'px;" frameborder=0 marginwidth=0 scrolling=auto src="http://www.kaixin001.com/interface/blank.php" onfocus="javascript:'+this.id+'.iframeOnfocus();" onblur="javascript:'+this.id+'.iframeOnblur();" onload="javascript:'+this.id+'.postInit();"></iframe></div></div>';
		}
	}
	this.editorArea.innerHTML = htmlstr;
}

webEditor.prototype.iframeOnfocus = function()
{
	this.$(this.id+"_eid").childNodes[0].className = "it2";
	g_inputchange = setInterval(gEditor_SetInputTime, 1000);

	if (typeof(e_onwebeditfocus) == "function")
	{
		e_onwebeditfocus();
	}
}

webEditor.prototype.iframeOnblur = function()
{
	if(!this.range)
	{
		this.$(this.id+"_eid").childNodes[0].className = "it1";
	}
	if(g_inputchange)
	{
		clearInterval(g_inputchange);
	}
}

webEditor.prototype.genObj = function()
{
	if(e_isOpera)
	{
		this.textArea = this.$(this.id+'_aid');
	}
	else
	{
		this.toolbar = this.$(this.id+'_tid');
		var framename = this.id+'_fid_'+this.iframeno;
		this.iframe= window.frames[framename];
	}
}

webEditor.prototype.setText = function(str)
{
	if(typeof str=='undefined')
	{
		str = "";
	}
	return "<html><head><style type=\"text/css\">body {background: #ffffff; margin:1px; padding:1px; font-size:14px; overflow:auto;word-wrap: break-word; font-family: Arial, '宋体';} p {padding: 0px; margin: 0px; } </style><script type='text/javascript'>document.domain='kaixin001.com';</script></head><body>"+str+"</body></html>";
}

webEditor.prototype.setKeypressHandler = function (keyHandler)
{
	var frameobj = this.iframe;
	var doc = frameobj.document;
	if (doc && keyHandler)
	{
		if (doc.addEventListener)
		{
			doc.addEventListener(
				'keypress',
				keyHandler,
				false
			);
		}
		else if (doc.attachEvent)
		{
			doc.attachEvent(
				'onkeypress',
				function () { keyHandler(frameobj.event); }
			);
		}
		else
		{
			doc.onkeypress = keyHandler;
		}
	}
}
webEditor.prototype.setKeydownHandler = function (keyHandler)
{
	var frameobj = this.iframe;
	var doc = frameobj.document;
	if (doc && keyHandler)
	{
		if (doc.addEventListener)
		{
			doc.addEventListener(
				'keydown',
				keyHandler,
				false
			);
		}
		else if (doc.attachEvent)
		{
			doc.attachEvent(
				'onkeydown',
				function () { keyHandler(frameobj.event); }
			);
		}
		else
		{
			doc.onkeydown = keyHandler;
		}
	}
}
webEditor.prototype.setKeyupHandler = function (keyHandler)
{
	var frameobj = this.iframe;
	var doc = frameobj.document;
	if (doc && keyHandler)
	{
		if (doc.addEventListener)
		{
			doc.addEventListener(
				'keyup',
				keyHandler,
				false
			);
		}
		else if (doc.attachEvent)
		{
			doc.attachEvent(
				'onkeyup',
				function () { keyHandler(frameobj.event); }
			);
		}
		else
		{
			doc.onkeyup = keyHandler;
		}
	}
}

webEditor.prototype.init = function(str)
{
	this.getUA();
	e_init_content = str;
	this.drawEditor();	
	if(e_isOpera)
	{
		this.genObj();
		this.textArea.value = e_init_content;
		return;
	}
}

webEditor.prototype.postInit = function()
{
	if(e_isOpera)
	{
		return;
	}
	this.genObj();
	
	if(e_isIE)
	{
		this.iframe.document.body.innerHTML = e_init_content;
		this.iframe.document.body.contentEditable = true ;
	}
	else
	{
		this.iframe.document.body.innerHTML = e_init_content;
		this.iframe.document.designMode = "On";
		this.iframe.document.contentEditable = true;
	}	
	this.createToolBar();
	this.setKeypressHandler(e_onkeypress);
	this.setKeyupHandler(e_onkeyup);
	this.setKeydownHandler(e_onkeydown);
}

webEditor.prototype.getText = function()
{
	if(e_isOpera)
	{
		return this.textArea.value;
	}
	else if (e_isIE)
	{
		return this.iframe.document.body.innerText;
	}
	else
	{
		return this.iframe.document.body.innerHTML;
	}
}

webEditor.prototype.setContent = function(str)
{
	if(e_isOpera)
	{
		this.textArea.value = str;
	}
	else
	{
		this.iframe.document.body.innerHTML = str;
	}
}

webEditor.prototype.getHtml = function()
{
	if(e_isOpera)
	{
		return this.textArea.value;
	}
	var return_html =  this.iframe.document.body.innerHTML;
	if(return_html.toLowerCase()=="<p>&nbsp;</p>"
		|| return_html.toLowerCase()=="<br/>"
		|| return_html.toLowerCase()=="<br />"
		|| return_html.toLowerCase()=="<br>")
		return '';
	//ie
	return_html = return_html.replace(/<IMG style=\"WIDTH: (\d*)px; HEIGHT: (\d*)px\"[^<]*src=(\"[^\"]+\")[^<]*>/gi, '<img width=$1 height=$2 src=$3>');
	//firefox
        return_html = return_html.replace(/<img style=\"width: (\d*)px; height: (\d*)px;\"[^<]*src=(\"[^\"]+\")[^<]*>/gi, '<img width=$1 height=$2 src=$3>');
	return return_html;
}

webEditor.prototype.getFocus = function()
{
	if(e_isOpera)
	{
		this.textArea.focus();
	}
	else
	{
		this.iframe.focus();
	}
}

webEditor.prototype.getTextType = function()
{
	if(e_isOpera)
	{
		return "plain";
	}
	else
	{	
		return "html";
	}
}

webEditor.prototype.selectBegin = function()
{
	this.iframe.focus();
	if (e_isIE)
	{
		this.range = this.iframe.document.selection.createRange();
		this.seltype = this.iframe.document.selection.type;
	}
}

webEditor.prototype.drawPanel = function(inner,name)
{
	var pid = this.id + "_" + name;
	if(this.openPanel !='')
	{
		this.removePanel(this.openPanel);
	}
	this.openPanel = pid;
	tdiv=document.createElement("div");
	tdiv.id = pid;
	tdiv.innerHTML=inner;	
	tdiv.style.display="block";	
	tdiv.style.position="absolute";	

	var btn_ele = this.id+"_"+name+'_icon';
	var btn = ((btn_ele=='')?this.$(this.id+'_eid'):this.$(btn_ele));
	var btn_pos = b_getAbsolutePos(btn);
	tdiv.style.top = ((btn_ele=='')?btn_pos.top:(btn_pos.top+28)) + "px";
	tdiv.style.left = (btn_pos.left+1) + "px";
	document.body.appendChild(tdiv);
	tdiv.focus();
}

webEditor.prototype.removePanel = function(panelid)
{
	if(this.$(panelid))
	{
		document.body.removeChild(this.$(panelid));
		if(e_isIE && this.range && this.seltype != "Control")
		{
			this.range.select();
		}
		this.range = null;
	}
}

webEditor.prototype.autoClose = function(pid)
{
	this.autoclose_timer = setTimeout(this.id+".removePanel('"+pid+"')", 2000);
}

// onmouseout模拟onmouseleave效果
webEditor.prototype.autoClose2 = function(event, pid)
{
	if (IsIE()) return;
	if( ! event.relatedTarget || event.relatedTarget==event.currentTarget || event.relatedTarget.descendantOf(event.currentTarget)) return;

	this.autoClose(pid);
}

webEditor.prototype.removeAutoClose = function(pid)
{
	if (this.autoclose_timer)
	{
		clearTimeout(this.autoclose_timer);
	}
}

// onmouseover模拟onmouseenter效果
webEditor.prototype.removeAutoClose2 = function(event)
{
	if (IsIE()) return;
	if( ! event.relatedTarget || event.relatedTarget==event.currentTarget || event.relatedTarget.descendantOf(event.currentTarget)) return;

	this.removeAutoClose();
}

function e_swapImgRestore() 
{
	var i,x,a=document.e_sr; 
	for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) 
		x.src=x.oSrc;
}

function e_findObj(n, d) 
{
	var p,i,x;  
	if(!d) 
		d=document; 
	if((p=n.indexOf("?"))>0&&parent.frames.length)
	{
		d=parent.frames[n.substring(p+1)].document; 
		n=n.substring(0,p);
	}
	if(!(x=d[n])&&d.all) 
		x=d.all[n]; 
	for (i=0;!x&&i<d.forms.length;i++) 
		x=d.forms[i][n];
	for(i=0;!x&&d.layers&&i<d.layers.length;i++) 
		x=e_findObj(n,d.layers[i].document);
	if(!x && d.getElementById) 
		x=d.getElementById(n); 
	return x;
}

function e_swapImage() 
{
	var i,j=0,x,a=e_swapImage.arguments; 
	document.e_sr=new Array; 
	for(i=0;i<(a.length-2);i+=3)
		if ((x=e_findObj(a[i]))!=null)
		{
			document.e_sr[j++]=x; 
			if(!x.oSrc) 
				x.oSrc=x.src; 
			x.src=a[i+2];
		}
}

webEditor.prototype.createToolBar = function()
{
	var str ='<table ellpadding="0"cellspacing="0"><tr>';
	//字体
	str +=(e_font?'<td width="42"><div id="'+this.id+'_fontname_icon" onclick="javascript:'+this.id+'.fontPanel();" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'font\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/e1_2.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/e1_2.gif" name="font" border="0" title="字体" alt="字体"></div></td>':'');
	//字体大小
	str +=(e_fontsize?'<td width="42"><div id="'+this.id+'_fontsize_icon" onclick="javascript:'+this.id+'.fontsizePanel();" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'fontsize\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/e2_1.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/e2_1.gif" name="fontsize" border="0" title="字体大小" alt="字体大小"></div></td>':'');
	//字体颜色
	str +=(e_color?'<td width="29"><div id="'+this.id+'_forecolor_icon" onclick="javascript:'+this.id+'.colorPanel();" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'color\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/e3_2.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/e3_2.gif" name="color" border="0" title="字体颜色" alt="字体颜色"></div></td>':'');
	//背景颜色
	str +=(e_backcolor?'<td width="29"><div id="'+this.id+'_backcolor_icon" onclick="javascript:'+this.id+'.backcolorPanel();" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'backcolor\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/e4_2.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/e4_2.gif" name="backcolor" border="0" title="背景颜色" alt="背景颜色"></div></td>':'');
	//加粗
	str +=(e_bold?'<td width="18"><div onclick="javascript:'+this.id+'.setStyle(\'bold\');" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'bold\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/e5_1.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/e5_1.gif" name="bold" border="0" title="加粗" alt="加粗"></div></td>':'');
	//斜体
	str +=(e_italic?'<td width="18"><div onclick="javascript:'+this.id+'.setStyle(\'italic\');" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'italic\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/e6_1.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/e6_1.gif" name="italic" border="0" title="斜体" alt="斜体"></div></td>':'');
	//下划线
	str +=(e_underline?'<td width="18"><div onclick="javascript:'+this.id+'.setStyle(\'underline\');" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'underline\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/e7_1.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/e7_1.gif" name="underline" border="0" title="下划线" alt="下划线"></div></td>':'');
	//左对齐
	str +=(e_JustifyLeft?'<td width="18"><div onclick="javascript:'+this.id+'.setStyle(\'JustifyLeft\');" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'JustifyLeft\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/ee1_1.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/ee1_1.gif" name="JustifyLeft" border="0" title="左对齐" alt="左对齐"></div></td>':'');
	//居中
	str +=(e_JustifyCenter?'<td width="18"><div onclick="javascript:'+this.id+'.setStyle(\'JustifyCenter\');" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'JustifyCenter\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/ee2_1.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/ee2_1.gif" name="JustifyCenter" border="0" title="居中" alt="居中"></div></td>':'');
	//右对齐
	str +=(e_JustifyRight?'<td width="18"><div onclick="javascript:'+this.id+'.setStyle(\'JustifyRight\');" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'JustifyRight\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/ee3_1.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/ee3_1.gif" name="JustifyRight" border="0" title="右对齐" alt="右对齐"></div></td>':'');
	//无序列表
	str +=(e_InsertUnorderedList?'<td width="18"><div onclick="javascript:'+this.id+'.setStyle(\'InsertUnorderedList\');" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'InsertUnorderedList\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/ee4_1.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/ee4_1.gif" name="InsertUnorderedList" border="0" title="无序列表" alt="无序列表"></div></td>':'');
	//有序列表
	str +=(e_InsertOrderedList?'<td width="18"><div onclick="javascript:'+this.id+'.setStyle(\'InsertOrderedList\');" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'InsertOrderedList\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/ee5_1.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/ee5_1.gif" name="InsertOrderedList" border="0" title="有序列表" alt="有序列表"></div></td>':'');
	//效果字
	//str +=(e_effect?'<td width="18"><div onclick="javascript:'+this.id+'.textEdit(\'effect\');" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'underline\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/e8_1.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/e8_1.gif" name="effect" border="0"></div></td>':'');
	//分隔
	//str +='<td width="6" align="center">&nbsp;</td>';
	//添加图片
	str +=(e_img?'<td width="18"><div id="'+this.id+'_image_icon" onclick="javascript:'+this.id+'.imagePanel();" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'image\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/e9_1.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/e9_1.gif" name="image" border="0" title="添加图片" alt="添加图片"></div></td>':'');
	//添加视频
	str +=(e_media?'<td width="18"><div id="'+this.id+'_media_icon" onclick="javascript:'+this.id+'.mediaPanel(\''+this.id+'_btn_media\');" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'media\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/ea_1.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/ea_1.gif" name="media" border="0" title="添加视频" alt="添加视频"></div></td>':'');
	//添加音频
	str +=(e_audio?'<td width="18"><div id="'+this.id+'_audio_icon" onclick="javascript:'+this.id+'.audioPanel(\''+this.id+'_btn_audio\');" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'audio\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/ed_1.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/ed_1.gif" name="audio" border="0" title="添加音频" alt="添加音频"></div></td>':'');
	//添加链接
	str +=(e_link?'<td width="18"><div id="'+this.id+'_link_icon" onclick="javascript:'+this.id+'.linkPanel();" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'link\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/eb_1.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/eb_1.gif" name="link" border="0" title="添加链接" alt="添加链接"></div></td>':'');
	//表情
	str +=(e_face?'<td width="29"><div id="'+this.id+'_face_icon" onclick="javascript:'+this.id+'.facePanel();" onMouseOut="e_swapImgRestore()" onMouseOver="e_swapImage(\'face\',\'\',\'http://img1.kaixin001.com.cn/js/webeditor/i/ec_1.gif\',0)"><img src="http://img1.kaixin001.com.cn/js/webeditor/i/ec_1.gif" name="face" border="0" title="表情" alt="表情"></div></td>':'');
	str +='</tr></table>';
	this.toolbar.innerHTML = str;
}

webEditor.prototype.insertHTML = function(html)
{
	if (e_isIE)
	{
		if (!this.range)
		{
			this.selectBegin();
		}
		if(this.range && this.seltype != "Control")
		{
			this.range.pasteHTML(html);
			this.range.select();
		}
		this.range = null;
	}
	else
	{
		this.iframe.document.execCommand("insertHTML", false, html);
		this.iframe.focus();
	}
}

webEditor.prototype.facePanel = function()
{
	this.selectBegin();

	if(this.$(this.id + '_face'))
	{
		document.body.removeChild(this.$(this.id + '_face'));
		return;
	}
	var pContent = '';

	pContent += '<div onmouseenter="javascript:'+this.id+'.removeAutoClose();" onmouseover="javascript:'+this.id+'.removeAutoClose2(event);" onmouseleave="javascript:'+this.id+'.autoClose(\''+this.id+'_face\')" onmouseout="javascript:'+this.id+'.autoClose2(event, \''+this.id+'_face\')" class="face_bg" id="ec">';
	pContent += '<div class="face_cont">';
	pContent += '<div id="BQcon0" style="display:block;">';
	for (i=0; i<6; i++)
	{
		for (j=1; j<=13; j++)
		{
			var tt = (i*13+j).toString();
			var t='http://img1.kaixin001.com.cn/i/face/'+tt+'.gif';
			pContent += '<div class="emo_of" onmouseover="this.className=\'emo_on\';" onmouseout="this.className=\'emo_of\';" onclick="javascript:'+this.id+'.insFace(\''+t+'\');"><img src="'+t+'" title="'+facetitle[i*13+j-1]+'" width="19" height="19" /></div>';
		}
	}
	pContent += '<div class="c"></div></div>';
	pContent += '<div id="BQcon1" style="display:none;">';
	for (i=0; i<6; i++)
	{
		for (j=1; j<=13; j++)
		{
			if (i*13+j+78 > facetitle.length)
			{
				pContent += '<div class="emo_blank">&nbsp;</div>';
			}
			else
			{
				var tt = (i*13+j+78).toString();
				var t = 'http://img1.kaixin001.com.cn/i/face/'+tt+'.gif';
				pContent += '<div onclick="javascript:'+this.id+'.insFace(\''+t+'\');" onmouseout="this.className=\'emo_of2\';" onmouseover="this.className=\'emo_on2\';" class="emo_of2"><img height="23" width="23" title="'+facetitle[i*13+j+78-1]+'" src="'+t+'" /></div>';
			}
		}
	}
	pContent += '<div class="c"></div></div>';

	pContent += '<div class="fp_area">';
	pContent += '<div class="fp_btn" id="'+this.id+'_fp_btn">';
	pContent += '<p class="fp_bg">上页</p>';
	pContent += '<p class="next_bg1" onmouseover="this.className=\'next_bg2\';" onmouseout="this.className=\'next_bg1\';"><a href="javascript:'+this.id+'.facePanelSwitch(1);" class="sl2">下页</a></p>';
	pContent += '</div>';
	pContent += '<div class="fp_close">[<a href="javascript:'+this.id+'.facePanel();" class="sl2">关闭</a>]</div>';
	pContent += '<div class="c"></div></div>';
	pContent += '</div>';
	pContent += '</div>';
	this.drawPanel(pContent,'face');
}

webEditor.prototype.facePanelSwitch = function(index)
{
	if (index == 1)
	{
		h("BQcon0");
		s("BQcon1");
		this.$(this.id+'_fp_btn').innerHTML = '<p class="pre_bg1" onmouseover="this.className=\'pre_bg2\';" onmouseout="this.className=\'pre_bg1\';"><a href="javascript:'+this.id+'.facePanelSwitch(0);" class="sl2">上页</a></p><p class="lp_bg">下页</p>';
	}
	else
	{
		h("BQcon1");
		s("BQcon0");
		this.$(this.id+'_fp_btn').innerHTML = '<p class="fp_bg">上页</p><p class="next_bg1" onmouseover="this.className=\'next_bg2\';" onmouseout="this.className=\'next_bg1\';"><a href="javascript:'+this.id+'.facePanelSwitch(1);" class="sl2">下页</a></p>';
	}
}

webEditor.prototype.insFace = function(img)
{
	var arr = img.split('/');
	arr = arr[arr.length-1].split('.');
	var order = arr[0];

	var str = '';
	if (img != '')
	{
		str = "<img src='"+img+"' title='"+facetitle[order-1]+"' border=0>";
	}
	
	this.insertHTML(str);
	
	this.removePanel(this.id +'_face');
}


webEditor.prototype.colorPanel = function()
{
	this.selectBegin();
	
	if(this.$(this.id+'_forecolor'))
	{
		this.removePanel(this.id+'_forecolor');
		return;
	}
	
	var color_set =new Array(
		new Array("#333333","#000000","#993300","#333300","#003300","#003366","#000080","#333399"),
		new Array("#808080","#800000","#ff6600","#808000","#008000","#008080","#0000ff","#666699"),
		new Array("#999999","#ff0000","#ff9900","#99cc00","#339966","#33cccc","#3366ff","#800080"), 
		new Array("#c0c0c0","#ff00ff","#ffcc00","#ffff00","#00ff00","#00ffff","#00ccff","#993366"),
		new Array("#ffffff","#ff99cc","#ffcc99","#ffff99","#ccffcc","#F4F9FD","#99ccff","#cc99ff")
	);
	var cContent = '';
	
	cContent +='<div class="e_d1" id="e3" onmouseleave="javascript:'+this.id+'.autoClose(\''+this.id+'_forecolor\')"><div class="e_d2"><div class="e_d3"><div class="e_d4"><div class="sk" >';
	
	for(i=0;i<5;i++)
	{
		for(j=0;j<8;j++)
		{
			cContent += '<div class="sk_of" onmouseover="this.className=\'sk_on\';" onmouseout="this.className=\'sk_of\';" onclick="javascript:'+this.id+'.setStyle(\'forecolor\' , \''+color_set[i][j]+'\');"><div class="sk_sk" style="background:'+color_set[i][j]+';"></div></div>';
		}
	}
	cContent +='<div class="c"></div>  </div></div></div></div></div>';
	this.drawPanel(cContent,'forecolor');
}

webEditor.prototype.backcolorPanel = function()
{
	this.selectBegin();
	
	if(this.$(this.id+'_backcolor'))
	{
		this.removePanel(this.id+'_backcolor');
		return;
	}
	
	var color_set =new Array(
		new Array("#000000","#cc0000","#ff0090","#993300","#333300","#003300","#000080","#666699"),
		new Array("#666666","#ff0000","#ff00cc","#ff6600","#808000","#008000","#0000ff","#800080"),
		new Array("#999999","#ff8080","#fc85c8","#ff9900","#99cc00","#339966","#3366ff","#993366"), 
		new Array("#cccccc","#fedbdb","#fdbaf0","#ffcc00","#ffff00","#00ff00","#00ccff","#cc99ff"),
		new Array("#ffffff","#fdeeee","#fbe2f6","#ffe9c7","#ffff99","#ccffcc","#bcdcfd","#ead8fc")
	);
	var cContent = '';
	
	cContent +='<div class="e_d1" id="e3" onmouseleave="javascript:'+this.id+'.autoClose(\''+this.id+'_backcolor\')"><div class="e_d2"><div class="e_d3"><div class="e_d4"><div class="sk">';
	
	for(i=0;i<5;i++)
	{
		for(j=0;j<8;j++)
		{
			cContent += '<div class="sk_of" onmouseover="this.className=\'sk_on\';" onmouseout="this.className=\'sk_of\';" onclick="javascript:'+this.id+'.setStyle(\'backcolor\' , \''+color_set[i][j]+'\');"><div class="sk_sk" style="background:'+color_set[i][j]+';"></div></div>';
		}
	}
	cContent +='<div class="c"></div>  </div></div></div></div></div>';
	this.drawPanel(cContent,'backcolor');
}

webEditor.prototype.linkPanel = function()
{
	this.selectBegin();
	
	if(this.$(this.id+'_link'))
	{
		this.removePanel(this.id+'_link');
		return;
	}
	lContent = '';
	lContent += '<div class="e_d1" id="eb">\n';
	lContent += '<div class="e_d2">\n';
	lContent += '<div class="e_d3">\n';
	lContent += '<div class="e_d4">\n';
	lContent += '<div>请输入选择文字的链接地址</div>\n';
	lContent += '<div><span class="it_s"><input id="'+this.id+'_link_input" type="text" value="http://" style="width:200px;" class="it1" onfocus="this.className=\'it2\';" onblur="this.className=\'it1\';" /></span></div>\n';
	lContent += '<div class="e_d5" style="width:100%">\n';
	lContent += '<span class="e_d51"><input type="button" id="btn_qd" value="确定" title="确定" class="e_d51_of" onmouseover="this.className=\'e_d51_on\';" onmouseout="this.className=\'e_d51_of\';" onclick="javascript:'+this.id+'.insLink();" /></span>\n';
	lContent += '&nbsp;<span class="e_d52"><input type="button" id="btn_qx" value="取消" title="取消" class="e_d52_of" onmouseover="this.className=\'e_d52_on\';" onmouseout="this.className=\'e_d52_of\';" onclick="javascript:'+this.id+'.removePanel(\''+this.id+'_link\');" /></span>\n';
	lContent += '</div>\n';
	lContent += '</div>\n';
	lContent += '</div>\n';
	lContent += '</div>\n';
	lContent += '</div>\n';

	this.drawPanel(lContent,'link');
}

webEditor.prototype.verifyurl = function(obj, url, caller) {
	var target = "/interface/verifyurl.php";
	var pars = "url="+url;
	var myAjax = new Ajax.Request(target, {method: "post", parameters: pars, onComplete: function (req) { webEditor.prototype.verifyurlComplete(obj, req, url, caller); } });
}

webEditor.prototype.verifyurlComplete = function(obj, req, url, caller) {

	if (req.responseText != "true") {
		var info;
		if (caller == "insAudio") {
			info = "您输入的音频文件地址：["+url+"]可能有误。\n您确定要输入此地址吗？";
		} else {
			info = "您输入的链接地址：["+url+"]有可能是无效地址。\n您确定要输入此地址吗？";
		}
		if (!window.confirm(info)) {
			return false;
		}
	}
	
	if (caller == "insLink") {
		this.insLink(obj, "true");
	} else if (caller == "insMedia") {
		this.insMedia(obj, "true");
	} else if (caller == "insAudio") {
		this.insAudio(obj, "true");
	} else if (caller == "insImage") {
		this.insImage(obj, "true");
	}
}

webEditor.prototype.insSwfFromWeb = function(obj, url) {
	var target = "/interface/getswffromweb.php";
	var pars = "url="+url;
	var myAjax = new Ajax.Request(target, {method: "post", parameters: pars, onComplete: function (req) { webEditor.prototype.insSwfFromWebComplete(obj, url, req); } });
}

webEditor.prototype.insSwfFromWebComplete = function(obj, url, req) {
	mediahtml = "";
	if (req.responseText == "" || req.responseText.indexOf("Warning")>=0) {
		//失败重试
		//obj.insSwfFromWeb(obj, url);
		//return false;

		if (window.confirm("您输入的链接地址：["+url+"]有可能是无效地址。\n您确定要输入此地址吗？")) {
			mediahtml = "<a href=\"" + url + "\" target=\"_blank\">" + url + "</a>";
		}
	} else {
		mediahtml = req.responseText;
	}

	if (mediahtml != "") {
		obj.insertHTML(mediahtml);
	}
	obj.removePanel(obj.id+'_media');
}

webEditor.prototype.insLink = function(obj, verify)
{
	if (verify != "true") {
		var link =this.$(this.id+'_link_input');
		if (link.value != "http://" && link.value != "") {
			this.verifyurl(this, link.value, "insLink");
			return false;
		} else {
			this.removePanel(this.id+'_link');
			return false;
		}
	}

	var link = obj.$(obj.id+'_link_input');
	
	var linkhtml="";
	linkhtml += "<a href=\"" + link.value + "\" target=\"_blank\">";

	if (e_isIE)
	{
		if(obj.range && obj.range.text!="")
			linkhtml += obj.range.text+"</a>"; 
		else
			linkhtml += link.value+"</a>";
	}
	else
	{
		if (obj.iframe.getSelection()!="")
			linkhtml += obj.iframe.getSelection()+"</a>"; 
		else
			linkhtml += link.value+"</a>";
	}
	
	obj.insertHTML(linkhtml);
	
	obj.removePanel(obj.id+'_link');
}

function showpicdlg(instance)
{
	openWindow('/interface/getmypic.php?instance='+instance, 570, 480, '选择照片');
}

function showgrppicdlg(instance)
{
	openWindow('/interface/getgrppic.php?gid='+g_gid+'&instance='+instance, 570, 480, '选择群相册照片');
}

webEditor.prototype.imagePanel = function()
{	
	this.selectBegin();
	if(this.$(this.id+'_image'))
	{
		this.removePanel(this.id+'_image');
		return;
	}

	iContent = '';
	iContent += '<div class="e_d1" id="e9">\n';
	iContent += '<div class="e_d2">\n';
	iContent += '<div class="e_d3">\n';
	iContent += '<div class="e_d4">\n';
	iContent += '<div>方法1：引用互联网上的图片&nbsp;<a target="_blank" href="/s/help_note.html#q3"><img src="http://img1.kaixin001.com.cn/i/help/help_icon.gif" style="margin-top:-3px;*margin-top:0px;" align="absmiddle" title="如何引用互联网上的图片" /></a></div>\n';
	iContent += '<div  style="margin-top:3px;"><span class="it_s"><input id="'+this.id+'_i_link" type="text" value="http://" style="width:200px;" class="it1" onfocus="this.className=\'it2\';" onblur="this.className=\'it1\';" /></span></div>\n';
	if (e_uploadimg)
	{
		iContent += '<div class="e_d43">方法2：上传电脑里的图片</div>\n';
		iContent += '<div><form name='+this.id+'_i_file_form action=/interface/getimg.php method=post enctype="multipart/form-data" target="'+this.id+'_i_file_frame"><input id="'+this.id+'_i_file" type="file" name=img class="it5" /><input type=hidden name=instance value="'+this.id+'"></form><iframe id='+this.id+'_i_file_frame name='+this.id+'_i_file_frame style="display:none;"></iframe></div>\n';
	}
	if(e_piclink)
	{
		iContent += '<div class="mt10">方法3：<a href="###" class="sl" onclick="javascript:showpicdlg(\''+this.id+'\');">插入你相册的照片</a></div>';
	}
	if(e_grppiclink)
	{
		iContent += '<div class="mt10">方法3：<a href="###" class="sl" onclick="javascript:showgrppicdlg(\''+this.id+'\');">插入群相册照片</a></div>';
	}
	iContent += '<div class="e_d5" style="width:100%">\n';
	iContent += '<span class="e_d51"><input type="button" id="btn_qd" value="确定" title="确定" class="e_d51_of" onmouseover="this.className=\'e_d51_on\';" onmouseout="this.className=\'e_d51_of\';" onclick="javascript:'+this.id+'.insImage();" /></span>\n';
	iContent += '&nbsp;<span class="e_d52"><input type="button" id="btn_qx" value="取消" title="取消" class="e_d52_of" onmouseover="this.className=\'e_d52_on\';" onmouseout="this.className=\'e_d52_of\';" onclick="javascript:'+this.id+'.removePanel(\''+this.id+'_image\');" /></span>\n';
	iContent += '</div>\n';
	iContent += '</div>\n';
	iContent += '</div>\n';
	iContent += '</div>\n';
	iContent += '</div>\n';

	this.drawPanel(iContent,'image');
}


webEditor.prototype.showerror = function(v_errno, v_error)
{
	alert(v_error);
	this.removePanel(this.id+'_image');
}

webEditor.prototype.uploadComplete = function(v_link)
{
	this.uploadfile += v_link + ",";
	var imghtml = "<img src='"+v_link+"'>";

	this.insertHTML(imghtml);
	
	this.removePanel(this.id+'_image');
}

webEditor.prototype.selectPicComplete = function(v_link)
{
	this.picfile += v_link + ",";
	var imghtml = "<img src='"+v_link+"'>";

	this.insertHTML(imghtml);
	
	this.removePanel(this.id+'_image');
}

webEditor.prototype.selectGrpPicComplete = function(v_link)
{
	this.grppicfile += v_link + ",";
	var imghtml = "<img src='"+v_link+"'>";

	this.insertHTML(imghtml);
	
	this.removePanel(this.id+'_image');
}


webEditor.prototype.insImage = function(obj, verify)
{
	if (verify != "true") {
		var i_link =this.$(this.id+'_i_link');
		if (i_link.value != "http://" && i_link.value != "" && this.seltype != "Control") {
			this.verifyurl(this, i_link.value, "insImage");
			return false;
		} else {
			this.insImage(this, "true");
			return false;
		}
	}

	var i_link =obj.$(obj.id+'_i_link');
	if (i_link.value != "http://" && i_link.value != "" && obj.seltype != "Control")
	{
		var imghtml = "<img src='"+i_link.value+"'>";
		obj.insertHTML(imghtml);
	}

	var i_file = obj.$(obj.id+'_i_file');
	if (i_file && i_file.value.length != 0)
	{
		var arr = i_file.value.split('\.');
		suffix = arr[arr.length-1].toLowerCase();
		if(suffix != "gif" && suffix != "png" && suffix != "jpg" && suffix != "jpeg" && suffix != "pjpeg" && suffix != "bmp")
		{
			alert("请选择gif/png/jpg/bmp类型的图片");
			return;
		}
		try
		{
			eval('document.' + obj.id+'_i_file_form.submit()');
		}
		catch(e)
		{
			alert("请选择正确的文件。");
		}
	}
	else
	{
		obj.removePanel(obj.id+'_image');
	}
}

webEditor.prototype.mediaPanel = function()
{
	this.selectBegin();
	if(this.$(this.id+'_media'))
	{
		this.removePanel(this.id+'_media');
		return;
	}

	var iContent = '';
	iContent += '<div class="e_d1" id="ea">';
	iContent += '<div class="e_d2">';
	iContent += '<div class="e_d3">';
	iContent += '<div class="e_d4">';
	iContent += '<div class="mt5">方法1：粘贴视频源文件地址(Flash地址) <a href="/s/help_general.html#q21" class="c9" target="_blank"><img src="http://img1.kaixin001.com.cn/i/help/help_icon.gif" style="margin-top:-3px;*margin-top:0px;" align="absmiddle" title="如何粘贴视频" /></a></div>';
	iContent += '<div><span class="it_s"><input id="'+this.id+'_m_link" type="text" value="http://" style="width:230px;" class="it1" onfocus="this.className=\'it2\';" onblur="this.className=\'it1\';" /></span></div>';
	iContent += '<div class="mt15">方法2：粘贴视频网页地址(<a href="/s/help_note.html#q10" class="sl" target="_blank">查看支持网站</a>)</div>';
	iContent += '<div><span class="it_s"><input id="'+this.id+'_m_link_web" type="text" value="http://" style="width:230px;" class="it1" onfocus="this.className=\'it2\';" onblur="this.className=\'it1\';" /></span></div>';
	iContent += '<div class="e_d5" style="width:100%">';
	iContent += '<span class="e_d51"><input type="button" id="btn_qd" value="确定" title="确定" class="e_d51_of" onmouseover="this.className=\'e_d51_on\';" onmouseout=\"this.className=\'e_d51_of\';" onclick="javascript:'+this.id+'.insMedia();" /></span>\n';
	iContent += '&nbsp;<span class="e_d52"><input type="button" id="btn_qx" value="取消" title="取消" class="e_d52_of" onmouseover="this.className=\'e_d52_on\';" onmouseout="this.className=\'e_d52_of\';" onclick="javascript:'+this.id+'.removePanel(\''+this.id+'_media\');" /></span>';
	iContent += '</div>';
	iContent += '</div>';
	iContent += '</div>';
	iContent += '</div>';
	iContent += '</div>';
	iContent += '<br clear="all" /><br clear="all" />';

	this.drawPanel(iContent,'media');
}

webEditor.prototype.audioPanel = function()
{
	this.selectBegin();
	if(this.$(this.id+'_audio'))
	{
		this.removePanel(this.id+'_audio');
		return;
	}

	var iContent = '';
	iContent += '<div class="e_d1" id="ea">';
	iContent += '<div class="e_d2">';
	iContent += '<div class="e_d3">';
	iContent += '<div class="e_d4">';
	iContent += '<div class="mt5">请粘贴音频源文件的地址</div>';
	iContent += '<div><span class="it_s"><input id="'+this.id+'_m_link" type="text" value="http://" style="width:230px;" class="it1" onfocus="this.className=\'it2\';" onblur="this.className=\'it1\';" /></span></div>';
	iContent += '<div class="e_d5" style="width:100%">';
	iContent += '<span class="e_d51"><input type="button" id="btn_qd" value="确定" title="确定" class="e_d51_of" onmouseover="this.className=\'e_d51_on\';" onmouseout=\"this.className=\'e_d51_of\';" onclick="javascript:'+this.id+'.insAudio();" /></span>\n';
	iContent += '&nbsp;<span class="e_d52"><input type="button" id="btn_qx" value="取消" title="取消" class="e_d52_of" onmouseover="this.className=\'e_d52_on\';" onmouseout="this.className=\'e_d52_of\';" onclick="javascript:'+this.id+'.removePanel(\''+this.id+'_audio\');" /></span>';
	iContent += '</div>';
	iContent += '</div>';
	iContent += '</div>';
	iContent += '</div>';
	iContent += '</div>';
	iContent += '<br clear="all" /><br clear="all" />';

	this.drawPanel(iContent,'audio');
}

webEditor.prototype.insMedia = function(obj, verify)
{
	if (verify != "true") {
		var m_link =this.$(this.id+'_m_link').value;
		if (m_link != "http://" && m_link != "") {
			this.verifyurl(this, m_link, "insMedia");
			return false;
		} else {
			this.insMedia(this, "true");
			return false;
		}
		
	}

	var m_link =obj.$(obj.id+'_m_link').value;
	var m_link_web =obj.$(obj.id+'_m_link_web').value;
	
	if (m_link != "http://" && m_link != "") {
		var dot_arr = m_link.split(".");
		var m_format = dot_arr[dot_arr.length-1].toLowerCase();
		var m_height = 384;
		var m_width = 454;
		if(m_format == "mp3" || m_format == "wma" || m_format == "midi")
		{
			m_height = 45;
			m_width = Math.ceil(this.width*0.7);
	
		}
		var mediahtml = '<EMBED style="DISPLAY: block; MARGIN: 0px auto 10px; TEXT-ALIGN: center" src='+m_link+' width='+m_width+' height='+m_height+' autostart="false" loop="false" wmode="transparent" />';
	
		obj.insertHTML(mediahtml);
	}
	
	if (m_link_web != "http://" && m_link_web != "") {
		obj.insSwfFromWeb(obj, m_link_web);
	} else {
		obj.removePanel(obj.id+'_media');
	}
}

webEditor.prototype.insAudio = function(obj, verify)
{
	//TODO 扩展名判断
	if (verify != "true") {
		var m_link =this.$(this.id+'_m_link').value;
		var dot_arr = m_link.split(".");
		var m_format = dot_arr[dot_arr.length-1].toLowerCase();
		if(m_format != "mp3" && m_format != "wma" && m_format != "wav" && m_format != "mid")
		{
			alert("音频格式错误，或不支持此音频格式["+m_format+"]");
			return false;
		}

		if (m_link != "http://" && m_link != "") {
			if (m_link.indexOf("://") < 0) {
				m_link = "http://" + m_link;
			}
			this.verifyurl(this, m_link, "insAudio");
			return false;
		} else {
			this.removePanel(this.id+'_audio');
			return false;
		}
		
	}

	var m_link =obj.$(obj.id+'_m_link').value;
	var dot_arr = m_link.split(".");
	var m_format = dot_arr[dot_arr.length-1].toLowerCase();
/*
	if(m_format != "mp3" && m_format != "wma" && m_format != "wav" && m_format != "mid")
	{
		alert("音频格式错误，或不支持此音频格式["+m_format+"]");
		return false;
	}
*/
	if (m_link.indexOf("://") < 0) {
		m_link = "http://" + m_link;
	}

	var audiohtml = '<img title="' + m_link + '" src="/js/webeditor/i/fake_m_player.gif" />';

	obj.insertHTML(audiohtml);

	obj.removePanel(obj.id+'_audio');
}


webEditor.prototype.fontPanel = function()
{
	this.selectBegin();
	
	if(this.$(this.id+'_fontname'))
	{
		this.removePanel(this.id+'_fontname');
		return;
	}
	var fv = new Array("宋体","黑体","楷体_GB2312","隶书","幼圆","Arial","Tahoma","Times New Roman","Courier New","Sans-serif","Verdana");

	fContent = '';
	fContent += '<div class="e_d1" id="e1" onmouseleave="javascript:'+this.id+'.autoClose(\''+this.id+'_fontname\');">';
	fContent += '<div class="e_d2">';
	fContent += '<div class="e_d3">';
	for(i=0 ; i<fv.length ; i++)
	{
		fContent += '<div class="e_of" onmouseover="this.className=\'e_on\';" onmouseout="this.className=\'e_of\';" style="font-family:\''+fv[i]+'\';" onclick="javascript:'+this.id+'.setStyle(\'fontname\', \''+fv[i]+'\');">'+fv[i]+'</div>';
	}
	fContent += '</div>';
	fContent += '</div>';
	fContent += '</div>';
	this.drawPanel(fContent,'fontname');	
}

webEditor.prototype.setStyle = function(name , value)
{
	if (e_isIE)
	{
		if (!this.range)
		{
			this.selectBegin();
		}
		if (this.range && this.seltype != "Control" && this.range.text != "")
		{
			this.range.execCommand(name, false, value);
			this.range.select();
		}
		else
		{
			this.iframe.document.execCommand(name, false, value);
		}
		this.range = null;
	}
	else
	{
		var ffname = name;
		if (ffname == "backcolor") {
			ffname = "hilitecolor";
		}
		
		this.iframe.document.execCommand(ffname, false, value);
		this.iframe.focus();
	}

	if(this.$(this.id+"_"+name))
	{
		this.removePanel(this.id+"_"+name);
	}
}


webEditor.prototype.fontsizePanel = function()
{
	this.selectBegin();
	
	if(this.$(this.id+'_fontsize'))
	{
		this.removePanel(this.id+'_fontsize');
		return;
	}
	var fn = new Array("10","14","16","18","24","32","48");
	
	fContent = '';
	fContent +='<div class="e_d1" onmouseleave="javascript:'+this.id+'.autoClose(\''+this.id+'_fontsize\')">\n';
	fContent += '<table border=0 cellpadding=0 cellspacing=0><tr><td>';
	fContent +='<div class="e_d2">\n';
	fContent +='<div class="e_d3">\n';
	
	for(i=0 ; i<fn.length ; i++)
	{
		fContent +='<div class="e_of" onmouseover="this.className=\'e_on\';" onmouseout="this.className=\'e_of\';" onclick="javascript:'+this.id+'.setStyle(\'fontsize\',\''+(i+1)+'\');">'+fn[i]+'px'+'</div>\n';
	}
	fContent +='</div>\n';
	fContent +='</div>\n';
	fContent +='</td></tr></table>\n';
	fContent +='</div>\n';

	this.drawPanel(fContent,'fontsize');
}

function b_getAbsolutePos(element) 
{ 
	if ( arguments.length != 1 || element == null ) 
	{ 
		return null; 
	} 
	var elmt = element; 
	var offsetTop = elmt.offsetTop; 
	var offsetLeft = elmt.offsetLeft; 
	var offsetWidth = elmt.offsetWidth; 
	var offsetHeight = elmt.offsetHeight; 
	while( elmt = elmt.offsetParent ) 
	{ 
		// add this judge 
		if ( elmt.style.position == 'absolute' 
//		    || elmt.style.position == 'relative'  
		    || ( elmt.style.overflow != 'visible' && elmt.style.overflow != '' ) ) 
		{ 
			break; 
		}  
		offsetTop += elmt.offsetTop; 
		offsetLeft += elmt.offsetLeft; 
	} 
	return {top:offsetTop, left:offsetLeft, right:offsetWidth+offsetLeft, bottom:offsetHeight+offsetTop }; 
} 


