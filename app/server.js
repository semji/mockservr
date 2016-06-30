var Parser = require('./modules/parser');
var http = require('http');
let Request = require('./request');

var apiParser = new Parser();
apiParser.parse();

var server = http.createServer(function(req, res) {
    let foundEndpoint = false;

    let request = new Request(req);

    let chunks = [];

    req.on('data', (chunk) => {
      chunks.push(chunk);
    }).on('end', () => {
      request.payload = Buffer.concat(chunks).toString();
      apiParser.getApis().forEach(function(api) {

        if (api.getName() == request.api) {
          api.getEndpoints().forEach(function(endpoint) {
              if (endpoint.match(request)) {
                endpoint.respond(res);

                foundEndpoint = true;
                return false;
              }

              return true;
          });

          return false;
        }

        return true;
      });

      if (!foundEndpoint) {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end('<h1>404 not Found!</h1>');
      }
    })
});

server.listen(80);
