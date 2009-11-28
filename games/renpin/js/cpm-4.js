var cpmcode = "";
function cpm_start()
{
	var url = "/interface/i.php";
	var pars = "";
	if (typeof(cpm_id) != "undefined")
	{
		pars += "id=" + encodeURIComponent(cpm_id) + "&";
	}
	if (typeof(cpm_class) != "undefined")
	{
		pars += "class=" + encodeURIComponent(cpm_class) + "&";
	}
	pars += Math.random();
	var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { cpm_startShow(req); } });
}

function cpm_startShow(req)
{
	var r = req.responseText;
	eval("r="+r);
	
	if (r.id)
	{
		cpmcode = r.code;
		$("kxcpmdiv").innerHTML = '<iframe id=kxcpmiframe name=kxcpmiframe frameborder=0 scrolling=no style="width:' + r.width + 'px;height:' + r.height + 'px;" src="http://www.kaixin001.com/interface/cpmblank.php" onload="init_cpmframe('+r.id+')"></iframe>';
		s("kxcpmdiv");
	}
}
function init_cpmframe(id)
{

	var iframe = window.frames["kxcpmiframe"];
	
	var scr = "if (document.all ? true : false){\n";
	scr +="document.onclick = function () { clickIt(event); };\n";
	scr +="}else{\n";
	scr +="document.addEventListener(\"click\", function (evnt) { clickIt(evnt); }, false);\n";
	scr +="}\n";
	scr +="function clickIt(evnt) { parent.cpm_clickIt(evnt, " + id + "); }\n";
	
	try
	{
		iframe.document.getElementsByTagName('head').item(0).innerHTML += '<script type="text/javascript">'+scr + '</script>';
	}
	catch(exc)
	{
		var ss = iframe.document.createElement('script');
		ss.type = "text/javascript";		
		ss.text = scr;
		iframe.document.getElementsByTagName('head').item(0).appendChild(ss);
	}
	iframe.document.body.innerHTML = cpmcode;
}
function cpm_clickIt(evnt, v_id)
{
	var tagName = "";
	if (evnt.srcElement)
	{
		tagName = evnt.srcElement.tagName;
	}
	else
	{
		tagName = evnt.target.tagName;
	}
	tagName.toUpperCase();

	if (tagName == "" || tagName == "BODY")
	{
		return;
	}

	var url = "/interface/cpm.php";
	var pars = "id=" + v_id + "&" + Math.random();
	var myAjax = new Ajax.Request(url, {method: "post", parameters: pars, onComplete: function (req) { cpm_clickItShow(req); } });
}

function cpm_clickItShow(req)
{
}

document.writeln('<div id=kxcpmdiv style="display:none;"></div>');
cpm_start();
