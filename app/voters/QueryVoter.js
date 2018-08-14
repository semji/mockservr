const BaseVoter = require('./BaseVoter');

module.exports = class QueryVoter extends BaseVoter {
  constructor(validatorsStack) {
    super();
    this.validatorsStack = validatorsStack;
  }

  vote(endpoint, endpointRequest, request, matchParams) {
    if (endpointRequest.query === undefined) {
      return true;
    }

    return !Object.keys(endpointRequest.query).some(key => {
      if (request.query[key] === undefined) {
        return true;
      }

      matchParams.query[key] = request.query[key];

      return (
        false ===
        this.validatorsStack.validate(
          endpointRequest.query[key],
          request.query[key]
        )
      );
    });
  }
};
