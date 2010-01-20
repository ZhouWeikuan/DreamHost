var defHomeUrl = "http://apps.renren.com/chchess";
var appID = "89330"; // 象棋对战的appId

function JS_redirect(url) {
    if (window.parent) {
        window.parent.location.href = url;
    } else {
        window.location.href = url;
    }
}

function inviteFriends(){
    var url = "http://apps.renren.com/request.do?app_id=" + appID
            + "&action=" + defHomeUrl;
    JS_redirect(url);
}

