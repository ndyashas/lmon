import os
from flask import Flask
from flask import render_template
import utils.utils as utils

app = Flask(__name__,
            static_url_path='',
            static_folder='static')

util_obj = utils.Util()
with open(os.path.join(util_obj.lmon_path, "config", "backend_server_url"), "r") as f:
    backend_url=f.read().strip()


@app.route("/api/v1/get-machines/<string:date>",
           methods=['GET'])
def get_machines(date):
    machines = util_obj.get_machines(date)
    return {date:machines}


@app.route("/api/v1/get-cpu-usage/<string:date>/<string:machine_id>",
           methods=['GET'])
def get_cpu_usage(date, machine_id):
    cpu_usage_dict = util_obj.get_machine_data(date, machine_id, 'cpu')
    return {date:cpu_usage_dict}


@app.route("/api/v1/get-mem-usage/<string:date>/<string:machine_id>",
           methods=['GET'])
def get_mem_usage(date, machine_id):
    mem_usage_dict = util_obj.get_machine_data(date, machine_id, 'mem')
    return {date:mem_usage_dict}


@app.route("/api/v1/get-login-details/<string:date>/<string:machine_id>",
           methods=['GET'])
def get_login_details(date, machine_id):
    login_details_dict = util_obj.get_login_details(date, machine_id)
    return {date:login_details_dict}


@app.route("/api/v1/ping-test/<string:machine_id>",
           methods=['GET'])
def ping_test(machine_id):
    ping_successful = util_obj.ping_test(machine_id)
    return {machine_id:ping_successful}


@app.route("/api/v1/ssh-test/<string:machine_id>",
           methods=['GET'])
def ssh_test(machine_id):
    ssh_successful = util_obj.ssh_test(machine_id)
    return {machine_id:ssh_successful}


@app.route("/")
def index():
    return render_template("index.html", backend_url=backend_url)
