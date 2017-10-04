FROM node:8

COPY ./app /usr/src/app

RUN cd /usr/src/app && \
    npm install --production && \
    npm run sass-build && \
    npm run webpack-build

EXPOSE 80
EXPOSE 4580

WORKDIR /usr/src/app

CMD ["node",  "server.js"]
