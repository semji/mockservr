module.exports = class Api {

  constructor(name) {
    this.endpoints = [];
    this.name = name;
  }

  addEndpoint(endpoint) {
    this.endpoints.push(endpoint);
  }

  getEndpoints() {
    return this.endpoints;
  }

  getName() {
    return this.name;
  }
}
