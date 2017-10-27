const fs = require('fs');
const watch = require('node-watch');
const colors = require('colors/safe');
const read = require('fs-readdir-recursive')
const path = require('path');
const ApiServer = require('./api-server');
const HttpMockServer = require('./http-mock-server');

const mocksDirectory = './mocks/';
const LOG_PREFIX = '[mockservr] ';

class App {
    constructor() {
        console.log(LOG_PREFIX + colors.cyan('Starting to compile endpoints...'));
        this.endpoints = [];
        this.buildEndpoints();
        console.log(LOG_PREFIX + colors.cyan('Compilation ended'));
        console.log(LOG_PREFIX + colors.cyan('Ready to handle connections...'));
        this.apiServer = new ApiServer(this.endpoints);
        this.httpMockServer = new HttpMockServer(this.endpoints);
    }

    buildEndpoints() {
        let endpoints = [];

        read(mocksDirectory).filter((fileName) => {
            return path.extname(fileName) === '.mock';
        }).forEach((endpointFile) => {
            const filePath = path.resolve(mocksDirectory, endpointFile);
            let content = fs.readFileSync(filePath, 'utf8');

            try {
                endpoints = endpoints.concat(JSON.parse(content).map((endpoint) => {
                    endpoint.currentDirectory = path.dirname(filePath);

                    return endpoint;
                }));

                console.log(LOG_PREFIX + '\t' + colors.green('File %s successfully compiled'), filePath);
            } catch (e) {
                console.log(LOG_PREFIX + '\t' + colors.red('File %s failed to compile'), filePath);
                console.log(LOG_PREFIX + '\t' + colors.red(e));
            }
        });

        this.endpoints = endpoints;
    }
}

const app = new App();

watch(mocksDirectory, {recursive: true}, () => {
    console.log(LOG_PREFIX + colors.cyan('Change detected, start to compile endpoints...'));
    app.buildEndpoints();
    console.log(LOG_PREFIX + colors.cyan('Compilation ended'));
});
