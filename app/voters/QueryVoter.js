const BaseVoter = require('./BaseVoter');

module.exports = class QueryVoter extends BaseVoter {
  constructor(validatorsStack) {
    super();
    this.validatorsStack = validatorsStack;
  }

  vote({ endpointRequest, request, matchParams }) {
    if (endpointRequest.query === undefined) {
      return {...matchParams};
    }

    let queryMatchParams = {};

    return Object.keys(endpointRequest.query).some(key => {
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
    })
      ? false
      : {
          ...matchParams,
          query: queryMatchParams,
        };
  }
};
