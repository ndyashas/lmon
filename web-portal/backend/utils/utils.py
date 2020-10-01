import os
import glob

class Util:

    def __init__(self):
        self._lmon_path = os.path.join(os.environ.get('HOME'), ".lmon")
        self._log_dir = os.path.join(self._lmon_path, "log")
        
    def get_num_of_machines(self, date):
        """Return an integer showing the number of machines from
        which data was collected.
        
        Return 0 is no data was collected on the given day.
        """
        machines_list = glob.glob(os.path.join(self._log_dir, date, "*"))
        return len(machines_list)
