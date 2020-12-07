import os
import csv
import glob
import datetime

class Util:

    def __init__(self):
        self._lmon_path = os.path.join(os.environ.get('HOME'), ".lmon")
        self._log_dir = os.path.join(self._lmon_path, "log")

        self._hours_list = list(range(24))

    @property
    def lmon_path(self):
        return self._lmon_path

    def get_machines(self, date):
        """Return a dictionary of machines from which data was 
        collected on the input date where key is the machine id and it's value
        is a dictionary of the form {'hostname':hostname, 'address':address}.
        
        Return {} if no data was collected on the given day.
        """
        machines = dict()
        machines_list =  glob.glob(os.path.join(self._log_dir, date, "*"))
        for path in machines_list:
            machine_id = os.path.basename(path)
            address = machine_id
            if '@' in os.path.basename(path):
                address = os.path.basename(path).split('@')[-1]

            hostname = "unnamed"
            with open(os.path.join(path, "hostname.txt"), 'r') as f:
                hostname = f.read().strip()

            machines[machine_id] = {'hostname':hostname, 'address':address}
        return machines

    def get_machine_data(self, date, machine_id, data_type):
        """Return the CPU usage stats for a particular machine on a given date
        """
        machine_dir = os.path.join(self._log_dir, date, machine_id)
        if data_type == "cpu":
            data_file = "cpu-usage.csv"
        else:
            data_file = "mem-usage.csv"

        if (os.path.isdir(machine_dir)):
            _hours_present_dict = dict()
            with open(os.path.join(machine_dir, data_file), 'r') as data_f:
                csv_reader = csv.reader(data_f)
                for data_point in csv_reader:
                    hour = int(data_point[0].split(':')[0])
                    if (hour not in _hours_present_dict):
                        _hours_present_dict[hour] = float(data_point[1])

            toret = []
            for hour in self._hours_list:
                if hour not in _hours_present_dict:
                    toret.append(0)
                else:
                    toret.append(_hours_present_dict[hour])

            return {machine_id:toret}
        else:
            return dict()

    def get_login_details(self, date, machine_id):
        """Get login data that is updated till a given date for a machine
        """
        machine_dir = os.path.join(self._log_dir, date, machine_id)
        toret = "No login information has been recorded"
        if (os.path.isdir(machine_dir)):
            with open(os.path.join(machine_dir, "last_login_info.txt"), 'r') as data_f:
                toret = data_f.read().rstrip()
        return {machine_id:toret}

    def ping_test(self, machine_id):
        response = os.system("ping -c 4 "+ machine_id)
        date = datetime.datetime.today().strftime("%Y-%m-%d")
        machine_dir = os.path.join(self._log_dir, date, machine_id)
        if response == 0:
            if os.path.isfile(os.path.join(machine_dir, "ping-down")):
                os.remove(os.path.join(machine_dir, "ping-down"))
            return True
        else:
            try:
                open(os.path.join(machine_dir, "ping-down"), 'w')
            except Exception as e:
                pass
            return False

    def ssh_test(self, machine_id):
        # response = os.system("nc -4 -d -z -w 15 "+ machine_id +" 22")
        response = os.system("ssh "+ machine_id +" 'hostname'")
        date = datetime.datetime.today().strftime("%Y-%m-%d")
        machine_dir = os.path.join(self._log_dir, date, machine_id)
        if response == 0:
            if os.path.isfile(os.path.join(machine_dir, "ssh-down")):
                os.remove(os.path.join(machine_dir, "ssh-down"))
            return True
        else:
            try:
                open(os.path.join(machine_dir, "ssh-down"), 'w')
            except Exception as e:
                pass
            return False
