var recursive = require('recursive-readdir');
var Api = require('./../api');
var Endpoint = require('./../endpoint');
var fs = require('fs');
var path = require('path');

module.exports = class Parser {

  constructor() {
      this.apis = new Map()
  }

  parse() {
    recursive('./mocks/', [function(file, stats) {
        return !(path.extname(file) == ".json");
    }], (err, files) => {
        for (let i=0; i<files.length; i++) {
            let apiName = path.basename(files[i], '.json');

            let api;
            if (this.apis.has(apiName)) {
                api = this.apis.get(apiName);
            } else {
                api = new Api(apiName);
            }

            let config = require('./../mocks/' + path.basename(files[i]));
            let endpoints = config[apiName].endpoints

            for (let j=0; j< endpoints.length; j++) {
                let item = endpoints[j];
                let endpoint = new Endpoint(item.uri, item.request, item.response);
                api.addEndpoint(endpoint);
            }

            this.apis.set(apiName, api);
        }
    });

  }

  getApis() {
      return this.apis
  }
}
