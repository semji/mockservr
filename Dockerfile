FROM node:7

COPY ./app /usr/src/app

CMD ["node",  "server.js"]

EXPOSE 80
EXPOSE 4580

WORKDIR /usr/src/app
