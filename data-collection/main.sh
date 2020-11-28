#!/bin/sh

LMON_HOME="${HOME}"/.lmon
MACHINEFILE="${LMON_HOME}"/config/machinefile

. "${LMON_HOME}"/data-collection/utils/sys-up-tests.sh

while read HOST
do
    HOSTPATH="${LMON_HOME}"/log/"$(date --date="yesterday" '+%Y-%m-%d')/${HOST}"
    mkdir -p "${HOSTPATH}";
    echo "Collecting from ${HOST}";

    ping_test "${HOST}"

    if [ $? -eq 0 ]; then
	check_ssh "${HOST}"
	if [ $? -eq 0 ]; then
	    bash "${LMON_HOME}"/data-collection/utils/cpu-usage.sh "${HOST}" > "${HOSTPATH}"/cpu-usage.csv < /dev/null;
	    if [ $? -ne 0 ]; then rm -f "${HOSTPATH}"/cpu-usage.csv; touch "${HOSTPATH}"/cpu-test-down; fi
	    bash "${LMON_HOME}"/data-collection/utils/mem-usage.sh "${HOST}" > "${HOSTPATH}"/mem-usage.csv < /dev/null;
	    if [ $? -ne 0 ]; then rm -f "${HOSTPATH}"/cpu-usage.csv; touch "${HOSTPATH}"/mem-test-down; fi
	    bash "${LMON_HOME}"/data-collection/utils/last-login-info.sh "${HOST}" > "${HOSTPATH}"/last_login_info.txt < /dev/null;
	    if [ $? -ne 0 ]; then rm -f "${HOSTPATH}"/cpu-usage.csv; touch "${HOSTPATH}"/last-login-test-down; fi
	    bash "${LMON_HOME}"/data-collection/utils/hostname.sh "${HOST}" > "${HOSTPATH}"/hostname.txt < /dev/null;
	    if [ $? -ne 0 ]; then rm -f "${HOSTPATH}"/cpu-usage.csv; touch "${HOSTPATH}"/hostname-test-down; fi
	else
	    echo "Unable to remotely login to host - ${HOST}";
	    touch "${HOSTPATH}"/ssh-down;
	fi
    else
	echo "Unable to reach host - ${HOST}";
	touch "${HOSTPATH}"/ping-down;
    fi

done < "${MACHINEFILE}"
