module.exports = class Endpoint {

  constructor(uri, request, response) {
    this.uri = uri;
    this.request = request;
    this.response = response;
  }

  getUri() {
    return this.request;
  }

  getRequest() {
    return this.request;
  }

  getResponse() {
    return this.response;
  }

  match(request) {
    if (request.method != this.request.method) {
      return false;
    }
    var patt = new RegExp(this.uri.split('?')[0]);
    return patt.test(request.uri);
  }

  respond(response) {
    response.writeHead(this.response.headers.status_code, this.response.headers);
    response.end(JSON.stringify(this.response.body));
  }
}
