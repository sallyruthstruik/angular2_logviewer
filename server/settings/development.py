from flask_validator.filter_backends import OrderingBackend, JsonFilterBackend
from flask_validator.pagination import DefaultPagination

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'default': {
            'format': '%(asctime)s [%(levelname)s][%(processName)s][%(threadName)s][%(filename)s:%(lineno)s] %(name)s: %(message)s'
        }
    },
    'handlers': {
        'default': {
            'level': 'NOTSET',
            'class': 'logging.StreamHandler',
            'formatter': 'default'
        },
    },

    'loggers': {
        '': {
            'handlers': ['default'],
            'level': 'INFO',
            'propagate': False
        }
    }
}

MONGODB_SETTINGS = {
  "host": "192.168.176.18",
  "db": "logstash"
}

FLASK_REST = {
    "PAGINATION_CLASS": DefaultPagination,
    "FILTER_BACKENDS": (OrderingBackend, JsonFilterBackend)
}

DEBUG = True
