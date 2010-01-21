
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
    if (snsType == 'FACEBOOK'){
        url = "http://apps.facebook.com/chchess/fb_invite.php&fb_force_mode=fbml";
    }

    JS_redirect(url);
}

