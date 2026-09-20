FROM node:slim
WORKDIR /usr/src/app
COPY ./app/package*.json ./
RUN npm install
COPY ./app/ .
EXPOSE 8081
CMD [ "node", "app.js" ]
