FROM node:20-alpine AS base

WORKDIR /frontend 
COPY . /frontend/

RUN npm install

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME localhost

CMD npm run dev