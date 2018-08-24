const BaseAnswerer = require('./BaseAnswerer');

module.exports = class RateLimitAnswerer extends BaseAnswerer {
  static prepareRateLimit(rateLimit) {
    if (!rateLimit) {
      return rateLimit;
    }

    if (typeof rateLimit === 'number') {
      return {
        callCount: rateLimit,
        interval: 1000,
      };
    }

    return rateLimit;
  }

  static getDefaultRateLimitResponse() {
    return {
      status: 429,
      body: 'Too many request',
    };
  }

  answer({ endpoint, endpoints }) {
    let rateLimit = RateLimitAnswerer.prepareRateLimit(endpoint.rateLimit);

    if (rateLimit) {
      if (endpoint.currentCallRate >= rateLimit.callCount) {
        return  {
          stop: true,
          response: rateLimit.response || RateLimitAnswerer.getDefaultRateLimitResponse()
        };
      }
      endpoint.currentCallRate = endpoint.currentCallRate || 0;
      endpoint.currentCallRate++;

      endpoints.forEach((currentEndpoint, index) => {
        if (currentEndpoint.id === endpoint.id) {
          endpoints[index] = {
            ...currentEndpoint,
            currentCallRate: endpoint.currentCallRate,
          };
          setTimeout(() => {
            if (endpoints[index].currentCallRate > 0) {
              endpoints[index].currentCallRate--;
            }
          }, rateLimit.interval)
        }
      });
    }

    return  {
      stop: false,
      response: {}
    };
  }
};
