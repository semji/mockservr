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

  }

  respond(response) {

  }
}
