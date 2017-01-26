from flask.blueprints import Blueprint

from flask_restframework.router import DefaultRouter

api = Blueprint("api", __name__)
router = DefaultRouter(api)

from .logs import *
