# coding=utf-8
from uuid import uuid4

from fabric.api import *
from fabric.contrib import files
import time
def default():
    env.branch = "default"
    env.hosts = ["web@178.63.3.156:1022"]

    env.worked_dir = "/home/web/services/logviewer"
    env.workers = ["logviewer"]
    env.worker_command = "circusctl"

    env.env_path = env.worked_dir + "/env"

    env.config_file = "settings/stable.py"


    env.server_configs = [  #configs: local template, target file, use sudo
        ["configs/circus.ini", "/home/web/circus/logviewer.ini", True],
        ["configs/nginx.conf", "/etc/nginx/sites-enabled/logviewer.conf", True]
    ]
    env.server_commands = [
        ["service nginx configtest", True],
        ["service nginx reload", True],
        ["sv restart ~/runit/circus", True],
    ]

@hosts("localhost")
def build(output="build/build.tar.gz"):
    """
    Выполняет сборку в build.tar.gz
    """
    local("mkdir -p build")
    local("gulp dist")
    local("tar -zcvf {} dist server"
          " *.py requirements.txt".format(output))

def first_install():
    """
    Выполняет установку на голый сервер
    fab --set=ui_source_path=../appdater_admin default deploy
    """

    build()
    set_configs()

    install()
    setup("true")


def install(artifact="build/build.tar.gz"):

    tempName = "{}.tar.gz".format(uuid4())
    put(artifact, "/tmp/{}".format(tempName))
    run("mkdir -p {}".format(env.worked_dir))
    _check_env()

    run("tar -zxvf /tmp/{} -C {}".format(tempName, env.worked_dir))
    setup()

    restart()

def _check_env():

    if not files.exists(env.env_path):
        run("virtualenv -p python3.4 {}".format(env.env_path))
        with inenv():
            run("pip install -U pip")

def setup(full="false", runner=None):
    """
    Выполняет установку зависимостей
    """
    #env.worked_dir = "~/Dropbox/Environment/Python/Coin32/updater_api_2"
    with cd(env.worked_dir):
        with inenv():
            run("pip install -r requirements.txt")

def install_rf():
    with cd(env.worked_dir):
        with inenv():
            run("pip install -I --no-cache-dir flask_restframework")


def inenv():
    return prefix(". {env_path}/bin/activate".format(**env))

def set_configs():
    """
    Загружает на сервер конфиги и выполняет рестарт nginx, circus
    """

    for local, target, useSudo in env.server_configs:
        files.upload_template(
            local, target, context=env, use_jinja=True,
            use_sudo=useSudo, backup=False
        )

    for command, useSudo in env.server_commands:
        runner = run
        if useSudo:
            runner = sudo

        runner(command)

def restart(action="restart"):
    for worker in env.workers:
        run("{} {} {}".format(env.worker_command, action, worker))
        time.sleep(1)
