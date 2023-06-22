#!/bin/bash
docker image rm core-core
docker run -d -p 9998:9998 apache/tika:2.7.0.1-full

/home/aldim/go/bin/golangci-lint run