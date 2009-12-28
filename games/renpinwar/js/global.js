var defHomeUrl = "http://apps.renren.com/renpinwar";
var appID = "67174"; // for 人品大战的appId

function getAjaxObject(){
    var xmlHttp;
    try { // Firefox, Opera 8.0+, Safari
        xmlHttp = new XMLHttpRequest();
    } catch (e) {
        try { // Internet Explorer 6.0+
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) { 
            try { // IE 5.0-
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                throw ("您的浏览器不支持AJAX！");
                return null;
            }
        }
    }
    return xmlHttp;
}

function xiaonei_class () {
    var ajax = getAjaxObject();
    var params = [];
    var postdata;
    var apiServerAddr = 'ajax.php';

    this.post_request = function(method){
        params['method'] = method;
        params['xn_sig_time'] = xn_sig_time;
        params['xn_sig_added'] = xn_sig_added;
        params['xn_sig_user'] = xn_sig_user;
        params['xn_sig_session_key'] = xn_sig_session_key;
        params['xn_sig_expires'] = xn_sig_expires;
        params['xn_sig_api_key'] = xn_sig_api_key;
        postdata = 'format=XML';
        for (var i in params){
            postdata += "&" + i + "=" + params[i];
        }

        try {
            ajax.open("POST", apiServerAddr, false);
            ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            ajax.send(postdata);
        } catch (e) {
            alert(e);
        }
        return (ajax.responseText);
    };

    this.doAction = function(type, otherid){
        params = [];
        params['obj'] = otherid;
        method = type + 'Other';
        return this.post_request(method);
    };

    this.friends = function (method, parm){
        params = [];
        switch (method) {
            case 'getFriends':
                if(parm['page']){
                    params['page'] = parm['page'];
                }
                if(parm['count']){
                    params['count'] = parm['count'];
                }
                break;

            case 'areFriends':
                if(parm['uids1']) {
                    params['uids1'] = parm['uids1'];
                }
                if(parm['uids2']) {
                    params['uids2'] = parm['uids2'];
                }
                break;

            case 'getAppUsers':
            case 'getAppFriends':
                break;
        }
        return this.post_request(method);
    };
};

// redirect to the specified url, for apps.renren.com
function onHref(url) {
    url =  defHomeUrl + url;
    if (window.parent) {
        window.parent.location.href = url;
    } else {
        window.location.href = url;
    }
}

function eraseDivPop(){
    var ele=document.getElementById('divPop');
    ele.style.display="none";
    ele.innerHTML = '';
}

function setTxtObj(radio){
    var obj = document.getElementById('txtObj');
    radio.selected = true;
    obj.value = radio.value;
}

// do harm or help to friends
function doFriends(uid, type, obj, name){
    var ele=document.getElementById('divPop');
    var html = '<input type="hidden" id="doType" value="' + type + '"> </input>'
             + '<span class="poptitle">请选择好友姓名: </span>';
    var mid;
    if (arguments.length > 2){
        mid  = '<input type="hidden" name="obj" id="txtObj" value="' + obj + '"> </input>\n'
             + '<div id="flist"> <input type="radio" checked="true" ' 
             + ' onclick="javascript:setTxtObj();" value="' + obj + '"> ' + name + '</input>'
             + '<br> 你真的要' + (type=="help"?'帮助':'陷害') + "他吗? <BR> </div>"
    } else {
        mid  = '<input type="hidden" name="obj" id="txtObj" value=""> </input>\n';
        var obj = new xiaonei_class(); 
        mid += obj.friends("getAppUsers", null);
    }
    html += mid;
    html +='<br><input type="button" value="确认" onclick="javascript:doAction();"> </input>'
         + '<input type="button" onclick="javascript:eraseDivPop();" value="取消"> </input>';
    ele.innerHTML = html;
    ele.style.display="block";
}

function doAction(){
    var other   =   document.getElementById('txtObj');
    if (other.value ==''){
        alert('请选择后再确认!');
        return;
    }
    var type    =   document.getElementById('doType');
    var obj = new xiaonei_class();
    var html = obj.doAction(type.value, other.value);
    var ele = document.getElementById('divPop'); 
    html +='<br><input type="button" value="确认" onclick="javascript:eraseDivPop();"> </input>';
    ele.innerHTML = html;
}

// goto uid's home page
function visitUser(uid){
    url = "/index.php?obj=" + uid;
    onHref(url);
}

function setmsg(uid){
    var ele = document.getElementById('divPopSettings');
    var ajax = getAjaxObject();
    ajax.onreadystatechange=function(){
        if (ajax.readyState==4 || ajax.readyState=="complete"){
            ele.style.display="block";
            ele.innerHTML = ajax.responseText;
        }
    };
    ajax.open("GET", "fmtSettings.php?obj=" + uid, true);
    ajax.send(null);
}

function savePopupSettings(){
    var ele = document.getElementById('divPopSettings');
    var ajax = getAjaxObject();
    ajax.onreadystatechange=function(){
        if (ajax.readyState==4 || ajax.readyState=="complete"){
            ele.style.display="block";
            ele.innerHTML = ajax.responseText;
        }
    };
    var postdata = "obj=" + (document.getElementById('obj').value)
                 + "&dohelp=" + (document.getElementById('dohelp').value)
                 + "&doharm=" + (document.getElementById('doharm').value)
                 + "&helpped=" + (document.getElementById('helpped').value)
                 + "&harmed=" + (document.getElementById('harmed').value);
    ajax.open("POST", "saveSettings.php", true);
    ajax.setRequestHeader("content-length", postdata.length);//post提交设置项
    ajax.setRequestHeader("content-type","application/x-www-form-urlencoded");
    ajax.send(postdata);
}

function closePopupSettings(){
    var ele = document.getElementById('divPopSettings');
    ele.innerHTML = "";
    ele.style.display="none";
}

function inviteFriends(){
    var url = "http://apps.renren.com/request.do?app_id=" + appID
            + "&action=http://apps.renren.com/renpinwar";
    if (window.parent) {
        window.parent.location.href = url;
    } else {
        window.location.href = url;
    }
}
