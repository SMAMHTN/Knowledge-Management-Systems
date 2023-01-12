FROM node:19.4-bullseye
#Using Node version 19.4 with debian bullseye as OS
WORKDIR /frontend
#Workdir set as frontend
COPY . .
#Copy all code to workdir
ENV NODE_ENV=production 
#Set env to prod
RUN npm install --production --unsafe-perm && npm run build
#Run NPM install and build
EXPOSE 3000
#Expose port 3000 to be accessible to host
CMD npm start
#npm start