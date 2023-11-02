docker build -t ghcr.io/smam-tech/kms:v1 ./kms
docker build -t ghcr.io/smam-tech/core:v1 ./core
docker build -t ghcr.io/smam-tech/frontend:v1 ./frontend

docker push ghcr.io/smam-tech/kms:v1
docker push ghcr.io/smam-tech/core:v1
docker push ghcr.io/smam-tech/frontend:v1