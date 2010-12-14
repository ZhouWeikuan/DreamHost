#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pyfacebook, pyxiaonei, pyfiveone;
from django.utils import simplejson
import urllib, logging
import sys

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
        self.api_key    = '791735ec726543b48211f79a95bbfb83'
        self.secret_key = '2641ae2f370d412a947d2d4bb60eb3b5'; 
        self.uid        = req.request.get('xn_sig_user', default_value='0')
        self.homeurl    = "http://apps.renren.com/cronlychess";
        self.topurl     = "http://apps.renren.com"
        self.appID      = "123965";
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
        self.api_key    = 'cc558703a0c21bbe4b09565355af6ee2'
        self.secret_key = '2080ce576437227e7d7bb5d2a53569d5'; 
        self.uid        = req.request.get('fb_sig_user', default_value='0')
        self.homeurl    = "http://apps.facebook.com/cronlychess";
        self.topurl     = "http://apps.facebook.com"
        self.appID      = "138183732901622";
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

class PhoneWrapper():
    def __init__(self, req):
        self.src        = req.request.get('phone_api_key', default_value=None)
        self.lang       = req.request.get('phone_locale', default_value='en')
        self.api_key    = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        self.secret_key = 'ssssssssssssssssssssssssssssssss' 
        self.uid        = req.request.get('phone_user', default_value='0')
        self.name       = urllib.unquote(req.request.get('phone_name', default_value=''));
        self.icon       = None # "http://rotatemono.appspot.com/show?uid=" + self.uid
        self.homeurl    = "http://sns-chess.appspot.com/";
        self.topurl     = "http://sns-chess.appspot.com";
        self.appID      = "12345678";
        self.auth_url   = 'http://sns-chess.appspot.com';
        self.invitePage = self.homeurl + '/invite?fb_force_mode=fbml'
        self.app        = None;
        self.request    = req.request
        pass

    def getUserInfo(self, uid):
        info = {}
        info['name'] = self.name
        info['pic_square'] = self.icon
        return info

def init_sns(req):
    global sns
    xn_sig_api_key = req.request.get('xn_sig_api_key', default_value=None)
    fb_sig_api_key = req.request.get('fb_sig_api_key', default_value=None)
    phone_api_key  = req.request.get('phone_api_key', default_value=None)
    if xn_sig_api_key :
        sns = XiaoneiWrapper(req)
    elif fb_sig_api_key :
        sns = FacebookWrapper(req)
    elif phone_api_key:
        sns = PhoneWrapper(req)
    else :
        sns = FacebookWrapper(req)

    return sns

