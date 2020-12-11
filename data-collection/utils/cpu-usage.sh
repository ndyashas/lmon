#!/bin/sh

ssh -o PasswordAuthentication=no "${1}" "LC_TIME='POSIX' sar -1" | \
    sed -e 's/\(.*Average.*\)//g' \
        -e 's/\(.*CPU.*\)//g' \
	-e '/^$/d' | \
    awk 'OFS="," {print $1,100-$8}'
