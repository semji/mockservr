const fs = require('fs');
const watch = require('node-watch');
const colors = require('colors/safe');
const read = require('fs-readdir-recursive');
const path = require('path');
const yaml = require('js-yaml');
const HttpApiServer = require('./http-api-server');
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
    this.httpEndpoints = [];
    this.buildEndpoints();
    console.log(LOG_PREFIX + colors.cyan('Compilation ended'));
    console.log(LOG_PREFIX + colors.cyan('Ready to handle connections...'));
    this.httpAppServer = new HttpApiServer(this);
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
    this.httpEndpoints = this.httpEndpoints.filter(
      httpEndpoint => httpEndpoint.source !== 'file'
    );

    read(mocksDirectory)
      .filter(fileName => this.getEndpointFileExtension(fileName) !== undefined)
      .forEach(endpointFile => {
        const filePath = path.resolve(mocksDirectory, endpointFile);
        let content = fs.readFileSync(filePath, 'utf8');
        let parser =
          mockFileExtensionsParsers[this.getEndpointFileExtension(filePath)];

        try {
          let fileHttpEndpoints = this.parseEndpointConfig(content, parser)
            .http;

          if (!Array.isArray(fileHttpEndpoints)) {
            fileHttpEndpoints = [fileHttpEndpoints];
          }

          this.httpEndpoints = this.httpEndpoints.concat(
            fileHttpEndpoints.map(httpEndpoint => ({
              ...httpEndpoint,
              id: HttpMockServer.getNewEndpointId(),
              source: 'file',
              filePath,
            }))
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
