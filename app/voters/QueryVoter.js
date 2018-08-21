const BaseVoter = require('./BaseVoter');

module.exports = class QueryVoter extends BaseVoter {
  constructor(validatorsStack) {
    super();
    this.validatorsStack = validatorsStack;
  }

  vote({ endpointRequest, request, matchParams }) {
    if (endpointRequest.query === undefined) {
      return { ...matchParams };
    }

    if (Object.keys(endpointRequest.query).length === 0) {
      return Object.keys(request.query).length === 0;
    }

    let queryMatchParams = {};

    return Object.keys(endpointRequest.query).some(key => {
      if (request.query[key] === undefined) {
        return true;
      }

      queryMatchParams[key] = this.validatorsStack.validate(
        endpointRequest.query[key],
        request.query[key]
      );

      return false === queryMatchParams[key];
    })
      ? false
      : {
          ...matchParams,
          query: queryMatchParams,
        };
  }
};
