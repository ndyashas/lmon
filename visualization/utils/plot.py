#!/usr/bin/python3

import matplotlib.pyplot as plt

def plot_single(y_data, hh_mm, colour='r', y_label='', x_label='', title=''):

    plt.plot(hh_mm, y_data, colour)
    plt.ylabel(y_label)
    plt.xlabel(x_label)
    plt.title(title)

    plt.ylim((0, 100))    
    plt.xticks((range(len(hh_mm)))[::6], labels=hh_mm[::6], rotation=80)

    plt.show()

def plot_multiple(y_data_list, hh_mm_list, legend_label_list, colour_list = None, y_label = '' , x_label = '' , title=''):

    for i in range(len(y_data_list)):
        if colour_list != None:
            plt.plot(hh_mm_list[i], y_data_list[i], colour_list[i], label = legend_label_list[i])
        else:
            plt.plot(hh_mm_list[i], y_data_list[i], label = legend_label_list[i])
    plt.ylabel(y_label)
    plt.xlabel(x_label)
    plt.title(title)
    plt.ylim((0,100))
    plt.xticks((range(len(hh_mm_list[0])))[::6], labels = hh_mm_list[0][::6], rotation=80)
    plt.legend()
    plt.show()
        
