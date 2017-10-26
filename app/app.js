const http = require('http');
const url = require('url');
const fs = require('fs');
const watch = require('node-watch');
const colors = require('colors/safe');
const read = require('fs-readdir-recursive')
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Velocity = require('velocityjs');
const sleep = require('sleep');
const pathToRegexp = require('path-to-regexp');
const app = express();
const mocksDirectory = './mocks/';

const LOG_PREFIX = '[mockservr] ';

console.log(LOG_PREFIX + colors.cyan('Starting to compile endpoints...'));

let endpoints = buildEndpoints();

console.log(LOG_PREFIX + colors.cyan('Compilation ended'));

console.log(LOG_PREFIX + colors.cyan('Ready to handle connections...'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.route('/api/endpoints').post((req, res) => {
    if (!req.body.uri || !req.body.status || !req.body.body || !req.body.headers) {
        res.writeHead(400);
        res.end();
        return;
    }

    let createNew = true;
    let uriFounded = false;

    endpoints.forEach((endpoint, index) => {
        if (req.body.uri === endpoint.uri) {
            if (req.body.method === endpoint.method) {
                endpoints[index] = {
                    uri: req.body.uri,
                    method: req.body.method,
                    status: req.body.status,
                    time: req.body.time,
                    body: req.body.body,
                    headers: req.body.headers,
                    velocity: req.body.velocity ? req.body.velocity : {enabled: true},
                };
                createNew = false;
            } else if (!endpoint.method && createNew) {
                endpoints.splice(index, 0, {
                    uri: req.body.uri,
                    method: req.body.method,
                    status: req.body.status,
                    time: req.body.time,
                    body: req.body.body,
                    headers: req.body.headers,
                    velocity: req.body.velocity ? req.body.velocity : {enabled: true},
                });
                createNew = false;
            }
            uriFounded = true;
        } else if (uriFounded && createNew) {
            endpoints.splice(index, 0, {
                uri: req.body.uri,
                method: req.body.method,
                status: req.body.status,
                time: req.body.time,
                body: req.body.body,
                headers: req.body.headers,
                velocity: req.body.velocity ? req.body.velocity : {enabled: true},
            });
            createNew = false;
        }
    });

    if (createNew) {
        endpoints.push({
            uri: req.body.uri,
            method: req.body.method,
            status: req.body.status,
            time: req.body.time,
            body: req.body.body,
            headers: req.body.headers,
            velocity: req.body.velocity ? req.body.velocity : {enabled: true},
        });
    }

    res.writeHead(204);
    res.end();
}).get((req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(endpoints));
    res.end();
}).delete((req, res) => {
    if (!req.body.uri) {
        res.writeHead(400);
        res.end();
        return;
    }

    endpoints.forEach((endpoint, index) => {
        if (req.body.uri === endpoint.uri && (!req.body.method || req.body.method === endpoint.method)) {
            endpoints.splice(index, 1);
        }
    });

    res.writeHead(204);
    res.end();
});

app.use('/', express.static('.'));

app.route('*').get((req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(4580);

http.createServer((req, res) => {
    let foundEndpoint = findEndpoint(endpoints, req);

    if (foundEndpoint !== null) {
        if (Array.isArray(foundEndpoint.response)) {

        } else {
            writeResponse(req, res, foundEndpoint, foundEndpoint.response);
        }
    } else {
        res.writeHead(404, {});
    }

    res.end();
}).listen(80);

function writeResponse(request, response, endpoint, endpointResponse) {
    if (endpointResponse.time) {
        sleep.msleep(v.time);
    }

    response.writeHead(endpointResponse.status || 200, endpointResponse.headers);

    if (endpointResponse.velocity && endpointResponse.velocity.enabled) {
        response.write(Velocity.render(getEndpointBody(endpoint, endpointResponse), {
            math: Math,
            req: request,
            endpoint: endpoint,
            context: endpointResponse.velocity.context,
            params: endpoint.params
        }));
    } else {
        response.write(getEndpointBody(endpoint, endpointResponse));
    }
}

function isRequestMatch(endpointRequest, request, endpointParams) {
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

function findEndpoint(endpoints, request) {
    let params = {};
    const urlParse = url.parse(request.url, true);
    request.uri = urlParse.pathname;
    request.query = urlParse.query;

    let foundEndpoint = endpoints.find((endpoint) => {
        if (Array.isArray(endpoint.request)) {
            if (endpoint.request.find((endpointRequest) => {
                    return isRequestMatch(endpointRequest, request, params);
                })) {
                return true;
            }
        } else {
            if (isRequestMatch(endpoint.request, request, params)) {
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

function getEndpointBody(endpoint, endpointResponse) {
    if (endpointResponse.body !== undefined) {
        return endpointResponse.body;
    }

    return fs.readFileSync(path.resolve(endpoint.currentDirectory, endpointResponse.bodyFile), 'utf8');
}

function buildEndpoints() {
    let endpoints = [];

    read(mocksDirectory).filter((fileName) => {
        return path.extname(fileName) === '.mock';
    }).forEach((endpointFile) => {
        const filePath = path.resolve(mocksDirectory, endpointFile);
        let content = fs.readFileSync(filePath, 'utf8');

        try {
            endpoints = endpoints.concat(JSON.parse(content).map((endpoint) => {
                endpoint.currentDirectory = path.dirname(filePath);

                return endpoint;
            }));

            console.log(LOG_PREFIX + '\t' + colors.green('File %s successfully compiled'), filePath);
        } catch (e) {
            console.log(LOG_PREFIX + '\t' + colors.red('File %s failed to compile'), filePath);
            console.log(LOG_PREFIX + '\t' + colors.red(e));
        }
    });

    return endpoints;
}

watch(mocksDirectory, {recursive: true}, () => {
    console.log(LOG_PREFIX + colors.cyan('Change detected, start to compile endpoints...'));
    endpoints = buildEndpoints();
    console.log(LOG_PREFIX + colors.cyan('Compilation ended'));
});
