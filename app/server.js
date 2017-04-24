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

    endpoints.forEach((endpoint, index) => {
        if (req.body.uri === endpoint.uri) {
            endpoints[index] = {
                uri: req.body.uri,
                status: req.body.status,
                time: req.body.time,
                body: req.body.body,
                headers: req.body.headers,
            };
            createNew = false;
        }
    });

    if (createNew) {
        endpoints.push({
            uri: req.body.uri,
            status: req.body.status,
            time: req.body.time,
            body: req.body.body,
            headers: req.body.headers,
        });
    }

    res.writeHead(204);
    res.end();
}).get((req, res) => {
    let data = [];

    endpoints.forEach((endpoint, index) => {
        data.push(endpoint);
        data[data.length - 1].id = index;
    });

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(data));
    res.end();
});

app.use('/', express.static('.'));

app.listen(4580);

http.createServer((req, res) => {
    endpoints.forEach((endpoint) => {
        if (req.url === endpoint.uri) {

            if (endpoint.time) {
                sleep.msleep(endpoint.time);
            }

            res.writeHead(endpoint.status, endpoint.headers);
            res.write(endpoint.body);
            res.end();
        }
    });
    res.writeHead(404, {});
    res.end();
}).listen(80);

fs.watchFile('./mocks/', function () {
});
