const http = require('http');
const url = require('url');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const Velocity = require('velocityjs');
const sleep = require('sleep');
const pathToRegexp = require('path-to-regexp');
const app = express();
const endpoints = require('./endpoints');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/api/endpoints').post((req, res) => {
    if (!req.body.uri || !req.body.status || !req.body.body || !req.body.headers) {
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
                    velocity: req.body.velocity ? req.body.velocity : { enabled: true},
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
                    velocity: req.body.velocity ? req.body.velocity : { enabled: true},
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
                velocity: req.body.velocity ? req.body.velocity : { enabled: true},
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
            velocity: req.body.velocity ? req.body.velocity : { enabled: true},
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
        if (req.body.uri === endpoint.uri && (!req.body.method || req.body.method === endpoint.method)) {
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
    const uri = url.parse(req.url).pathname;

    endpoints.forEach((endpoint) => {
        let keys = [];
        const re = pathToRegexp(endpoint.uri, keys);
        const params = re.exec(uri);

        if (!foundEndpoint && params !== null && (!endpoint.method || req.method === endpoint.method)) {
            foundEndpoint = JSON.parse(JSON.stringify(endpoint));
            foundEndpoint.params = {};

            keys.forEach((key, index) => {
                foundEndpoint.params[key.name] = params[index+1];
            });
        }
    });

    if (foundEndpoint) {
        if (foundEndpoint.time) {
            sleep.msleep(foundEndpoint.time);
        }

        res.writeHead(foundEndpoint.status, foundEndpoint.headers);

        if (foundEndpoint.velocity.enabled) {
            res.write(Velocity.render(foundEndpoint.body, {
                math: Math,
                req: req,
                endpoint: foundEndpoint,
                context: foundEndpoint.velocity.context,
                params: foundEndpoint.params
            }));
        } else {
            res.write(foundEndpoint.body);
        }
    } else {
        res.writeHead(404, {});
    }

    res.end();
}).listen(80);

fs.watchFile('./mocks/', function () {
});
