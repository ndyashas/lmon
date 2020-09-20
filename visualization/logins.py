import os
import glob

def display_logins(log_file_dir):
    hosts_path = glob.glob(os.path.join(log_file_dir, "*"))

    for host_path in hosts_path:
        print("Login details for host: {}".format(os.path.basename(host_path)))

        try:
            with open(os.path.join(host_path, 'last_login_info.txt'), 'r') as login_log_file:
                log_lines = login_log_file.readlines()
                for line in log_lines:
                    print(line)
        except:
            print("There was an error processing file {}".format(host_path))
