const BaseVoter = require('./BaseVoter');

module.exports = class MaxCallVoter extends BaseVoter {
  vote(endpoint) {
    return !(endpoint.maxCalls && endpoint.callCount >= endpoint.maxCalls);
  }
};
