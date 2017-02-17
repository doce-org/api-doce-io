#!/bin/bash

PORTAINER_CONTAINER_NAME=portainer
DB_CONTAINER_NAME=postgres-doce
CONTAINER_NAME=feathersjs-doce-api

# launch portainer to manage docker
db_container_exist=`docker inspect -f '{{.Id}}' ${PORTAINER_CONTAINER_NAME}`
if [ ! -z $db_container_exist ];
    then
        echo "portainer container exist, launching..."
        docker start ${PORTAINER_CONTAINER_NAME}
    else
        echo "portainer container not found, creating..."
        docker run -d -p 9000:9000 --name portainer -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer
fi

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
        docker run -d -p 5432:5432 --name ${DB_CONTAINER_NAME} -e "POSTGRES_USER=postgres" -e "POSTGRES_DB=doce" rotschopf/rpi-postgres
fi

# sleep 3 seconds to be sure the
# db container is up and ready
sleep 3

docker run -d -p 3030:3030 --name ${CONTAINER_NAME} -e "NODE_ENV=development" \
    --link ${DB_CONTAINER_NAME}:postgres \
	--privileged -v /dev/:/dev/ \
    -v $(cd ../ && pwd):/app \
    hypriot/rpi-node /app/scripts/rpi_dev_entrypoint.sh
