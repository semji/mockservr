const express = require('express');
const bodyParser = require('body-parser');

class HttpAppServer {
    constructor(app) {
        this.app = app;
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        this.app.route('/api/endpoints').post((req, res) => {
            if (!req.body.uri || !req.body.status || !req.body.body || !req.body.headers) {
                res.writeHead(400);
                res.end();
                return;
            }

            let createNew = true;
            let uriFounded = false;

            this.app.endpoints.forEach((endpoint, index) => {
                if (req.body.uri === endpoint.uri) {
                    if (req.body.method === endpoint.method) {
                        this.app.endpoints[index] = {
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
                        this.app.endpoints.splice(index, 0, {
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
                    this.app.endpoints.splice(index, 0, {
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
                this.app.endpoints.push({
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
            res.write(JSON.stringify(this.app.endpoints));
            res.end();
        }).delete((req, res) => {
            if (!req.body.uri) {
                res.writeHead(400);
                res.end();
                return;
            }

            this.app.endpoints.forEach((endpoint, index) => {
                if (req.body.uri === endpoint.uri && (!req.body.method || req.body.method === endpoint.method)) {
                    this.app.endpoints.splice(index, 1);
                }
            });

            res.writeHead(204);
            res.end();
        });

        this.app.use('/', express.static('.'));

        this.app.route('*').get((req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        this.app.listen(4580);
    }
}

module.exports = HttpAppServer;