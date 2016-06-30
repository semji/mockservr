var Parser = require('./modules/parser');
var http = require('http');
let Request = require('./request');

var apiParser = new Parser();
apiParser.parse();

var server = http.createServer(function(req, res) {

    res.writeHead(200, {"Content-Type": "text/html"});
    res.end('<p>Voici un paragraphe <strong>HTML</strong> !</p>');

    let request = new Request(req);

    let chunks = [];

    req.on('data', (chunk) => {
      chunks.push(chunk);
    }).on('end', () => {
      request.payload = Buffer.concat(chunks).toString();
    })
});

server.listen(80);
