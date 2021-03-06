
from mongoengine import fields as db

class Logs(db.Document):

    timestamp = db.DateTimeField(db_field="@timestamp")

    request_ip = db.StringField()
    request_id = db.StringField()
    sid = db.StringField()
    tags = db.ListField(db.StringField())
    levelname = db.StringField()
    host = db.StringField()
    name = db.StringField()
    path = db.StringField()
    message = db.StringField()
    metadata = db.DictField(db_field="meta")
    msg = db.StringField()

    stack_trace = db.StringField()
    thread_name = db.StringField()


    meta = {
        'collection': "syslog",
        'strict': False
    }
