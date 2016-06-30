var recursive = require('recursive-readdir');
var Api = require('./../api');
var fs = require('fs');
var path = require('path');

module.exports = class Parser {

  constructor(dir) {
      this.apis = new Map()
  }

  parse() {
    recursive('./mocks/', [function(file, stats) {
        return !(path.extname(file) == ".json");
    }], (err, files) => {
        for (let i=0; i<files.length; i++) {
            let apiName = path.basename(files[i], '.json');

            if (this.apis.has(apiName)) {
                let api = this.apis.get(apiName);
            } else {
                let api = new Api(apiName);
            }

            let endpoints = require('./../mocks/' + path.basename(files[i]));
            api.addEndpoint(endpoints[apiName].endpoints));
            this.apis.set(apiName);
        }
    });
  }

  getApis() {
      return this.apis;
  }
}
