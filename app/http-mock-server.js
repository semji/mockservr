const http = require('http');
const url = require('url');
const fs = require('fs');
const Velocity = require('velocityjs');
const sleep = require('sleep');
const path = require('path');
const mime = require('mime');
const { parse } = require('querystring');
const uniqid = require('./uniqid');
const ValidatorsStack = require('./validators/ValidatorsStack');
const VoterStack = require('./voters/VotersStack');
const MaxCallVoter = require('./voters/MaxCallVoter');
const MethodVoter = require('./voters/MethodVoter');
const PathVoter = require('./voters/PathVoter');
const HeaderVoter = require('./voters/HeaderVoter');
const QueryVoter = require('./voters/QueryVoter');
const BodyVoter = require('./voters/BodyVoter');

class HttpMockServer {
  constructor(app) {
    this.app = app;
    this.validatorsStack = new ValidatorsStack();
    this.voterStack = new VoterStack()
      .addVoter(new MaxCallVoter())
      .addVoter(new MethodVoter(this.validatorsStack))
      .addVoter(new PathVoter())
      .addVoter(new HeaderVoter(this.validatorsStack))
      .addVoter(new QueryVoter(this.validatorsStack))
      .addVoter(new BodyVoter(this.validatorsStack));

    http
      .createServer((req, res) => {
        let body = null;
        req.on('data', chunk => {
          if (!body) {
            body = '';
          }
          body += chunk;
        });
        req.on('end', () => {
          if (body) {
            req.body = this.formatReqBody(req, body);
          }

          let foundEndpoint = this.findEndpoint(req);

          if (foundEndpoint !== null) {
            let weightResponseIndexes = [];
            this.prepareEndpointResponses(foundEndpoint.response).forEach(
              (responseItem, index) => {
                weightResponseIndexes = weightResponseIndexes.concat(
                  new Array(responseItem.weight || 1).fill(index)
                );
              }
            );
            const randIndex =
              weightResponseIndexes[
                Math.floor(Math.random() * weightResponseIndexes.length)
              ];
            if (randIndex !== undefined) {
              HttpMockServer.writeResponse(
                req,
                res,
                foundEndpoint,
                this.prepareEndpointResponses(foundEndpoint.response)[randIndex]
              );
            }
          } else {
            res.writeHead(404, {});
          }
          res.end();
        });
      })
      .listen(80);
  }

  static writeResponse(request, response, endpoint, endpointResponse) {
    if (endpointResponse.delay) {
      if (Array.isArray(endpointResponse.delay)) {
        if (endpointResponse.delay.length === 2) {
          sleep.msleep(
            Math.floor(
              Math.random() *
                (endpointResponse.delay[1] - endpointResponse.delay[0])
            ) + endpointResponse.delay[0]
          );
        }
      } else {
        sleep.msleep(endpointResponse.delay);
      }
    }

    response.writeHead(
      endpointResponse.status || 200,
      endpointResponse.headers
    );

    if (endpointResponse.velocity && endpointResponse.velocity.enabled) {
      response.write(
        Velocity.render(
          HttpMockServer.getEndpointBody(endpoint, endpointResponse),
          {
            math: Math,
            req: request,
            endpoint: endpoint,
            context: endpointResponse.velocity.context
          }
        )
      );
    } else {
      response.write(
        HttpMockServer.getEndpointBody(endpoint, endpointResponse)
      );
    }
  }

  isRequestMatch(endpoint, endpointRequest, request, endpointParams) {
    endpoint.callCount = endpoint.callCount || 0;
    return this.voterStack.run(
      endpoint,
      endpointRequest,
      request,
      endpointParams
    );
  }

  findEndpoint(request) {
    let matchParams = {};
    const urlParse = url.parse(request.url, true);
    request.path = urlParse.pathname;
    request.query = urlParse.query;

    let foundEndpoint = this.app.httpEndpoints.find(endpoint => {
      return this.prepareEndpointRequests(endpoint.request).some(
        endpointRequest => {
          return this.isRequestMatch(
            endpoint,
            endpointRequest,
            request,
            matchParams
          );
        }
      );
    });

    if (!foundEndpoint) {
      return null;
    }
    foundEndpoint.callCount++;

    return {
      ...foundEndpoint,
      matchParams,
    };
  }

  static getEndpointBody(endpoint, endpointResponse) {
    if (endpointResponse.body !== undefined) {
      return endpointResponse.body;
    }

    const imageMimeTypes = [
      'image/gif',
      'image/jpeg',
      'image/pjpeg',
      'image/x-png',
      'image/png',
      'image/svg+xml',
    ];

    const bodyFilePath = path.resolve(
      path.dirname(endpoint.filePath),
      endpointResponse.bodyFile
    );

    return fs.readFileSync(
      bodyFilePath,
      imageMimeTypes.indexOf(mime.getType(bodyFilePath)) === -1 ? 'utf8' : null
    );
  }

  prepareEndpointRequests(endpointRequests) {
    if (typeof endpointRequests === 'string') {
      return [
        {
          path: endpointRequests,
        },
      ];
    }

    if (Array.isArray(endpointRequests)) {
      return endpointRequests;
    }

    return [endpointRequests];
  }

  prepareEndpointResponses(EndpointResponses) {
    if (typeof EndpointResponses === 'string') {
      return [
        {
          body: EndpointResponses,
        },
      ];
    }

    if (Array.isArray(EndpointResponses)) {
      return EndpointResponses;
    }

    return [EndpointResponses];
  }

  formatReqBody(req, body) {
    if (body) {
      if (req.headers['content-type']) {
        if (
          req.headers['content-type'] === 'application/x-www-form-urlencoded'
        ) {
          return parse(body);
        }

        if (req.headers['content-type'] === 'application/json') {
          return JSON.parse(body);
        }

        try {
          return JSON.parse(body);
        } catch (error) {
          try {
            return parse(body);
          } catch (error) {
            return body;
          }
        }
      }
    }
    return body;
  }

  static getNewEndpointId() {
    return uniqid();
  }
}

module.exports = HttpMockServer;
