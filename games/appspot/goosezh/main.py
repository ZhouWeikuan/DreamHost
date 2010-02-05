#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import os;
import time, datetime;
from google.appengine.ext import webapp
from google.appengine.ext import db
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util
from google.appengine.api import memcache
from dbs import FBUsers, Games
import opensns

# multilingual settings
from django.conf import settings
settings._target = None
os.environ['DJANGO_SETTINGS_MODULE'] = 'conf.settings'
from django.utils import translation
from django.utils import simplejson

keyRecent = 'recentGames'

def getLevelText(lvl):
    if lvl <= 1:
        txt = "Entry Level"
    elif lvl <= 4:
        txt = "First Level"
    elif lvl <= 16:
        txt = "Middle Level"
    elif lvl <= 32:
        txt = "Advanced Level"
    else :
        txt = "Last Level"
    return txt

def getLevelScore(lvl):
    if lvl <= 1:
        fen = 2
    elif lvl <= 4:
        fen = 4
    elif lvl <= 16:
        fen = 8
    elif lvl <= 32:
        fen = 16
    elif lvl <= 64:
        fen = 32
    return fen

def setHandlerLocale(handle, lang):
    os.environ['DJANGO_SETTINGS_MODULE'] = 'conf.settings'
    translation.activate(lang)
    lang = translation.get_language()
    handle.request.LANGUAGE_CODE = lang
    return lang

def getUserObject(objId):
    LIM = datetime.timedelta(days=3)
    cnt = 0
    user = None
    while user is None and cnt < 3:
        try :
            user = db.GqlQuery("SELECT * FROM FBUsers WHERE uid = :1", str(objId)).get();
        except :
            user = None
        cnt = cnt + 1

    if user :
        if user.era > datetime.datetime.today() - LIM and user.name:
            return user
    else :
        user = FBUsers(uid=str(objId));

    # whether we can fetch a user's new info
    if opensns.sns :
        info = opensns.sns.getUserInfo(objId)
        user.src = opensns.sns.src
        user.name = info['name']
        user.icon = info['pic_square']
        user.era = datetime.datetime.today()
        user.put()
    return user

class GameInfo():
    name = ''
    icon = ''
    url = ''
    res = ''
    tim = ''
    src = 'FB'
    lvl = 16

def formatGame(g, u=None):
    ret = GameInfo()
    if not u:
        u = getUserObject(g.uid)
    ret.url = u.getProfileUrl()
    ret.tim = "%02d:%02d:%02d"%(g.tms.hour, g.tms.minute, g.tms.second);
    ret.res = g.res
    ret.lvl = getLevelText(g.lvl)
    ret.name = u.name
    ret.icon = u.icon
    ret.src = u.src
    return ret

def updateCache(g, u):
    try :
        g = formatGame(g, u)
        games = memcache.get(key=keyRecent)
        if not games:
            games = []
        games.insert(0, g)
        del games[12:] ### at most 12 recent games
        memcache.set(key=keyRecent, value=games, time=3600*24) # expire in one day
    except :
        pass
    return

class AdminHandler(webapp.RequestHandler):
    def get(self):
        uid = self.request.get('uid', default_value='0')
        src = self.request.get('src', default_value=None)
        cmd = self.request.get('cmd', default_value=None)
        if cmd != 'chsrc' or src is None:
            a = _('FB')
            b = _('XN')
            return

        self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
        try :
            user = db.GqlQuery("SELECT * FROM FBUsers WHERE uid = :1", uid).get();
            user.src = src
            user.put()
            self.response.out.write('OK')
        except :
            self.response.out.write('FAIL')
        return

class NoneHandler(webapp.RequestHandler):
    def get(self):
        return

class RankHandler(webapp.RequestHandler):
    def get(self):
        opensns.init_sns(self)
        rev = int(self.request.get('rev', default_value='0'))
        if rev == 1:
            users = db.GqlQuery("SELECT * FROM FBUsers ORDER BY score").fetch(20);
        else :
            users = db.GqlQuery("SELECT * FROM FBUsers ORDER BY score DESC, win DESC").fetch(20);

        lang = opensns.sns.lang
        lang = setHandlerLocale(self, lang)

        template_values = {
            'sns'  : opensns.sns,
            'lang' : lang,
            'users': users,
        }

        self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
        path = os.path.join(os.path.dirname(__file__), 'template/rank.html')
        self.response.out.write(template.render(path, template_values))
        pass

