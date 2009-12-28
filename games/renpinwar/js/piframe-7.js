document.domain="kaixin001.com";
var g_im_errcount = 0;
var piframe = null;
var ver_kxchat = 0;
function initNewMsg()
{
	if(g_im_errcount > 5)
	{
		if(ver_kxchat)
		{
			setChatOffline(1); 
		}
		setTimeout(initNewMsg, 60000); 
		g_im_errcount = 0;
		return;
	}
	if(!g_im_web)
	{
		var url = "/home/newmsg.php";
		var pars = "im=1";
		var myAjax = new Ajax.Request(url, 
			{
				method: "post", 
				parameters: pars, 
				onSuccess: function (req) { 
					if(ver_kxchat)
					{
						switchChatOffline(0); 
					}
					postInitNewMsg(req); 
				},
				onFailure: function (req) {
					setTimeout(initNewMsg, 5000); 
				},
				onException:function (req) {  
					if(ver_kxchat)
					{
						setChatOffline(1); 
					}
					setTimeout(initNewMsg, 5000); 
				}
			 });
	}
	else
	{
		getIMNewsMsg();
	}
}

function postInitNewMsg(req)
{
	if (req.status == 200)
	{
		var r = req.responseText;
		if(r.length > 0)
		{
			eval ("r="+r);
			var pr_user = "";
			var pr_web = "";
			var pr_seq = 0;
			if(r.t == 'error')
			{
				g_im_errcount ++;
				setTimeout(initNewMsg, 5000);
				return;
			}
			else if(r.t == 'init')
			{
				document.getElementById("presence_data").value = r.vuid+","+r.imweb+","+r.imseq;
				g_im_web = r.imweb;				
			}
			if (g_im_web)
			{
				getIMNewsMsg();
			}
			else
			{
				g_im_errcount ++;
				setTimeout(initNewMsg, 5000);
			}
		}
	}
}

function getIMNewsMsg()
{
	if(g_im_web)
	{
		if(piframe)
		{
			piframe.src="http://" + g_im_web + ".kaixin001.com/ifr/js?r=http://img1.kaixin001.com.cn/js/prototype-1.6.1.js&r=http://img1.kaixin001.com.cn/js/presence-3.js";
		}
		else
		{
			piframe = document.createElement('iframe');
			piframe.setAttribute('id', 'presence_iframe');
			piframe.setAttribute('src', "http://" + g_im_web + ".kaixin001.com/ifr/js?r=http://img1.kaixin001.com.cn/js/prototype-1.6.1.js&r=http://img1.kaixin001.com.cn/js/presence-3.js");
			with (piframe.style) {
				  left       = top   = "-100px";
				  height     = width = "1px";
				  visibility = "hidden";
				  display    = 'none';
			}
			document.body.appendChild(piframe);
		}
	}
}
function piframe_init()
{
	setTimeout(initNewMsg, 3000);
}



