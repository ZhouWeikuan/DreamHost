#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pyfacebook, pyxiaonei;
from django.utils import simplejson

sns = None

def getNullInfo():
    info = {}
    info['name'] = None
    info['pic_square'] = None
    return info

class XiaoneiWrapper():
    def __init__(self, req):
        self.src        = 'XN'
        self.lang       = req.request.get('fb_sig_locale', default_value='zh_CN')
        self.api_key    = '7459b999dda3470686c8c69fdd5332b6'
        self.secret_key = '1d5f352768854f1d9704e6d02423dbda'; 
        self.uid        = req.request.get('xn_sig_user', default_value='0')
        self.homeurl    = "http://apps.renren.com/chschess";
        self.topurl     = "http://apps.renren.com"
        self.appID      = "92729";
        self.auth_url   = 'http://app.renren.com/apps/tos.do?api_key=' + self.api_key + "&v=1.0&canvas&next=";
        self.invitePage = "http://apps.renren.com/request.do?app_id="+self.appID+"&action="+self.homeurl;
        self.app        = pyxiaonei.Xiaonei(self.api_key, self.secret_key)
        self.request    = req.request
        pass

    def getUserInfo(self, uid):
        try :
            if not self.app.check_session(self.request): # a must before any api call
                return getNullInfo()
            info = self.app.users.getInfo([uid], ['name', 'mainurl', 'headurl', 'tinyurl'])[0]
            info['pic_square'] = info['tinyurl']
            if not info['pic_square'] :
                info['pic_square'] = info['headurl']
            if not info['pic_square'] :
                info['pic_square'] = info['mainurl']
        except :
            info = getNullInfo()

        return info

class FacebookWrapper():
    def __init__(self, req):
        self.src = 'FB'
        self.lang       = req.request.get('fb_sig_locale', default_value='en')
        self.api_key    = '4676b3b9629ef74da7e3367ffbbba1a1'
        self.secret_key = '7f98509397899a1497891eac880a1b2d'; 
        self.uid        = req.request.get('fb_sig_user', default_value='0')
        self.homeurl    = "http://apps.facebook.com/chschess";
        self.topurl     = "http://apps.facebook.com"
        self.appID      = "265137985846";
        self.auth_url   = 'http://www.facebook.com/tos.php?api_key=' + self.api_key + "&v=1.0&canvas&next=";
        self.invitePage = self.homeurl + '/invite?fb_force_mode=fbml'
        self.app        = pyfacebook.Facebook(self.api_key, self.secret_key)
        self.request    = req.request
        pass

    def getUserInfo(self, uid):
        try :
            if not self.app.check_session(self.request): #it is a must before any api calls
                return getNullInfo()
            info = self.app.users.getInfo([uid], ['name', 'pic_square'])[0]
        except :
            info = getNullInfo()
        return info


def init_sns(req):
    global sns
    xn_sig_api_key = req.request.get('xn_sig_api_key', default_value=None)
    if xn_sig_api_key :
        sns = XiaoneiWrapper(req)
    else :
        sns = FacebookWrapper(req)
    return sns


# not available currently
def sendNewsFeed():
    global facebook
    message = _('is playing Chinese Chess(vs. computers)');
    attachment = {
        'name': _('The Chinese Chess(vs computers)'),
        'href': 'http://apps.facebook.com/chschess/',
        'caption': '{*actor*}' + _('joins game Chinese Chess(vs. computers)'),
        'description': _('a good chinese chess arena'),
        'properties':  {
            'category' : {
                'text' : _('Games'),
                'href' : 'http://apps.facebook.com/chschess/',
            },
            'ratings' : _('5 stars'),
        },
        'media': [
            {
                'type': 'image',
                'src': 'http://apps.facebook.com/chschess/favicon.ico',
                'href': 'http://apps.facebook.com/chschess/'
            },
        ],
    }
    action_links = [
        {
            'text': _('Visit this game'),
            'href': 'http://apps.facebook.com/chschess/'
        }
    ];
    attachment = simplejson.dumps(attachment);
    action_links = simplejson.dumps(action_links);
    facebook.stream.publish(message, attachment, action_links);
    return

