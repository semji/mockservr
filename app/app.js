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

const LOG_PREFIX = '[mockserver] ';

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
    let foundEndpoint;
    const urlParse = url.parse(req.url, true);
    const uri = urlParse.pathname;
    req.query = urlParse.query;

    endpoints.forEach((endpoint) => {
        let keys = [];
        const re = pathToRegexp(endpoint.uri, keys);
        const params = re.exec(uri);

        if (!foundEndpoint && params !== null && isEndpointMatch(endpoint, req)) {
            foundEndpoint = JSON.parse(JSON.stringify(endpoint));
            foundEndpoint.params = {};

            keys.forEach((key, index) => {
                foundEndpoint.params[key.name] = params[index + 1];
            });
        }
    });

    if (foundEndpoint) {
        if (foundEndpoint.time) {
            sleep.msleep(foundEndpoint.time);
        }

        res.writeHead(foundEndpoint.status, foundEndpoint.headers);

        if (foundEndpoint.velocity.enabled) {
            res.write(Velocity.render(getEndpointBody(foundEndpoint), {
                math: Math,
                req: req,
                endpoint: foundEndpoint,
                context: foundEndpoint.velocity.context,
                params: foundEndpoint.params
            }));
        } else {
            res.write(getEndpointBody(foundEndpoint));
        }
    } else {
        res.writeHead(404, {});
    }

    res.end();
}).listen(80);

function isEndpointMatch(endpoint, request) {
    let matchQuery = true;

    if (endpoint.query) {
        Object.keys(endpoint.query).forEach((key) => {
            if (!request.query[key]) {
                matchQuery = false;

                return ;
            }

            if (request.query[key] === endpoint.query[key]) {
                return ;
            }

            matchQuery = false;
        });
    }

    return (!endpoint.method || request.method === endpoint.method) && matchQuery;
}

function getEndpointBody(endpoint) {
    if (endpoint.body) {
        return endpoint.body;
    }

    return fs.readFileSync(path.resolve(endpoint.currentDirectory, endpoint.bodyFile), 'utf8');
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
