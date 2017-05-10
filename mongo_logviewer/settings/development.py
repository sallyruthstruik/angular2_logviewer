from flask_restframework.filter_backends import OrderingBackend, JsonFilterBackend
from flask_restframework.pagination import DefaultPagination

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
  # "host": "db",
  "host": "127.0.0.1",
  "db": "python_logs"
}

FLASK_REST = {
    "PAGINATION_CLASS": DefaultPagination,
    "FILTER_BACKENDS": (OrderingBackend, JsonFilterBackend)
}

DEBUG = True