class RecentGamesHandler(webapp.RequestHandler):
    def get(self):
        opensns.init_sns(self)
        lang = opensns.sns.lang
        lang = setHandlerLocale(self, lang)

        games = memcache.get(key=keyRecent)
        for g in games:
            g.src = _(g.src)
            g.lvl = _(g.lvl)
            g.res = _(g.res.capitalize())

        template_values = {
            'sns'  : opensns.sns,
            'lang' : lang,
            'games': games,
        }

        self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
        path = os.path.join(os.path.dirname(__file__), 'template/recentgames.html')
        self.response.out.write(template.render(path, template_values))
        return

class CleanGamesHandler(webapp.RequestHandler):
    def get(self):
        day = int(self.request.get('day', default_value='3'))
        tms = datetime.datetime.today() - datetime.timedelta(days=day)
        games = db.GqlQuery("SELECT * FROM Games WHERE tms < :1 LIMIT 10", tms);
        if games:
            for g in games:
                if g.res == '' or g.res == 'Start':
                    try :
                        user = getUserObject(g.uid)
                        user.lose = user.lose + 1
                        user.score = user.score - getLevelScore(g.lvl)
                        user.put()
                    except :
                        pass
            db.delete(games)
        pass;

class StartHandler(webapp.RequestHandler):
    def get(self):
        uid = self.request.get('uid');
        lvl = int(self.request.get('lvl', default_value='32'))
        user = getUserObject(uid);

        try :
            his_games = db.GqlQuery("SELECT * FROM Games WHERE uid = :1 and res in ('', 'Start') LIMIT 5", uid);
            if his_games:
                for g in his_games:
                    g.res = "Lose"
                    g.tms = datetime.datetime.today()
                    user.lose = user.lose + 1
                    user.score = user.score - getLevelScore(g.lvl)
                    updateCache(g, user)
                    g.delete()
            user.put()
        except:
            pass
            
        gid = str(int(time.time()))
        newgame = Games(gid=gid, uid=uid, lvl=lvl)
        newgame.res = 'Start'
        newgame.tms = datetime.datetime.today()
        newgame.put()
        updateCache(newgame, user)
        self.response.out.write(gid);
        pass;

class ResultHandler(webapp.RequestHandler):
    def get(self):
        uid = self.request.get('uid');
        act = self.request.get('action');

        game = db.GqlQuery("SELECT * FROM Games WHERE uid = :1 AND res in ('', 'Start')", uid).get();
        if game is None:
            return

        lvl = int(self.request.get('lvl', default_value='16'))
        fen = getLevelScore(game.lvl)

        user = getUserObject(uid);
        if act == 'win' :
            user.win = user.win + 1
            user.score = user.score + fen
        elif act == 'lose':
            user.lose = user.lose + 1
            user.score = user.score - fen
        else:
            user.draw = user.draw + 1
            user.score = user.score + fen/2
        game.res = act.capitalize()
        game.tms = datetime.datetime.today()

        updateCache(game, user)
        game.delete()
        user.put() 

class InviteHandler(webapp.RequestHandler):
    def post(self):
        template_values = {
        };
        self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
        path = os.path.join(os.path.dirname(__file__), 'template/invite_fb.html')
        self.response.out.write(template.render(path, template_values))

class MainHandler(webapp.RequestHandler):
  def get(self):
    opensns.init_sns(self)

    sns_uid = opensns.sns.uid
    if int(sns_uid) == 0 :
        self.ask_auth(opensns.sns.auth_url)
        return

    lang = opensns.sns.lang
    setHandlerLocale(self, lang)
    user = getUserObject(sns_uid)

    template_values = {
        'sns' : opensns.sns,
        'lang' : lang,
        'sns_uid': sns_uid,    
        'user': user,
    }

    self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
    path = os.path.join(os.path.dirname(__file__), 'template/index.html')
    self.response.out.write(template.render(path, template_values))

  def ask_auth(self, url):
    self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
    self.response.out.write("""
        <html>
        <head>
            <title> auth </title>
        <script type='text/javascript'>
            function js_redirect(url){
                if (window.parent) {
                    window.parent.location.href = url;
                } else {
                    window.location.href = url;
                }
            }
            js_redirect('""" + url +"""');
        </script>
        </head>
        <body>
        </body>
        </html>""");


def main():
    application = webapp.WSGIApplication([('/', MainHandler), 
                                        ('/start', StartHandler), 
                                        ('/result', ResultHandler),
                                        ('/rank', RankHandler),
                                        ('/recentgames', RecentGamesHandler),
                                        ('/cleangames', CleanGamesHandler),
                                        ('/None', NoneHandler),
                                        ('/invite', InviteHandler),
                                        ('/admin', AdminHandler)],
                                        debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
  main()
