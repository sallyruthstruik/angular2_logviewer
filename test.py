import logging
from logging.handlers import DatagramHandler
from threading import Thread

from digitalpine_utils.dp_logging import UDPHandler

logging.basicConfig()

logging.getLogger("root").addHandler(UDPHandler(["test"], "test"))

try:
    1/0
except Exception as e:
    logging.getLogger("root").exception(
      "Some message %s, %s", 1, Thread(), extra={"meta": {"Olala": "blablabla", "key": Thread()}}
    )
