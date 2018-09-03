const BaseAnswerer = require('./BaseAnswerer');

module.exports = class CrossOriginAnswerer extends BaseAnswerer {
  static getDefaultCrossOriginResponse(request) {
    return {
      headers: {
        'access-control-allow-credentials': 'true',
        'access-control-allow-headers': request.headers['access-control-request-headers'] || '*',
        'access-control-allow-methods': 'GET,HEAD,POST,PUT,DELETE,CONNECT,OPTIONS,TRACE,PATCH',
        'access-control-allow-origin': '*',
        'access-control-max-age': '3600',
      },
    };
  }

  answer({ endpoint, request }) {
    if (endpoint.crossOrigin) {
      const crossOriginResponse = typeof endpoint.crossOrigin === 'object'
        ? endpoint.crossOrigin
        : CrossOriginAnswerer.getDefaultCrossOriginResponse(request);

      if (request.method === 'OPTIONS') {
        return {
          stop: true,
          response: crossOriginResponse
        };
      }

      return {
        stop: false,
        response: crossOriginResponse
      };
    }

    return {
      stop: false,
      response: {}
    };
  }
};
