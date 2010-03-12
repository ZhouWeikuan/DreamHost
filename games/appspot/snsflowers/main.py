#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os;
import time, datetime, math;
from google.appengine.ext import webapp
from google.appengine.ext import db
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util
from google.appengine.api import memcache
from dbs import FBUsers, GameInfo
import opensns

# multilingual settings
from django.conf import settings
settings._target = None
os.environ['DJANGO_SETTINGS_MODULE'] = 'conf.settings'
from django.utils import translation
from django.utils import simplejson

keyRecent = 'recentGames'

def getLevelText(lvl):
    txt = "lvl " + str(lvl)
    return txt

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

def formatGame(g, u=None):
    if not u:
        u = getUserObject(g.uid)
    g.url = u.getProfileUrl()
    g.lvl = getLevelText(g.lvl)
    g.name = u.name
    g.icon = u.icon
    g.src = u.src
    return g

def checkUpgrade(u, v):
    k = "score_" + str(u.uid)
    fen = memcache.get(key=k)
    if fen is None:
        fen = 0
    fen = fen + v
    if fen == 0:
        fen = 0
    if fen >= 3 and int(u.lvl) < 9:
        u.lvl = u.lvl + 1
        fen = 0
    memcache.set(key=k, value=fen, time=3600*6) # expire in 6 hours
    return

def updateCache(g, u):
    try :
        g = formatGame(g, u)
        games = memcache.get(key=keyRecent)
        if not games:
            games = []
        games.insert(0, g)
        del games[12:] ### at most 12 recent games
        memcache.set(key=keyRecent, value=games, time=3600*24*3) # expire in 3 days
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

class HelpHandler(webapp.RequestHandler):
    def get(self):
        opensns.init_sns(self)
        lang = opensns.sns.lang
        lang = setHandlerLocale(self, lang)
        template_values = {
            'sns' : opensns.sns,
            'lang' : lang,
        }

        self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
        path = os.path.join(os.path.dirname(__file__), 'template/help.html')
        self.response.out.write(template.render(path, template_values))
        return

class RankHandler(webapp.RequestHandler):
    def get(self):
        opensns.init_sns(self)
        lvl = self.request.get('lvl', default_value='9')
        games = db.GqlQuery("SELECT * FROM GameInfo WHERE lvl=:1 ORDER BY score", lvl).fetch(20);

        lang = opensns.sns.lang
        lang = setHandlerLocale(self, lang)
        lvls = []
        for i in range(9, 0, -1):
            t = _("lvl " + str(i))
            o = {"tit":t, "cnt":i}
            lvls.append(o)

        lvl = int(lvl)
        template_values = {
            'sns'  : opensns.sns,
            'lang' : lang,
            'games': games,
            'lvls': lvls,
            'lvl': lvl,
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
        if not games:
            games = []
        for g in games:
            g.src = _(g.src)
            g.lvl = _(g.lvl)
            if g.res != 'Lose' and g.res != 'Start':
                g.res = g.res + _(" Sec.")
            else:
                g.res = _(g.res)

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
        pass;

class StartHandler(webapp.RequestHandler):
    def get(self):
        uid = self.request.get('uid');
        lvl = int(self.request.get('lvl', default_value='0'))
        if lvl >= 10:
            lvl = 9

        user = getUserObject(uid);
        newgame = GameInfo(uid=uid, lvl=str(lvl))
        newgame.res = 'Start'
        newgame.tms = datetime.datetime.today()
        updateCache(newgame, user)
        checkUpgrade(user, -1)
        user.put()
        return

class TestHandler(webapp.RequestHandler):
    def get(self):
        uid = '296576367'
        user = getUserObject(uid)
        k = "score_" + str(user.uid)
        fen = memcache.get(key=k)
        self.response.out.write("<div>")
        self.response.out.write("fen = " + str(fen) + "<br>")
        self.response.out.write("lvl = " + str(user.lvl) + "<br>")
        self.response.out.write("</div>")

 
class ResultHandler(webapp.RequestHandler):
    def get(self):
        uid = self.request.get('uid');
        act = self.request.get('action');
        lvl = int(self.request.get('lvl', default_value='0'))
        score = int(self.request.get('score', default_value='0'))

        newgame = GameInfo(uid=uid, lvl=str(lvl))
        newgame.tms = datetime.datetime.today()

        user = getUserObject(uid);
        val = 0
        if act == 'win' :
            val = 2
            newgame.res = str(score)
            newgame.score = score
            newgame.icon = user.icon
            newgame.name = user.name
            newgame.src = user.src
            newgame.url = user.getProfileUrl()
            newgame.put()
        else : # act == 'lose'
            newgame.res = act.capitalize()
            val = 0
            
        if lvl >= user.lvl:
            checkUpgrade(user, val)

        updateCache(newgame, user)
        user.put() 

class InviteHandler(webapp.RequestHandler):
    def post(self):
        opensns.init_sns(self)
        lang = opensns.sns.lang
        lang = setHandlerLocale(self, lang)

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
    lvl = []
    for i in range(1, user.lvl+1):
        t = "lvl " + str(i)
        lvl.append(_(t))

    tit = _("lvl " + str(user.lvl))
    template_values = {
        'sns' : opensns.sns,
        'lang' : lang,
        'sns_uid': sns_uid,    
        'user': user,
        'lvl': lvl,
        'tit': tit,
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
                                        ('/test', TestHandler),
                                        ('/help', HelpHandler),
                                        ('/invite', InviteHandler),
                                        ('/admin', AdminHandler)],
                                        debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
  main()
