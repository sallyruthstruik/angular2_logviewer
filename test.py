
from mongo_logviewer import create_app
from mongo_logviewer.models.logs import Logs

create_app()

print(Logs.objects.all())
