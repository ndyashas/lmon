#!/bin/sh

# Placeholder code for now.
ssh "${1}" "sar -1" | sed -e 's/\(.*Average.*\)\|\(.*CPU.*\)//g' -e '/^$/d' -e 's/\(^[0-9].*:[0-9]\{2\}\) \([AP]M\) \([a-zA-Z]\{3\}\)/\1-\2-\3/g'
