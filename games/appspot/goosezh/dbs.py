#!/usr/bin/env python

import datetime
from google.appengine.ext import db

class FBUsers(db.Model):
    uid  = db.StringProperty(required=True);
    name = db.StringProperty(default='');
    icon = db.StringProperty(default='');
    lvl  = db.IntegerProperty(default=0);
    win  = db.IntegerProperty(default=0);
    lose = db.IntegerProperty(default=0);
    draw = db.IntegerProperty(default=0);
    score= db.IntegerProperty(default=100);
    src  = db.StringProperty(default='FB');
    era  = db.DateTimeProperty(); # datetime.datetime.now()

    def getProfileUrl(self):
        if self.src == 'XN':
            url = 'http://www.renren.com/profile.do?id=' + self.uid
        else :
            url = 'http://www.facebook.com/profile.php?id=' + self.uid
        return url
            

class Games(db.Model):
    gid = db.StringProperty(required=True);
    uid = db.StringProperty(required=True);
    lvl = db.IntegerProperty(default=32);
    res = db.StringProperty(choices=set(["",'win', 'lose', 'draw', "Win","Lose","Draw", "Start"]), default='Start');
    tms = db.DateTimeProperty();

