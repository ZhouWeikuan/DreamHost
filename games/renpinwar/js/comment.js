
function getpos(element)
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
//              || elmt.style.position == 'relative'
                || ( elmt.style.overflow != 'visible' && elmt.style.overflow != '' ) )
                {
                        break;
                }
                offsetTop += elmt.offsetTop;
                offsetLeft += elmt.offsetLeft;
        }
        return {top:offsetTop, left:offsetLeft, right:offsetWidth+offsetLeft, bottom:offsetHeight+offsetTop };
}

//DataLength
function b_strlen(fData)
{
	var intLength=0;
	for (var i=0;i<fData.length;i++)
	{
		if ((fData.charCodeAt(i) < 0) || (fData.charCodeAt(i) > 255))
			intLength=intLength+2;
		else
			intLength=intLength+1;   
	}
	return intLength;
}

function IsIE()
{
	return document.all ? true : false;
}

function copy_clip(text2copy) 
{
	if (window.clipboardData) 
	{
		window.clipboardData.setData("Text",text2copy);
	} 
	else 
	{
		var flashcopier = 'flashcopier';
		if(!document.getElementById(flashcopier)) 
		{
			var divholder = document.createElement('div');
			divholder.id = flashcopier;
			document.body.appendChild(divholder);
		}
		document.getElementById(flashcopier).innerHTML = '';
		var divinfo = '<embed src="http://img1.kaixin001.com.cn/i/_clipboard.swf" FlashVars="clipboard='+escape(text2copy)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';//这里是关键
		document.getElementById(flashcopier).innerHTML = divinfo;
	}
	return true;
}

function copyToClipboard(txt)
{
	if (window.clipboardData)
	{
		window.clipboardData.clearData();
		window.clipboardData.setData("Text", txt);
	}
	else if (navigator.userAgent.indexOf("Opera") != -1)
	{
		window.location = txt;
	}
	else if (window.netscape)
	{
		try
		{
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		}
		catch (e)
		{
			alert("您的firefox安全限制限制您进行剪贴板操作，请打开'about:config'将signed.applets.codebase_principal_support'设置为true'之后重试");
			return false;
		}
		var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
		if (!clip)
			return false;
		var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
		if (!trans)
			return false;
		trans.addDataFlavor('text/unicode');
		var str = new Object();
		var len = new Object();
		var str = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
		var copytext = txt;
		str.data = copytext;
		trans.setTransferData("text/unicode",str,copytext.length*2);
		var clipid = Components.interfaces.nsIClipboard;
		if (!clip)
			return false;
		clip.setData(trans,null,clipid.kGlobalClipboard);
	}
	return true;
}



function _commentImageResize(thisobj , limit)
{
        if(thisobj.width > limit)
        {
                thisobj.height = parseInt(limit*thisobj.height/thisobj.width);
                thisobj.width = limit;
        }

}

String.prototype.trim = function()
{
    return this.replace(/(^[\s]*)|([\s]*$)/g, "");
}
String.prototype.lTrim = function()
{
    return this.replace(/(^[\s]*)/g, "");
}
String.prototype.rTrim = function()
{
    return this.replace(/([\s]*$)/g, "");
}

function getDays(year , month)
{
	var dayarr = new Array(31,28,31,30,31,30,31,31,30,31,30,31);

	if(month == 2)
	{
		if((year%4 == 0 && year%100 != 0) || year%400 == 0 || year < 1900)
			return 29;
		else
			return dayarr[month-1];
	}
	else
	{
		return dayarr[month-1];
	}
}

function extractNodes(pNode)
{
	if(pNode.nodeType == 3)
	{
		return null;
	}
	var node,nodes = new Array();
        for(var i=0 ; node= pNode.childNodes[i] ; i++)
        {
		if(node.nodeType == 1)
		{
			nodes.push(node);
		}
        }
        return nodes;
}

/*
	判断是否是数组
*/
function isArray(o) 
{   
	return Object.prototype.toString.call(o) === '[object Array]';    
}

/*
	将png图上加上滤镜让它透明
*/
function filterPng(img)
{
	var width = img.width;
	var height = img.height;
	var sizingMethod = (img.className.toLowerCase().indexOf("scale") >= 0)? "scale" : "image"; 
	img.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + img.src.replace('%23', '%2523').replace("'", "%27") + "', sizingMethod='" + sizingMethod + "')";
	img.src = "http://img1.kaixin001.com.cn/i3/walls/l2_trans.gif";
	img.width = width;
	img.height = height;
}

/*
	将某闭合对象内的所有images遍历
*/
function filterPngs(obj)
{
	var arVersion = navigator.appVersion.split("MSIE")
	var version = parseFloat(arVersion[1])
	if ((version >= 5.5 && version < 7.0) && (document.body.filters))
	{
		var images = obj.getElementsByTagName("img");
		for(var i=0; i<images.length; i++)
		{
			var img = images[i];
			var imgName = img.src.toUpperCase();
			if (imgName.indexOf(".PNG") > 0)
			{
				filterPng(img);
			}
		}
	}
}


function clickDirect(url)
{
	if('function' == typeof(updateHash))
	{
		updateHash(url);
		return true;
	}
	else
	{
		window.location = url;
		return false;
	}
}


function setInnerHTML(el, html)
{
    if (isIE){
        html = '<div style="display:none">for IE</div>' + html;
       	el.innerHTML = html;
       	execIt(el, "script");
       	el.removeChild(el.firstChild);
    }
    else{    
        var el_next = el.nextSibling;
        var el_parent = el.parentNode;
        el_parent.removeChild(el);
        el.innerHTML = html;
        if (el_next){
            el_parent.insertBefore(el, el_next)
        } else{
            el_parent.appendChild(el);
        }
    }
}

function execIt(el, stype)
{
	var bMoz = (navigator.appName == 'Netscape');
	var bOpera = (navigator.appName == 'Opera');
	if(stype == "script")
	{
		stype = stype.toUpperCase();
	}
	if (!el) return;
	var st = "";
	st = el.getElementsByTagName(stype);
	var strExec;

	for(var i=0;i<st.length; i++)
	{
		if(isIE || bOpera) 
		{
			strExec = st[i].text;
			st[i].text = "";
		}
		else if(bMoz)
		{
			strExec = st[i].textContent;
			st[i].textContent = "";
		}
		else
		{
			strExec = st[i].innerHTML;
		    st[i].innerHTML = "";
		}

		try 
		{
			
			if(stype == "SCRIPT")
			{
				var script = document.createElement("script");
				script.type = "text/javascript";
				
				if(st[i].src)
				{
					script.charset = 'UTF-8';
					//script.defer = "defer";
					script.src = st[i].src;
				}
				else
				{
					if (isIE)
					{
						script.text = strExec;
					}
					else
					{
						script.innerHTML = strExec;
					}					 
				}
				document.getElementsByTagName("head")[0].appendChild(script);
			}
			else if(stype == "style")
			{
				var ss = document.createElement('style');
				ss.type="text/css";
				ss.styleSheet.cssText= strExec;
				document.getElementsByTagName('head').item(0).appendChild(ss);
			}
			else if(stype == "link")
			{
				
				if(st[i].href)
				{
					var link = document.createElement("link");
					link.rel = "stylesheet";
					link.type = "text/css";
					link.href = st[i].href;
					document.getElementsByTagName('head').item(0).appendChild(link);
				}
			}

		} 
		catch(e) 
		{			
		}
	}
};