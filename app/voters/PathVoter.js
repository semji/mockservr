const pathToRegexp = require('path-to-regexp');
const BaseVoter = require('./BaseVoter');

module.exports = class PathVoter extends BaseVoter {
  static getEndpointPath(endpoint, endpointRequest) {
    let basePath = endpoint ? endpoint.basePath || '' : '';

    if (basePath !== '') {
      basePath = '/' + basePath.replace(/^\//, '');
    }

    return (
      basePath.replace(/\/$/, '') +
      '/' +
      endpointRequest.path.replace(/^\//, '')
    );
  }

  vote({ endpoint, endpointRequest, request, matchParams }) {
    if (endpointRequest.path === undefined) {
      return { ...matchParams };
    }

    let keys = [];
    const re = pathToRegexp(
      PathVoter.getEndpointPath(endpoint, endpointRequest),
      keys
    );

    const params = re.exec(request.path);

    if (params === null) {
      return false;
    }

    let pathMatchParams = {};

    keys.forEach((key, index) => {
      pathMatchParams[key.name] = params[index + 1];
    });

    return {
      ...matchParams,
      path: pathMatchParams,
    };
  }
};
