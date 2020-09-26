import os

def get_num_of_monitored_machines():

    return int(os.popen('cat ../config/machinefile | wc -l').read()) - 1
