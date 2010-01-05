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

function doneNewComment(htmlText){
    var divFrame = document.getElementById("commentFrame");
    var div = document.createElement("div");
    divFrame.appendChild(div);
    div.className = "commentItem";
    div.innerHTML = htmlText;
}

function onNewComment(){
    var ajax = getAjaxObject();
    var divMsg = document.getElementById("errorMsg");
    var divUid = document.getElementById("commentUid");
    var divTxt = document.getElementById("commentContent");
    if (!divUid || !divUid.value){
        return;
    }
    if (divTxt.value == ""){
        divMsg.innerHTML = "请写完评论后再提交!";
        divMsg.style.display="block";
        return;
    } else {
        divMsg.innerHTML = "";
        divMsg.style.display="none";
    }
    var postdata="method=onNewComment&uid=" + divUid.value;
    postdata += "&Comment=" + encodeURIComponent(divTxt.value);

    ajax.open("POST", "ajax.php", true);
    ajax.onreadystatechange = function(){
        if (ajax.readyState==4 || ajax.readyState=="complete"){
            doneNewComment(ajax.responseText);
        }
    };
    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // alert(postdata);
    ajax.send(postdata);
}

