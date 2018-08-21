const BaseVoter = require('./BaseVoter');

module.exports = class MaxCallVoter extends BaseVoter {
  vote({ endpoint, matchParams }) {
    return endpoint.maxCalls && endpoint.callCount >= endpoint.maxCalls
      ? false
      : {
          ...matchParams,
          maxCalls: true,
        };
  }
};
