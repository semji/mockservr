const fs = require('fs');
const watch = require('node-watch');
const colors = require('colors/safe');
const read = require('fs-readdir-recursive');
const path = require('path');
const yaml = require('js-yaml');
const HttpAppServer = require('./http-app-server');
const HttpMockServer = require('./http-mock-server');

const mocksDirectory = './mocks/';
const LOG_PREFIX = '[mockservr] ';
const PARSER_JSON = 'JSON';
const PARSER_YAML = 'YAML';
const mockFileExtensionsParsers = {
  '.mock': PARSER_JSON,
  '.mock.yml': PARSER_YAML,
  '.mock.yaml': PARSER_YAML,
  '.mock.json': PARSER_JSON,
};

class App {
  constructor() {
    console.log(LOG_PREFIX + colors.cyan('Starting to compile endpoints...'));
    this.endpoints = [];
    this.buildEndpoints();
    console.log(LOG_PREFIX + colors.cyan('Compilation ended'));
    console.log(LOG_PREFIX + colors.cyan('Ready to handle connections...'));
    this.httpAppServer = new HttpAppServer(this);
    this.httpMockServer = new HttpMockServer(this);
  }

  parseEndpointConfig(content, parser) {
    switch (parser) {
      case PARSER_JSON:
        return JSON.parse(content);
      case PARSER_YAML:
        return yaml.safeLoad(content);
    }
  }

  getEndpointFileExtension(fileName) {
    return Object.keys(mockFileExtensionsParsers).find(extension =>
      fileName.endsWith(extension)
    );
  }

  buildEndpoints() {
    this.endpoints = [];

    read(mocksDirectory)
      .filter(fileName => this.getEndpointFileExtension(fileName) !== undefined)
      .forEach(endpointFile => {
        const filePath = path.resolve(mocksDirectory, endpointFile);
        let content = fs.readFileSync(filePath, 'utf8');
        let parser =
          mockFileExtensionsParsers[this.getEndpointFileExtension(filePath)];

        try {
          this.endpoints = this.endpoints.concat(
            this.parseEndpointConfig(content, parser).map(endpoint => {
              endpoint.currentDirectory = path.dirname(filePath);

              return {
                ...endpoint,
                id: HttpMockServer.getNewEndpointId()
              };
            })
          );

          console.log(
            LOG_PREFIX + '\t' + colors.green('File %s successfully compiled'),
            filePath
          );
        } catch (e) {
          console.log(
            LOG_PREFIX + '\t' + colors.red('File %s failed to compile'),
            filePath
          );
          console.log(LOG_PREFIX + '\t' + colors.red(e));
        }
      });
  }
}

const app = new App();

watch(mocksDirectory, { recursive: true }, () => {
  console.log(
    LOG_PREFIX + colors.cyan('Change detected, start to compile endpoints...')
  );
  app.buildEndpoints();
  console.log(LOG_PREFIX + colors.cyan('Compilation ended'));
});
