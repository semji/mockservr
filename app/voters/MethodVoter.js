const BaseVoter = require('./BaseVoter');

module.exports = class MethodVoter extends BaseVoter {
  constructor(validatorsStack) {
    super();
    this.validatorsStack = validatorsStack;
  }

  vote({ endpointRequest, request, matchParams }) {
    if (endpointRequest.method === undefined) {
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
