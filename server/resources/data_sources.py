from flask import jsonify
from flask.globals import current_app
from flask_restframework.decorators import list_route, detail_route
from flask_restframework.model_resource import ModelResource
from flask_restframework.serializer.model_serializer import ModelSerializer
from mongoengine.connection import get_connection

from server.models.data_source import DataSources


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

    def get_queryset(self):
        return DataSources.objects.all()
