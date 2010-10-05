# -*- coding: utf-8 -*-

import os;
import time, datetime, math;
from google.appengine.ext import webapp
from google.appengine.ext import db
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util
from google.appengine.api import memcache
from dbs import FBUsers
import opensns

# multilingual settings
from django.conf import settings
settings._target = None
os.environ['DJANGO_SETTINGS_MODULE'] = 'conf.settings'
from django.utils import translation
from django.utils import simplejson
import sys, urllib, logging

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
        logging.info(user.src)
        logging.info(user.name)
    return user

class GameInfo():
    name = ''
    icon = ''
    url  = ''
    tms  = ''
    src  = 'FB'
    lvl  = 0
    shots= 0

def formatGame(g, u=None):
    if not u:
        u = getUserObject(g.uid)
    g.url = u.getProfileUrl()
    g.lvl = getLevelText(g.lvl)
    g.name = u.name
    g.icon = u.icon
    g.src = u.src
    return g

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
            b = _('51')
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

class PhoneRegHandler(webapp.RequestHandler):
    def get(self):
        self.post();

    def post(self):
        uid = self.request.get('phone_user', default_value='0')
        opensns.init_sns(self)
        logging.info("user id is " + uid)
        user = getUserObject(uid);

        self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
        self.response.out.write('OK');
        logging.info(user.name)
        return

class PhoneRecentHandler(webapp.RequestHandler):
    def post(self):
        self.get()

    def get(self):
        opensns.init_sns(self)
        lang = self.request.get('phone_locale', default_value='en')
        lang = setHandlerLocale(self, lang)

        games = memcache.get(key=keyRecent)
        if not games:
            games = []
        for g in games:
            g.src = _(g.src)
            g.lvl = _(g.lvl)
            if g.res != 'Start':
                g.res = g.res + " s"
            else:
                g.res = _(g.res)

        template_values = {
            'sns'  : opensns.sns,
            'lang' : lang,
            'games': games,
        }

        self.response.headers['Content-Type'] = 'text/xml; charset=utf-8'
        path = os.path.join(os.path.dirname(__file__), 'template/recentgames.xml')
        self.response.out.write(template.render(path, template_values))
        return

class CellPhoneHandler(webapp.RequestHandler):
    def get(self):
        opensns.init_sns(self)
        lang = opensns.sns.lang
        lang = setHandlerLocale(self, lang)
        template_values = {
            'sns' : opensns.sns,
            'lang' : lang,
        }

        self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
        path = os.path.join(os.path.dirname(__file__), 'template/cellphone.html')
        self.response.out.write(template.render(path, template_values))
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
        lvl = int(self.request.get('lvl', default_value='17'))
        users = db.GqlQuery("SELECT * FROM FBUsers WHERE lvl=:1 ORDER BY shots DESC", lvl).fetch(40);

        lang = opensns.sns.lang
        lang = setHandlerLocale(self, lang)
        lvls = [ _("lvl " + str(i)) for i in range(17, -1, -1)]

        template_values = {
            'sns'  : opensns.sns,
            'lang' : lang,
            'users': users,
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
        # make this to clean users.
        day = int(self.request.get('day', default_value='30'))
        tms = datetime.datetime.today() - datetime.timedelta(days=day)
        users = db.GqlQuery("SELECT * FROM FBUsers WHERE era < :1 LIMIT 10", tms);
        if users :
            for u in users :
                if u.lvl < 0:
                    logging.info("delete user id: %s " % u.uid );
                    db.delete(u)
                else :
                    logging.info("downgrade user id: %s " % u.uid );
                    u.lvl = u.lvl - 1
                    u.era = datetime.datetime.today()
                    u.put()
        pass;

class ResultHandler(webapp.RequestHandler):
    def get(self):
        uid = self.request.get('uid');
        shots = int(self.request.get('shots', default_value='0'))
        lvl = int(self.request.get('lvl', default_value='0'))

        user = getUserObject(uid);

        newgame = GameInfo()
        newgame.uid = uid
        newgame.lvl = str(lvl)
        newgame.tms = datetime.datetime.today()
        newgame.shots = str(shots)
        newgame.icon = user.icon
        newgame.name = user.name
        newgame.src = user.src
        newgame.url = user.getProfileUrl()
        
        if lvl > user.lvl:
            user.lvl = user.lvl + 1
            user.shots = shots
        elif lvl == user.lvl and shots < user.shots :
            user.shots = shots

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

class Invite51Handler(webapp.RequestHandler):
    def post(self):
        opensns.init_sns(self)
        lang = opensns.sns.lang
        lang = setHandlerLocale(self, lang)

        template_values = {
        };
        self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
        path = os.path.join(os.path.dirname(__file__), 'template/invite_51.html')
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
    for i in range(0, user.lvl+1):
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
                                        ('/result', ResultHandler),
                                        ('/rank', RankHandler),
                                        ('/recentgames', RecentGamesHandler),
                                        ('/cleangames', CleanGamesHandler),
                                        ('/phone_reg', PhoneRegHandler),
                                        ('/phone_recent', PhoneRecentHandler),
                                        ('/help', HelpHandler),
                                        ('/cellphone', CellPhoneHandler),
                                        ('/invite', InviteHandler),
                                        ('/invite51', Invite51Handler),
                                        ('/admin', AdminHandler)],
                                        debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
  main()
