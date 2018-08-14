const BaseVoter = require('./BaseVoter');

module.exports = class HeaderVoter extends BaseVoter {
  constructor(validatorsStack) {
    super();
    this.validatorsStack = validatorsStack;
  }

  vote(endpoint, endpointRequest, request, matchParams) {
    if (endpointRequest.headers === undefined) {
      return true;
    }

    return !Object.keys(endpointRequest.headers).some(key => {
      if (request.headers[key] === undefined) {
        return true;
      }

      matchParams.headers[key] = request.headers[key];

      return (
        false ===
        this.validatorsStack.validate(
          endpointRequest.headers[key],
          request.headers[key]
        )
      );
    });
  }
};
