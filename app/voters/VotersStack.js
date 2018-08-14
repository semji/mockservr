const BaseVoter = require('./BaseVoter');

module.exports = class VotersStack {
  constructor() {
    this.voters = [];
  }

  addVoter(voter) {
    this.voters.push(voter);

    return this;
  }

  run(endpoint, endpointRequest, request, matchParams) {
    return !this.voters.some(voter => {
      return !voter.vote(endpoint, endpointRequest, request, matchParams);
    });
  }
};
