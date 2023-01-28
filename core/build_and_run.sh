docker build -t core:test .
#Build docker image
echo "\n"
#Run container with detach (no running log)
docker run --name core core:test

# docker run core:test run infinity
#Run container without detach
## docker run -p 3000:3000 --name frontend frontend:test
#Run with bind mount
## docker run --name core -v "$(pwd)":/core:z core:test
#run command inside container
##docker exec -it frontend bash
#To stop container
##docker kill frontend
#To delete container (stop first)
##docker rm frontend
#copy
##docker cp conf/frontend.conf frontend:/frontend