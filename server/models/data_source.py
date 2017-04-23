from mongoengine import fields as db

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
      "level",
      "@timestamp",
      "logger_name",
      "message",
      "extra",
      "meta",
      "request_id",
      "request_ip",
      "tags"
    ])
