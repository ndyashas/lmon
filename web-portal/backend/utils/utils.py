import os
import glob

class Util:

    def __init__(self):
        self._lmon_path = os.path.join(os.environ.get('HOME'), ".lmon")
        self._log_dir = os.path.join(self._lmon_path, "log")

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
