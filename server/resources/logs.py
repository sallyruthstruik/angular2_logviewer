from flask.ext.validator.resource_mixins.distinct_values import DistinctValuesMixin
from flask_validator.model_resource import ModelResource
from flask_validator.router import DefaultRouter
from flask_validator.serializer.model_serializer import ModelSerializer
from server.models.logs import Logs
from server.resources import router


class LogsSerializer(ModelSerializer):
    class Meta:
        model = Logs

class LogsResource(DistinctValuesMixin,
                   ModelResource):

    serializer_class = LogsSerializer
    queryset = Logs.objects.all()
    distinct_fields = ["request_id"]

    ordering = ("-@timestamp", )

    def get(self, request):
        return super(LogsResource, self).get(request)

router.register("/api/logs", LogsResource, "logs")

