var http = require('http');
let Request = require('./request');

var server = http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end('<p>Voici un paragraphe <strong>HTML</strong> !</p>');

    let request = new Request(req);
});

server.listen(80);
