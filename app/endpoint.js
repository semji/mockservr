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

  checkParamsRequired(request) {
      if (this.request.params.length) {
          let paramRequiredNotFound = false;
          this.request.params.forEach(function(param){
              if (param.required && typeof request.params[param.name] == "undefined") {
                  paramRequiredNotFound = true;
                  return false;
              }
          });

          return paramRequiredNotFound;
      }

      return false;
  }

  respond(response) {
    response.writeHead(this.response.headers.status_code, this.response.headers);
    response.end(JSON.stringify(this.response.body));
  }
}
