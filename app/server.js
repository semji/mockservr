var Parser = require('./modules/parser');
var http = require('http');
let Request = require('./request');

var apiParser = new Parser();
apiParser.parse();

var server = http.createServer(function(req, res) {
    let foundEndpoint = false;
    let foundApi = false;
    let foundRequiredParam = false;

    let request = new Request(req);

    let chunks = [];

    req.on('data', (chunk) => {
      chunks.push(chunk);
    }).on('end', () => {
      request.payload = Buffer.concat(chunks).toString();
      apiParser.getApis().forEach(function(api) {

        if (api.getName() == request.api) {
          foundApi = true;
          api.getEndpoints().forEach(function(endpoint) {
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
    })
});

server.listen(80);
