FROM node:7.7.2-alpine

WORKDIR Users/dulac/CloudStation/WebWork/Udacity/mws-restaurant-node-server
COPY package.json .
RUN npm install --quiet

COPY . .
