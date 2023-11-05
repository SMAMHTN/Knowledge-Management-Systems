docker build --no-cache -t ghcr.io/smam-tech/kms:v1 ./kms
docker build --no-cache -t ghcr.io/smam-tech/core:v1 ./core
docker build --no-cache -t ghcr.io/smam-tech/frontend:v1 ./frontend
docker build --no-cache -t ghcr.io/smam-tech/kms-solr:v1 ./solr

docker push ghcr.io/smam-tech/kms:v1
docker push ghcr.io/smam-tech/core:v1
docker push ghcr.io/smam-tech/frontend:v1
docker push ghcr.io/smam-tech/kms-solr:v1