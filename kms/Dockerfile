FROM golang:1.20rc3-bullseye
#Using go version 1.20 with debian bullseye as OS
WORKDIR /kms
#Workdir set as core
COPY . .
RUN go mod download
RUN go build -o core-app
EXPOSE 5656
CMD ["./core-app"]