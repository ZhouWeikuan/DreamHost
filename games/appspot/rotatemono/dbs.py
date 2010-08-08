#!/usr/bin/env python

import datetime
from google.appengine.ext import db

class FBUsers(db.Model):
    uid  = db.StringProperty(required=True);
    name = db.StringProperty(default='');
    icon = db.StringProperty(default='');
    lvl  = db.IntegerProperty(default = 0);
    src  = db.StringProperty(default='FB');
    era  = db.DateTimeProperty(); # when refreshed? datetime.datetime.now()

    def getProfileUrl(self):
        if self.src == 'XN':
            url = 'http://www.renren.com/profile.do?id=' + self.uid
        elif self.src == 'FB' :
            url = 'http://www.facebook.com/profile.php?id=' + self.uid
        elif self.src == 'android' :
            url = 'http://rotatemono.appspot.com/recentgames?fb_sig_locale=en'
        else:
            url = '/'
        return url

class GameInfo(db.Model):
    name = db.StringProperty(default='');
    icon = db.StringProperty(default='');
    url  = db.StringProperty(default='');
    res  = db.StringProperty(default='', multiline=True);  # str(int), or start, or lose
    tms  = db.DateTimeProperty();
    src  = db.StringProperty(default='', multiline=True);
    lvl  = db.StringProperty(default='0', multiline=True);
    score= db.FloatProperty(default=0.0);

