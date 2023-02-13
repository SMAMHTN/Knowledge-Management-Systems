#!/bin/bash
docker build -t frontend:test .
#Build docker image
echo "\n"
#Run container with detach (no running log)
docker run -dp 3000:3000 --name frontend frontend:test
#Run container without detach
## docker run -p 3000:3000 --name frontend frontend:test
#Run with bind mount
## docker run -dp 3000:3000 --name frontend -v "$(pwd)":/frontend:z frontend:test
#run command inside container
##docker exec -it frontend bash
#To stop container
##docker kill frontend
#To delete container (stop first)
##docker rm frontend
#copy
##docker cp conf/frontend.conf frontend:/frontend
