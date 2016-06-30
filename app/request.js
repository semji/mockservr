let url = require('url');

module.exports  = class Request {
  constructor(req) {
    let pathname = url.parse(req.url).pathname;

    this.req = req;
    this.api = pathname.split('/')[1];
    this.uri = pathname.substring(this.api.length + 2);

    console.log('API : ' + this.api);
    console.log('URI: ' + this.uri);
  }
}
