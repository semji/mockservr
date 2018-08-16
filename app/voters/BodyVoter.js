const BaseVoter = require('./BaseVoter');

module.exports = class QueryVoter extends BaseVoter {
  constructor(validatorsStack) {
    super();
    this.validatorsStack = validatorsStack;
  }

  vote(endpoint, endpointRequest, request, matchParams) {
    if (endpointRequest.body === undefined) {
      return true;
    }

    matchParams.body = this.validatorsStack.validate(
      endpointRequest.body,
      request.body
    );

    return matchParams.body !== false;
  }
};
