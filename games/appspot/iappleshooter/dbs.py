#!/usr/bin/env python

import datetime
from google.appengine.ext import db

class FBUsers(db.Model):
    uid  = db.StringProperty(required=True);
    name = db.StringProperty(default='');
    icon = db.StringProperty(default='');
    lvl  = db.IntegerProperty(default = 0);
    shots= db.IntegerProperty(default = 0);
    src  = db.StringProperty(default='FB');
    era  = db.DateTimeProperty(); # when refreshed? datetime.datetime.now()

    def getProfileUrl(self):
        if self.src == 'XN':
            url = 'http://www.renren.com/profile.do?id=' + self.uid
        elif self.src == 'FB' :
            url = 'http://www.facebook.com/profile.php?id=' + self.uid
        elif self.src == 'android' :
            url = 'http://iappleshooter.appspot.com/recentgames?fb_sig_locale=en'
        else:
            url = '/'
        return url

