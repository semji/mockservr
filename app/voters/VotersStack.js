module.exports = class VotersStack {
  constructor() {
    this.voters = [];
  }

  addVoter(voter) {
    this.voters.push(voter);

    return this;
  }

  run(endpoint, endpointRequest, request) {
    let matchParams = {};

    return this.voters.some(voter => {
      matchParams = voter.vote({
        endpoint,
        endpointRequest,
        request,
        matchParams,
      });
      return matchParams === false;
    })
      ? false
      : matchParams;
  }
};
