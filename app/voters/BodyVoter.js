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

    return !Object.keys(endpointRequest.body).some(key => {
      if (request.body[key] === undefined) {
        return true;
      }

      matchParams.body[key] = request.body[key];

      return (
        false ===
        this.validatorsStack.validate(
          endpointRequest.body[key],
          request.body[key]
        )
      );
    });
  }
};
