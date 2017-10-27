const http = require('http');
const url = require('url');
const fs = require('fs');
const Velocity = require('velocityjs');
const sleep = require('sleep');
const pathToRegexp = require('path-to-regexp');
const path = require('path');

class HttpMockServer {
    constructor(endpoints) {
        this.endpoints = endpoints;
        http.createServer((req, res) => {
            let foundEndpoint = this.findEndpoint(req);

            if (foundEndpoint !== null) {
                if (Array.isArray(foundEndpoint.response)) {

                } else {
                    this.writeResponse(req, res, foundEndpoint, foundEndpoint.response);
                }
            } else {
                res.writeHead(404, {});
            }

            res.end();
        }).listen(80);
    }

    writeResponse(request, response, endpoint, endpointResponse) {
        if (endpointResponse.time) {
            sleep.msleep(v.time);
        }

        response.writeHead(endpointResponse.status || 200, endpointResponse.headers);

        if (endpointResponse.velocity && endpointResponse.velocity.enabled) {
            response.write(Velocity.render(this.getEndpointBody(endpoint, endpointResponse), {
                math: Math,
                req: request,
                endpoint: endpoint,
                context: endpointResponse.velocity.context,
                params: endpoint.params
            }));
        } else {
            response.write(this.getEndpointBody(endpoint, endpointResponse));
        }
    }

    isRequestMatch(endpointRequest, request, endpointParams) {
        if (endpointRequest.method && request.method !== endpointRequest.method) {
            return false;
        }

        let keys = [];
        const re = pathToRegexp(endpointRequest.uri, keys);
        const params = re.exec(request.uri);

        if (params === null) {
            return false;
        }

        let matchQuery = true;

        if (endpointRequest.query) {
            Object.keys(endpointRequest.query).forEach((key) => {
                if (!request.query[key]) {
                    matchQuery = false;
                    return;
                }

                if (!(new RegExp(endpointRequest.query[key])).test(request.query[key])) {
                    matchQuery = false;
                }
            });
        }

        if (!matchQuery) {
            return false;
        }

        let matchHeader = true;

        if (endpointRequest.headers) {
            Object.keys(endpointRequest.headers).forEach((key) => {
                if (!request.headers[key]) {
                    matchHeader = false;
                    return;
                }

                if (!(new RegExp(endpointRequest.headers[key])).test(request.headers[key])) {
                    matchHeader = false;
                }
            });
        }

        if (!matchHeader) {
            return false;
        }

        keys.forEach((key, index) => {
            endpointParams[key.name] = params[index + 1];
        });

        return true;
    }

    findEndpoint(request) {
        let params = {};
        const urlParse = url.parse(request.url, true);
        request.uri = urlParse.pathname;
        request.query = urlParse.query;

        let foundEndpoint = this.endpoints.find((endpoint) => {
            if (Array.isArray(endpoint.request)) {
                if (endpoint.request.find((endpointRequest) => {
                        return this.isRequestMatch(endpointRequest, request, params);
                    })) {
                    return true;
                }
            } else {
                if (this.isRequestMatch(endpoint.request, request, params)) {
                    return true;
                }
            }
        });

        if (!foundEndpoint) {
            return null;
        }

        foundEndpoint = JSON.parse(JSON.stringify(foundEndpoint));
        foundEndpoint.params = params;

        return foundEndpoint;
    }

    getEndpointBody(endpoint, endpointResponse) {
        if (endpointResponse.body !== undefined) {
            return endpointResponse.body;
        }

        return fs.readFileSync(path.resolve(endpoint.currentDirectory, endpointResponse.bodyFile), 'utf8');
    }
}

module.exports = HttpMockServer;