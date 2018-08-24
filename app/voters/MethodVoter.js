const BaseVoter = require('./BaseVoter');

module.exports = class MethodVoter extends BaseVoter {
  constructor(validatorsStack) {
    super();
    this.validatorsStack = validatorsStack;
  }

  vote({endpoint, endpointRequest, request, matchParams }) {
    if (endpointRequest.method === undefined || (endpoint.crossOrigin && request.method === 'OPTIONS')) {
      return {...matchParams};
    }

    let methodMatchParams = this.validatorsStack.validate(
      endpointRequest.method,
      request.method
    );

    return methodMatchParams === false
      ? false
      : {
          ...matchParams,
          method: methodMatchParams,
        };
  }
};
