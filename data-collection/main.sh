#!/bin/sh

LMON_HOME="${HOME}"/.lmon
MACHINEFILE="${LMON_HOME}"/config/machinefile

. "${LMON_HOME}"/data-collection/utils/sys-collect-data.sh

while read HOST
do
    main $HOST
done < "${MACHINEFILE}"
