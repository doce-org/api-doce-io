#!/bin/bash

DB_CONTAINER_NAME=postgres-doce
CONTAINER_NAME=feathersjs-doce-api

# check presence of base container, and if
# exist, removing it to recreate it after
container_exist=`docker inspect -f '{{.Id}}' ${CONTAINER_NAME}`
if [ ! -z $container_exist ];
    then
        echo "${CONTAINER_NAME} exist, removing"
        docker stop ${CONTAINER_NAME}
        docker rm ${CONTAINER_NAME}
fi

# check presence of needed db container to
# either start it, or create it
db_container_exist=`docker inspect -f '{{.Id}}' ${DB_CONTAINER_NAME}`
if [ ! -z $db_container_exist ];
    then
        echo "postgres container exist, launching..."
        docker start ${DB_CONTAINER_NAME}
    else
        echo "postgres container not found, creating..."
        docker run -d -p 5432:5432 --name ${DB_CONTAINER_NAME} -e "POSTGRES_USER=postgres" -e "POSTGRES_DB=doce" postgres
fi

# sleep 3 seconds to be sure the
# db container is up and ready
sleep 3

docker run -d -p 3030:3030 --name ${CONTAINER_NAME} -e "NODE_ENV=development" \
    --link ${DB_CONTAINER_NAME}:postgres \
    -v /home/shad/Documents/D.O.C.E/api.doce.io:/app \
    node:6 /app/scripts/dev_entrypoint.sh