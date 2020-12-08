#!/bin/sh


ping_test()
{
    ping -c 10 "${1##*@}" &> /dev/null
}

check_ssh()
{
    nc -4 -d -z -w 15 "${1##*@}" 22 &> /dev/null
}
