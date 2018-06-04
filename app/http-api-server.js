const express = require('express');
const bodyParser = require('body-parser');
const httpMockServer = require('./http-mock-server');

class HttpApiServer {
  constructor(app) {
    this.app = app;
    this.api = express();
    this.api.use(bodyParser.json());
    this.api.use(bodyParser.urlencoded({ extended: true }));

    this.api
      .route('/api/endpoints')
      .post((req, res) => {
        let newEndpoint = req.body;

        if (!newEndpoint.request) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.write(
            JSON.stringify({
              error: 'Endpoint request required',
            })
          );
          res.end();
          return;
        }

        if (!newEndpoint.response) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.write(
            JSON.stringify({
              error: 'Endpoint response required',
            })
          );
          res.end();
          return;
        }

        newEndpoint = {
          ...newEndpoint,
          id: httpMockServer.getNewEndpointId(),
          source: 'user',
        };

        this.app.endpoints.push(newEndpoint);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(newEndpoint));
        res.end();
      })
      .get((req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(this.app.endpoints));
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
