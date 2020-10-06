import os
import glob

class Util:

    def __init__(self):
        self._lmon_path = os.path.join(os.environ.get('HOME'), ".lmon")
        self._log_dir = os.path.join(self._lmon_path, "log")
        
    def get_num_of_machines(self, date):
        """Return an integer showing the number of machines from
        which data was collected.
        
        Return 0 if no data was collected on the given day.
        """
        machines_list = glob.glob(os.path.join(self._log_dir, date, "*"))
        return len(machines_list)

    def get_machines(self, date):
        """Return a dictionary of machines from which data was 
        collected on the input date where key is the machine name and it's value is the IP.
        
        Return {} if no data was collected on the given day.
        """
        machines = dict()
        machines_list =  glob.glob(os.path.join(self._log_dir, date, "*"))
        for path in machines_list:
            address = os.path.basename(path)
            if '@' in os.path.basename(path):
                address = os.path.basename(path).split('@')[-1]

            hostname = "unnamed"
            with open(os.path.join(path, "hostname.txt"), 'r') as f:
                hostname = f.read().strip()

            machines[address] = hostname
        return machines
