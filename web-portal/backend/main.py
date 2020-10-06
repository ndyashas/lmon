from flask import Flask
import utils.utils as utils
from flask_cors import CORS

app = Flask(__name__)

util_obj = utils.Util()

CORS(app)


@app.route("/api/v1/get-number-of-machines/<string:date>",
           methods=['GET'])
def get_num_of_machines(date):
    num_machines = util_obj.get_num_of_machines(date)
    return {date:num_machines}

@app.route("/api/v1/get-machines/<string:date>",
           methods=['GET'])
def get_machines(date):
    machines = util_obj.get_machines(date)
    return {date:machines}

