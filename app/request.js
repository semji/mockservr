let url = require('url');
let querystring = require('querystring');

module.exports  = class Request {
  constructor(req) {
    let pathname = url.parse(req.url).pathname;

    this.req = req;
    this.api = pathname.split('/')[1];
    this.uri = pathname.substring(this.api.length + 2);
    this.params = querystring.parse(url.parse(req.url).query);
    this.method = req.method;
    this.payload = null;
  }
}
