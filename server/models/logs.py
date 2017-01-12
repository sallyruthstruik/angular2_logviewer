
from mongoengine import fields as db

class Logs(db.Document):

    request_ip = db.StringField()
    request_id = db.StringField()
    sid = db.StringField()
    tags = db.ListField(db.StringField())
    level = db.StringField()
    host = db.StringField()
    logger_name = db.StringField()
    path = db.StringField()
    message = db.StringField()

    meta = {
        'collection': "syslog",
        'strict': False
    }
