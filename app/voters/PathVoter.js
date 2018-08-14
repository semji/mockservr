const pathToRegexp = require('path-to-regexp');
const BaseVoter = require('./BaseVoter');

module.exports = class PathVoter extends BaseVoter {
  static getEndpointPath(endpoint, endpointRequest) {
    let basePath = endpoint.basePath || '';

    if (basePath !== '') {
      basePath = '/' + basePath.replace(/^\//, '');
    }

    return (
      basePath.replace(/\/$/, '') +
      '/' +
      endpointRequest.path.replace(/^\//, '')
    );
  }

  vote(endpoint, endpointRequest, request, matchParams) {
    let keys = [];
    const re = pathToRegexp(
      PathVoter.getEndpointPath(endpoint, endpointRequest),
      keys
    );

    const params = re.exec(request.path);

    if (params === null) {
      return false;
    }

    matchParams.path = [];

    keys.forEach((key, index) => {
      matchParams.path[key.name] = params[index + 1];
    });

    return true;
  }
};
