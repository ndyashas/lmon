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

