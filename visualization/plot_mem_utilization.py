#!/usr/bin/python3

import numpy as np
import sys
import glob
import os

from utils.plot import plot_multiple

def display_mem_utilization(log_file_dir):
    hosts_path = glob.glob(os.path.join(log_file_dir, "*"))
    mem_util_percentage_list=[]
    hh_mm_list=[]
    legend_label_list=[]
    for host_path in hosts_path:
        mem_util_raw_file = os.path.join(host_path, "mem-usage.csv")
        system_name = os.path.basename(host_path)
        log_date = os.path.basename(os.path.split(host_path)[0])
        try:
            mem_util_raw = np.genfromtxt(mem_util_raw_file, delimiter=',', dtype=None)
            date_time_info_raw = [ ":".join((str(x).split("b'")[-1]).split(":")[:-1]) for x,_ in mem_util_raw ]
            mem_util_percentage_raw = [ y for _,y in mem_util_raw ]
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

            mem_util_percentage = []

            for i in date_time_info:
                if i in date_time_info_raw:
                    mem_util_percentage.append(mem_util_percentage_raw[date_time_info_raw.index(i)])
                else:
                    mem_util_percentage.append(0)
            mem_util_percentage_list.append(mem_util_percentage)
            hh_mm_list.append(date_time_info)
            legend_label_list.append(system_name)
                    
        except:
            print("There was an error processing file {}".format(host_path))

        plot_multiple(mem_util_percentage_list,
                      hh_mm_list,
                      legend_label_list,
                      y_label="RAM Utilization (as %) ->",
                      x_label="time ->",
                      title="RAM utilization v/s time on"+log_date)    
    


