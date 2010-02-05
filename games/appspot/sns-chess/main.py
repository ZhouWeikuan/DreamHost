#!/usr/bin/env python
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

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp import template
from google.appengine.api import memcache
import datetime

class Games():
    time = ''

class MainHandler(webapp.RequestHandler):
    def get(self):
        mKey = 'recentgames'
        games = memcache.get(key=mKey)
        if not games:
            games = []
        tms = datetime.datetime.today().strftime("%H:%M:%S")
        games.insert(0, tms)
        if len(games) > 12:
            del games[12]

        memcache.set(key=mKey, value=games, time=3600*24) # expire in one day
        template_values = {
            "games": games,
        }

        self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
        path = os.path.join(os.path.dirname(__file__), 'template/index.html')
        self.response.out.write(template.render(path, template_values))


def main():
    application = webapp.WSGIApplication([('/', MainHandler)],
                                       debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
