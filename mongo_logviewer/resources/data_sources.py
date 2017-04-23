import base64
import json

from flask import jsonify
from flask.globals import current_app
from flask_restframework.decorators import list_route, detail_route
from flask_restframework.model_resource import ModelResource
from flask_restframework.serializer.model_serializer import ModelSerializer
from mongoengine.connection import get_connection

from mongo_logviewer.models.data_source import DataSources, FavoriteFilter


class DataSourcesSerializer(ModelSerializer):
    class Meta:
        model = DataSources

class DataSourceResource(ModelResource):

    serializer_class = DataSourcesSerializer

    @detail_route(methods=["GET"])
    def getColumns(self, request, pk):
        col = DataSources.objects.get(id=pk).collection_name

        out = set()

        data = get_connection()[current_app.config["MONGODB_SETTINGS"]["db"]][col].find().limit(10)

        for item in data:
            out.update(item)

        return jsonify(sorted(out))


    @detail_route(methods=["POST"])
    def saveFavoriteFilter(self, request, pk):
        item = FavoriteFilter(**request.json)
        ds = DataSources.objects.get(id=pk)

        assert isinstance(ds, DataSources)
        ds.favorite_filters.append(item)
        ds.save()

        return "OK"

    @detail_route(methods=["GET"])
    def getFavorites(self, request, pk):
        ds = DataSources.objects.get(id=pk)

        return jsonify(list(map(lambda x: x.to_mongo(), ds.favorite_filters)))

    @detail_route(methods=["POST"])
    def deleteFavorite(self, request, pk):
        name = request.json.get("name")
        ds = DataSources.objects.get(id=pk)

        ds.favorite_filters = list(filter(lambda i: i.name != name, ds.favorite_filters))
        ds.save()
        return "OK"

    @detail_route(methods=["POST"])
    def addhistory(self, request, pk):
        history = request.json.get("filters", {})
        history.pop("@timestamp", None)

        history = json.dumps(history)

        ds = DataSources.objects.get(id=pk)
        try:
            first_item = ds.query_history[0]
        except IndexError:
            first_item = ""

        if first_item == history:
            return "OK", 204

        ds.query_history.insert(0, history)
        ds.query_history = ds.query_history[:1000]
        ds.save()

        return "OK"


    def get_queryset(self):
        return DataSources.objects.all()
