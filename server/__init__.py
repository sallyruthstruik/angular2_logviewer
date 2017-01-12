import logging
from logging.config import dictConfig

import time
from flask.app import Flask
import os

from flask.ext.mongoengine import MongoEngine
from flask.globals import request

os.environ.setdefault("LOGVIEWER_CONFIG", "settings/development.py")

db = MongoEngine()
loggerRoot = logging.getLogger("server")

def create_app() -> Flask:
  app = Flask(__name__)

  app.config.from_envvar("LOGVIEWER_CONFIG")

  db.init_app(app)

  from server.resources import api
  app.register_blueprint(api)

  app.before_request(before_request)
  app.after_request(after_request)

  dictConfig(app.config["LOGGING"])

  return app


def before_request():
    try:
        json = request.json or request.data
    except: #pylint: disable=bare-except
        json = request.data

    loggerRoot.getChild("request").info(
        "New request: %s url=%s, ip=%s, args=%s, body=%s, headers=%s",
        request.method,
        request.url,
        request.remote_addr,
        request.args,
        request.data,
        dict(request.headers)
    )

    #pylint: disable=protected-access
    request._start = time.time()

def after_request(response):
    """
    :type response: flask.wrappers.Response
    """

    duration = None
    if hasattr(request, "_start"):
        #pylint: disable=protected-access
        duration = time.time() - request._start

    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,PATCH"
    response.headers["Access-Control-Allow-Headers"] = ",".join(
      request.headers.keys()
    )


    loggerRoot.getChild("request").info(
        "Response: %s %s %s, duration=%s seconds",
        request.method,
        request.url,
        response.status_code,
        duration
    )

    return response
