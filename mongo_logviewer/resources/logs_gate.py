import datetime
import json
import logging
import pickle
import pprint
import socket
import threading

import select

from io import BytesIO

from mongoengine.errors import DoesNotExist
from pymongo.collection import Collection

from mongo_logviewer.models.data_source import DataSources

logger = logging.getLogger("logviewer.logs_gate")

class UDPLogsGate(threading.Thread):
    BUFSIZE = 10*1024*1024

    def __init__(self, app):
        super(UDPLogsGate, self).__init__()
        self.daemon = True
        self.app = app

    def run(self):
        bind_addr = ("0.0.0.0", 1759)

        s1 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s1.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s1.bind(bind_addr)

        logger.info("Start UDP listener at %s", bind_addr)

        while True:
            data, from_addr = s1.recvfrom(self.BUFSIZE)

            if data:
                try:
                    data = self._deserialize(data)
                    logger.debug("Got data %s", data)
                    collection = data.get("collection")

                    ds = DataSources.objects.filter(
                      collection_name=collection
                    ).first() #type: DataSources

                    if ds is None:
                        logger.warning("Create new datasource for collection %s", collection)
                        ds = DataSources.objects.create(
                            name=collection,
                            collection_name=collection
                        )

                    # preprocess data
                    data = self._preprocess(data)

                    data["@timestamp"] = datetime.datetime.utcnow()

                    ds.get_ds_collection(self.app).insert_one(
                      data
                    )

                except Exception as e:
                    logger.exception("Exception processing data: %s", e, extra={"data": data})


    def _deserialize(self, data):
        return json.loads(data.decode("utf-8"))

    def _preprocess(self, data):
        return data




