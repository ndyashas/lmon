import os
import datetime
import argparse

import logins

if (__name__ == "__main__"):
    parser = argparse.ArgumentParser(description='lmon data visualization')

    parser.add_argument('-o', '--offset', type=int,
                        default=1,
                        help='Specify the date for which the log needs to be shown by giving an offset with respect to the current date.')

    group = parser.add_mutually_exclusive_group(required=True)
    
    group.add_argument('-c', '--cpu', action='store_true',
                        help='Display CPU stats.')

    group.add_argument('-m', '--mem', action='store_true',
                        help='Display Memory stats.')
    
    group.add_argument('-l', '--logins', action='store_true',
                        help='Display login stats.')

    args = parser.parse_args()

    date_string = (datetime.date.today()+datetime.timedelta(-1*args.offset)).strftime("%d-%m-%Y")
    log_file_dir = os.path.join(os.environ['HOME'], ".lmon", "log", date_string)

    if not os.path.isdir(log_file_dir):
        print("No logs were collected on {}".format(date_string))
        exit(1)
        
    if args.logins:
        logins.display_logins(log_file_dir)

    elif args.mem:
        pass

    else:
        pass
