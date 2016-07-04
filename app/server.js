var Parser = require('./modules/parser');
var http = require('http');
var fs = require('fs');
let Request = require('./request');

var apiParser = new Parser();
apiParser.parse();


fs.watchFile('./mocks/', function () {
    apiParser.clear().parse();
});

var server = http.createServer(function (req, res) {
    let foundEndpoint = false;
    let foundApi = false;
    let foundRequiredParam = false;

    let request = new Request(req);

    let chunks = [];

    req.on('data', (chunk) => {
        chunks.push(chunk);
    }).on('end', () => {
        request.payload = Buffer.concat(chunks).toString();
        if (request.api == 'list') {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write('<!DOCTYPE html>' +
                '<html>' +
                '    <head>' +
                '        <meta charset="utf-8" />' +
                '        <title>Api list</title>' +
                '    </head>' +
                '    <body>');
            apiParser.getApis().forEach(function (api) {
                res.write('<h1>' + api.getName() + '</h1><ul>');
                api.getEndpoints().forEach(function (endpoint) {
                    res.write('<li>' + endpoint.request.method + ' ' + endpoint.uri + ' ' + '</li>');
                });
                res.write('</ul>');
            });
            res.end('</body></html>');
        } else {
            apiParser.getApis().forEach(function (api) {

                if (api.getName() == request.api) {
                    foundApi = true;
                    api.getEndpoints().forEach(function (endpoint) {
                        if (endpoint.match(request)) {
                            foundEndpoint = true;
                            if (endpoint.checkParamsRequired(request)) {
                                foundRequiredParam = true;
                                return false;
                            }
                            endpoint.respond(res);
                            return false;
                        }

                        return true;
                    });

                    return false;
                }

                return true;
            });

            if (!foundApi) {
                res.writeHead(800, {"Content-Type": "text/html"});
                res.end('<h1>Api not found!</h1>');
            }

            if (!foundEndpoint) {
                res.writeHead(801, {"Content-Type": "text/html"});
                res.end('<h1>Endpoint not Found!</h1>');
            }

            if (foundRequiredParam) {
                res.writeHead(802, {"Content-Type": "text/html"});
                res.end('<h1>Param required missing!</h1>');
            }
        }
    })
});

server.listen(80);
