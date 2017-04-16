from mongoengine import fields as db

class DataSources(db.Document):

    name = db.StringField(required=True)
    collection_name = db.StringField(required=True)
    query_history = db.ListField(db.DictField())
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
