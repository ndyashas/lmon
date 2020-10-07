from flask import Flask
import utils.utils as utils
from flask_cors import CORS

app = Flask(__name__)

util_obj = utils.Util()

CORS(app)

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
