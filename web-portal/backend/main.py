from flask import Flask
import utils.utils as utils

app = Flask(__name__)

util_obj = utils.Util()

@app.route("/api/v1/get-number-of-machines/<string:date>",
           methods=['GET'])
def get_num_of_machines(date):
    num_machines = util_obj.get_num_of_machines(date)
    return {date:num_machines}
