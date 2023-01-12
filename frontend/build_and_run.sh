docker build -t frontend:test .
#Build docker image
echo "\n"
docker run -dp 3000:3000 --name frontend frontend:test
# docker run -p 3000:3000 --name frontend frontend:test
#docker exec -it frontend bash
#docker kill frontend