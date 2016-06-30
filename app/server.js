var Parser = require('./modules/parser');
var http = require('http');

var apiParser = new Parser('./mocks/');
apiParser.parse();

var server = http.createServer(function(req, res) {

    res.writeHead(200, {"Content-Type": "text/html"});
    res.end('<p>Voici un paragraphe <strong>HTML</strong> !</p>');
});

server.listen(80);
