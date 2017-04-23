import os
import re

from fabric.api import local, settings
from fabric.sftp import SFTP
import pysftp


def replace_version():
    with open("setup.py", "r") as fd:
        data = fd.read()

    prev, version = map(int, re.findall(r"version=\'(\d+)\.(\d+)\'", data)[0])
    data = re.sub(r"version=\'\d+\.\d+\'", "version='{}.{}'".format(prev, version + 1), data, count=1)

    with open("setup.py", "w") as fd:
        fd.write(data)

def build():
    replace_version()

    local("rm -Rf dist/*")
    local("rm -Rf build/*")

    local("gulp dist")
    local("tar -zcvf build/mongo_logviewer.tar.gz dist mongo_logviewer *.py *.md LICENSE MANIFEST.in README.md requirements.txt")

    filename = os.listdir("build")[0]

    cnopts = pysftp.CnOpts()
    cnopts.hostkeys = None

    with pysftp.Connection('dl1.argonlabs.ru', username="fabric", port=4022, cnopts=cnopts) as sftp:
        with sftp.cd("share"):
            sftp.put("build/{}".format(filename), "mongo_logviewer.tar.gz")

if __name__ == "__main__":
    build()
