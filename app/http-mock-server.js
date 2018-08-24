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
const AnswererStack = require('./answerers/AnswererStack');
const VoterStack = require('./voters/VotersStack');
const MaxCallsVoter = require('./voters/MaxCallsVoter');
const MethodVoter = require('./voters/MethodVoter');
const PathVoter = require('./voters/PathVoter');
const HeaderVoter = require('./voters/HeaderVoter');
const QueryVoter = require('./voters/QueryVoter');
const BodyVoter = require('./voters/BodyVoter');

class HttpMockServer {
  constructor(app) {
    this.app = app;
    this.validatorsStack = new ValidatorsStack();
    this.answererStack = new AnswererStack();
    this.voterStack = new VoterStack()
      .addVoter(new MaxCallsVoter())
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
            HttpMockServer.writeResponse(
              req,
              res,
              foundEndpoint,
              this.answererStack.run(foundEndpoint, req, this.app.httpEndpoints)
            );
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
      if (
        typeof endpointResponse.delay === 'object' &&
        endpointResponse.delay !== null
      ) {
        const minDelay = endpointResponse.delay.min || 0;
        const maxDelay = endpointResponse.delay.max || 10000;

        sleep.msleep(
          Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay
        );
      } else {
        sleep.msleep(endpointResponse.delay);
      }
    }

    response.writeHead(
      endpointResponse.status || 200,
      endpointResponse.headers
    );

    let velocityOptions = endpointResponse.velocity;

    if (typeof velocityOptions === 'boolean') {
      velocityOptions = {
        enabled: velocityOptions,
      };
    }

    if (velocityOptions && velocityOptions.enabled) {
      response.write(
        Velocity.render(
          HttpMockServer.getEndpointBody(endpoint, endpointResponse),
          {
            math: Math,
            req: request,
            endpoint: endpoint,
            context: velocityOptions.context,
          }
        )
      );
    } else {
      response.write(
        HttpMockServer.getEndpointBody(endpoint, endpointResponse)
      );
    }
  }

  findEndpoint(request) {
    let matchParams = {};
    const urlParse = url.parse(request.url, true);
    request.path = urlParse.pathname;
    request.query = urlParse.query;

    let foundEndpoint = this.app.httpEndpoints.find(endpoint => {
      endpoint.callCount = endpoint.callCount || 0;
      return this.prepareEndpointRequests(endpoint.request).some(
        endpointRequest => {
          matchParams = this.voterStack.run(endpoint, endpointRequest, request);
          return matchParams !== false;
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
