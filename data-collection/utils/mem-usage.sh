#!/bin/sh

ssh "${1}" "LC_TIME='POSIX' sar -r -1" | \
    sed -e 's/\(.*Average.*\)//g' \
        -e 's/\(.*CPU.*\)//g' \
	-e 's/\(.*commit.*\)//g' \
	-e '/^$/d' | \
    awk 'OFS="," {print $1,$9}'
