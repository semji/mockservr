const BaseVoter = require('./BaseVoter');

module.exports = class MethodVoter extends BaseVoter {
  constructor(validatorsStack) {
    super();
    this.validatorsStack = validatorsStack;
  }

  vote(endpoint, endpointRequest, request, matchParams) {
    if (endpointRequest.method === undefined) {
      return true;
    }

    matchParams.method = this.validatorsStack.validate(
      endpointRequest.method,
      request.method
    );
    return false !== matchParams.method;
  }
};
