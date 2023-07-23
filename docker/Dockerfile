FROM node:current-alpine
WORKDIR /usr/src/app
COPY conf/package*.json .
RUN npm install
COPY .. .
COPY conf .
EXPOSE 8228
CMD [ "node", "app.js" ]