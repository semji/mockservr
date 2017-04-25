const http = require('http');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const sleep = require('sleep');
const app = express();
const endpoints = [
    {
        uri: '/toto',
        status: 200,
        time: 0,
        body: '<h1>coucou</h1>',
        headers: {
            'Content-Type': 'text/html; charset=UTF-8',
        }
    }
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/api/endpoints').post((req, res) => {
    if (!req.body.uri || !req.body.status || !req.body.body || !req.body.headers) {
        res.writeHead(400);
        res.end();
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
        });
    }

    res.writeHead(204);
    res.end();
}).get((req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(endpoints));
    res.end();
});

app.use('/', express.static('.'));

app.route('*').get((req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(4580);

http.createServer((req, res) => {
    let foundEndpoint;

    endpoints.forEach((endpoint) => {
        if (!foundEndpoint && req.url === endpoint.uri && (!endpoint.method || req.method === endpoint.method)) {
            foundEndpoint = endpoint;
        }
    });

    if (foundEndpoint) {
        if (foundEndpoint.time) {
            sleep.msleep(foundEndpoint.time);
        }

        res.writeHead(foundEndpoint.status, foundEndpoint.headers);
        res.write(foundEndpoint.body);
    } else {
        res.writeHead(404, {});
    }

    res.end();
}).listen(80);

fs.watchFile('./mocks/', function () {
});
