#!/usr/bin/env python
import os
import sys
from argparse import ArgumentParser

from mongo_logviewer import create_app

app = create_app()

def main(args=sys.argv):
    parser = ArgumentParser()
    parser.add_argument("--bind", default="127.0.0.1:8000", help="bind adress, f.e. --bind 0.0.0.0:8000")

    n = parser.parse_args(args[1:])

    host, port = n.bind.split(":")

    app.run(n.host, int(n.port))

if __name__ == "__main__":
    main()
