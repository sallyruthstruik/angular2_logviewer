from flask import current_app
from mongoengine import fields as db
from mongoengine.connection import get_connection
from pymongo.collection import Collection


class FavoriteFilter(db.EmbeddedDocument):
    name = db.StringField(unique=True)
    filter = db.StringField()

class DataSources(db.Document):

    name = db.StringField(required=True)
    collection_name = db.StringField(required=True)
    query_history = db.ListField(db.StringField())  #История, в виде base64(json.dumps())
    favorite_filters = db.EmbeddedDocumentListField(FavoriteFilter)

    display_columns = db.ListField(db.StringField(), default=[
      "host",
      "levelname",
      "@timestamp",
      "name",
      "message",
      "extra",
      "meta",
      "request_id",
      "request_ip",
      "tags"
    ])

    def get_ds_collection(self, app=None):
        """
        :rtype: pymongo.collection.Collection
        """

        app = app or current_app

        out = get_connection()[app.config["MONGODB_SETTINGS"]["db"]][self.collection_name]
        assert isinstance(out, Collection)
        return out
