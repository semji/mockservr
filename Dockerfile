FROM node:6

COPY ./app /usr/src/app

ENTRYPOINT ["node",  "server.js"]

EXPOSE 80

WORKDIR /usr/src/app
