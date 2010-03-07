#!/usr/bin/env python

import datetime
from google.appengine.ext import db

class FBUsers(db.Model):
    uid  = db.StringProperty(required=True);
    name = db.StringProperty(default='');
    icon = db.StringProperty(default='');
    lvl  = db.IntegerProperty(default=0);
    score= db.IntegerProperty(default=100);
    src  = db.StringProperty(default='FB');
    era  = db.DateTimeProperty(); # when refreshed? datetime.datetime.now()

    def getProfileUrl(self):
        if self.src == 'XN':
            url = 'http://www.renren.com/profile.do?id=' + self.uid
        else :
            url = 'http://www.facebook.com/profile.php?id=' + self.uid
        return url

