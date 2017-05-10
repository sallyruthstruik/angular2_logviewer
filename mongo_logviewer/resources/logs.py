import datetime
import json

from flask import jsonify
from flask.ext.mongoengine.pagination import Pagination
from flask.ext.restframework.pagination import DefaultPagination
from flask.globals import current_app, request
from mongoengine.connection import get_connection
from mongoengine.queryset.queryset import QuerySet
from wtforms.ext import dateutil

from flask_restframework.resource_mixins.distinct_values import DistinctValuesMixin
from flask_restframework.model_resource import ModelResource
from flask_restframework.router import DefaultRouter
from flask_restframework.serializer.model_serializer import ModelSerializer

from mongo_logviewer.models.data_source import DataSources
from mongo_logviewer.models.logs import Logs
from mongo_logviewer.resources import router, api
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
    distinct_fields = ["request_id", "levelname", "host", "name"]
    update_json_filter = update_json_filter
    ordering = ("-@timestamp", )

    def get_queryset(self):

        dataSourceId = self.request.args.get("data_source", None)

        if dataSourceId:
            ds = DataSources.objects.get(id=dataSourceId)
            return QuerySet(Logs, get_connection()[current_app.config["MONGODB_SETTINGS"]["db"]][ds.collection_name])

        return super(LogsResource, self).get_queryset()

@api.route("/api/get_logs/<dataSourceId>", methods=["GET"])
def get_logs(dataSourceId):
    ds = DataSources.objects.get(id=dataSourceId)

    col = get_connection()[current_app.config["MONGODB_SETTINGS"]["db"]][ds.collection_name]

    try:
        filters = json.loads(request.args.get("json_filters"))
    except:
        filters = {}

    update_json_filter(filters)

    cursor = col.find(filters).sort([("@timestamp", -1)])

    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("page_size", 10))

    paginator = DefaultPagination(cursor, total=col.find(filters).count())
    cursor = paginator.paginate(request)

    return jsonify(paginator.update_response(list(paginator.qs)))




router.register("/api/logs", LogsResource, "logs")

