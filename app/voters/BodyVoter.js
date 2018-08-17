const BaseVoter = require('./BaseVoter');

module.exports = class QueryVoter extends BaseVoter {
  constructor(validatorsStack) {
    super();
    this.validatorsStack = validatorsStack;
  }

  vote({ endpointRequest, request, matchParams }) {
    if (endpointRequest.body === undefined) {
      return {...matchParams};
    }

    let bodyMatchParams = this.validatorsStack.validate(
      endpointRequest.body,
      request.body
    );

    return bodyMatchParams === false
      ? false
      : {
          ...matchParams,
          body: bodyMatchParams,
        };
  }
};
