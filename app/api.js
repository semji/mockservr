module.exports = class Api {

  constructor(name) {
    this.endpoints = [];
    this.name = name;
  }

  addEndpoint(endpoint) {
    this.endpoints.push(endpoint);

    return this;
  }

  getEndpoints() {
    return this.endpoints;
  }

  getName() {
    return this.name;
  }
}
