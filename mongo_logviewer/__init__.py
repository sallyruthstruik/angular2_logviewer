import logging
from logging.config import dictConfig

import time

from bson.objectid import ObjectId
from flask.app import Flask
import os

from flask.ext.mongoengine import MongoEngine
from flask.globals import request
from flask.helpers import send_from_directory
from flask.json import JSONEncoder


root_dir = os.path.dirname(__file__)

os.environ.setdefault("LOGVIEWER_CONFIG", os.path.join(root_dir, "settings/development.py"))

db = MongoEngine()
loggerRoot = logging.getLogger("server")

class MyJsonEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)

        return super(MyJsonEncoder, self).default(o)

def create_app():
  app = Flask(__name__)

  app.config.from_envvar("LOGVIEWER_CONFIG")

  db.init_app(app)

  app.json_encoder = MyJsonEncoder

  from mongo_logviewer.resources import api
  app.register_blueprint(api)

  app.before_request(before_request)
  app.after_request(after_request)

  #serve static
  @app.route("/<path:filename>")
  @app.route("/")
  def index(filename="index.html"):
    return send_from_directory(os.path.join(root_dir, "../dist"), filename)

  dictConfig(app.config["LOGGING"])

  from mongo_logviewer.resources.logs_gate import UDPLogsGate

  #Start UDP listening
  UDPLogsGate(app).start()

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
