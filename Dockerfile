FROM node:current-alpine
WORKDIR /usr/src/app
COPY docker/package*.json .
RUN npm install
COPY . .
COPY docker .
EXPOSE 8228
CMD [ "node", "app.js" ]