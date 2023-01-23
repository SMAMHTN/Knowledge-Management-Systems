FROM golang:1.20rc3-bullseye
#Using Node version 19.4 with debian bullseye as OS
WORKDIR /core
#Workdir set as frontend
COPY . .
# #Set env to prod
# RUN npm install --production --unsafe-perm && npm run build
# #Run NPM install and build
# EXPOSE 3000
#Expose port 3000 to be accessible to host
CMD go run ./core/
#npm start