#!/bin/sh

MACHINEFILE="${1}"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"


if ! [ -f "${1}" ]; then
    mkdir -p /tmp/lmon
    echo "$(whoami)@127.0.0.1" > /tmp/lmon/temp-machinefile
    MACHINEFILE=/tmp/lmon/temp-machinefile
fi

while read HOST
do
    HOSTPATH="${HOME}"/.lmon/log/"${HOST}/$(date '+%d-%m-%Y')"
    mkdir -p "${HOSTPATH}";
    echo "Collecting from ${HOST}";
    bash "${DIR}"/utils/cpu-usage.sh "${HOST}" > "${HOSTPATH}"/cpu-usage.csv;
    bash "${DIR}"/utils/mem-usage.sh "${HOST}" > "${HOSTPATH}"/mem-usage.csv;
    bash "${DIR}"/utils/last-login-info.sh "${HOST}" > "${HOSTPATH}"/last_login_info.txt
done < "${MACHINEFILE}"
