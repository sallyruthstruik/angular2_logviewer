from flask.blueprints import Blueprint

from flask_restframework.router import DefaultRouter

api = Blueprint("api", __name__)
router = DefaultRouter(api)

from .logs import *
from .data_sources import *

router.register("/api/data_sources", DataSourceResource, "data_sources")
