const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const httpMockServer = require('./http-mock-server');

class HttpApiServer {
  constructor(app) {
    this.app = app;
    this.api = express();
    this.api.use(bodyParser.json());
    this.api.use(bodyParser.urlencoded({ extended: true }));

    this.api.route('/api').get((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(
        JSON.stringify({
          'http-endpoints': {
            count: this.app.httpEndpoints.length,
          },
        })
      );
      res.end();
    });

    this.api.route('/api/http-endpoints')
      .get((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(this.app.httpEndpoints));
      res.end();
    });

    this.api.use('/', express.static('.'));

    this.api.route('*').get((req, res) => {
      res.sendFile(__dirname + '/index.html');
    });

    this.api.listen(4580);
  }
}

module.exports = HttpApiServer;
