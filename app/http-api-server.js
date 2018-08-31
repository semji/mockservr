const fs = require('fs');
const express = require('express');
const { body, param, validationResult } = require('express-validator/check');
const bodyParser = require('body-parser');
const httpMockServer = require('./http-mock-server');

class HttpApiServer {
  constructor(app) {
    this.app = app;
    this.api = express();
    this.api.use(bodyParser.json());
    this.api.use(bodyParser.urlencoded({ extended: true }));
    this.api.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      next();
    });

    this.api.route('/api').get((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(
        JSON.stringify({
          'httpEndpoints': {
            count: this.app.httpEndpoints.length,
          },
        })
      );
      res.end();
    });

    this.api
      .route('/api/http-endpoints')
      .get((req, res) => {
        return res.status(200).json(this.app.httpEndpoints);
      })
      .post(
        [
          body('request', 'Request is required').exists(),
          body('response', 'Request is required').exists(),
        ],
        (req, res) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }

          const newEndpoint = {
            ...req.body,
            id: httpMockServer.getNewEndpointId(),
            source: 'user',
          };

          this.app.httpEndpoints.push(newEndpoint);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(newEndpoint));
          res.end();
        }
      );

    this.api
      .route('/api/http-endpoints/:id')
      .get([param('id', 'Id is required').exists()], (req, res) => {
        const endpoint = this.app.httpEndpoints.find(
          endpoint => endpoint.id === req.params.id
        );

        if (!endpoint) {
          return res.status(404).end();
        }

        return res.status(200).json(endpoint);
      })
      .delete([param('id', 'Id is required').exists()], (req, res) => {
        this.app.httpEndpoints = this.app.httpEndpoints.filter(
          endpoint => endpoint.id !== req.params.id
        );

        return res.status(204).end();
      });

    this.api.use('/', express.static('.'));

    this.api.route('*').get((req, res) => {
      res.sendFile(__dirname + '/index.html');
    });

    this.api.listen(4580);
  }
}

module.exports = HttpApiServer;
