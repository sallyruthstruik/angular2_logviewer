import datetime

from wtforms.ext import dateutil

from flask.ext.validator.resource_mixins.distinct_values import DistinctValuesMixin
from flask_validator.model_resource import ModelResource
from flask_validator.router import DefaultRouter
from flask_validator.serializer.model_serializer import ModelSerializer
from server.models.logs import Logs
from server.resources import router
from dateutil import parser

class LogsSerializer(ModelSerializer):
    class Meta:
        model = Logs

def update_json_filter(data):

    if "@timestamp" in data:
        meta = data["@timestamp"]
        if "$lte" in meta:
            meta["$lte"] = parser.parse(meta["$lte"])
        if "$gte" in meta:
            meta["$gte"] = parser.parse(meta["$gte"])

    return data

class LogsResource(DistinctValuesMixin,
                   ModelResource):

    serializer_class = LogsSerializer
    queryset = Logs.objects.all()
    distinct_fields = ["request_id", "level", "host", "logger_name"]
    update_json_filter = update_json_filter
    ordering = ("-@timestamp", )

    def get(self, request):
        return super(LogsResource, self).get(request)

router.register("/api/logs", LogsResource, "logs")

