#!/bin/sh

DIR="${HOME}"/.lmon
MACHINEFILE="${DIR}"/config/machinefile

while read HOST
do
    HOSTPATH="${DIR}"/log/"$(date '+%d-%m-%Y')/${HOST}"
    mkdir -p "${HOSTPATH}";
    echo "Collecting from ${HOST}";
    bash "${DIR}"/data-collection/utils/cpu-usage.sh "${HOST}" > "${HOSTPATH}"/cpu-usage.csv < /dev/null;
    bash "${DIR}"/data-collection/utils/mem-usage.sh "${HOST}" > "${HOSTPATH}"/mem-usage.csv < /dev/null;
    bash "${DIR}"/data-collection/utils/last-login-info.sh "${HOST}" > "${HOSTPATH}"/last_login_info.txt < /dev/null;
done < "${MACHINEFILE}"
