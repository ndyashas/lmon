#!/usr/bin/python3

import numpy as np
import sys
import glob
import os

from utils.plot import plot_multiple

def display_cpu_utilization(log_file_dir):
    hosts_path = glob.glob(os.path.join(log_file_dir, "*"))
    cpu_util_percentage_list=[]
    hh_mm_list=[]
    legend_label_list=[]
    for host_path in hosts_path:
        cpu_util_raw_file = os.path.join(host_path, "cpu-usage.csv")
        system_name = os.path.basename(host_path)
        log_date = os.path.basename(os.path.split(host_path)[0])
        try:
            cpu_util_raw = np.genfromtxt(cpu_util_raw_file, delimiter=',', dtype=None)
            date_time_info_raw = [ ":".join((str(x).split("b'")[-1]).split(":")[:-1]) for x,_ in cpu_util_raw ]
            cpu_util_percentage_raw = [ y for _,y in cpu_util_raw ]
            date_time_info = []

            for i in range(5,(24*60)+1,10):
                h=i//60
                if len(str(h))==1:
                    hh="0"+str(h)
                else:
                    hh=str(h)
                m=i%60
                if len(str(m))==1:
                    mm="0"+str(m)
                else:
                    mm=str(m)
                date_time_info.append(hh+":"+mm)

            cpu_util_percentage = []

            for i in date_time_info:
                if i in date_time_info_raw:
                    cpu_util_percentage.append(cpu_util_percentage_raw[date_time_info_raw.index(i)])
                else:
                    cpu_util_percentage.append(0)
            cpu_util_percentage_list.append(cpu_util_percentage)
            hh_mm_list.append(date_time_info)
            legend_label_list.append(system_name)
                    
        except:
            print("There was an error processing file {}".format(host_path))

        plot_multiple(cpu_util_percentage_list,
                      hh_mm_list,
                      legend_label_list,
                      y_label="CPU Utilization (as %) ->",
                      x_label="time ->",
                      title="CPU utilization v/s time on"+log_date)    
    


