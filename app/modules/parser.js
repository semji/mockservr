var recursive = require('recursive-readdir');
var fs = require('fs');

module.exports = class Parser {

  constructor(dir) {
      this.dir = dir;
  }

  parse() {
    recursive(this.dir, ['.*'], function (err, files) {
        console.log(files);
    });
  }
}
