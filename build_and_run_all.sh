#!/bin/bash
docker build -t frontend:test ./frontend
docker run -dp 3000:3000 --name frontend frontend:test
docker build -t kms:test ./kms
docker build -t core:test ./core