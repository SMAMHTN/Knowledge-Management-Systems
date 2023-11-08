# Stage 1: Build the Go application
FROM golang:1.20rc3-bullseye AS builder
WORKDIR /kms
COPY . .
RUN go mod download
RUN go build -o kms-app

# Stage 2: Create a smaller image with the binary and necessary files
FROM debian:bullseye-slim
WORKDIR /app

#INSTALL CURL FOR HEALTHCHECK
RUN apt-get update && apt-get install -y curl

# Copy the binary built in the previous stage
COPY --from=builder /kms/kms-app /app/

# Copy the necessary files from the ./config directory
COPY --from=builder /kms/config/ /app/config/

EXPOSE 5656

# Specify the command to run the application
CMD ["./kms-app"]
