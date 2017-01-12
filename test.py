
from server import create_app
from server.models.logs import Logs

create_app()

print(Logs.objects.all())
