const BaseVoter = require('./BaseVoter');

module.exports = class HeaderVoter extends BaseVoter {
  constructor(validatorsStack) {
    super();
    this.validatorsStack = validatorsStack;
  }

  vote({ endpointRequest, request, matchParams }) {
    if (endpointRequest.headers === undefined) {
      return { ...matchParams };
    }

    if (Object.keys(endpointRequest.headers).length === 0) {
      return Object.keys(request.headers).length === 0;
    }

    let headersMatchParams = {};

    return Object.keys(endpointRequest.headers).some(key => {
      if (request.headers[key] === undefined) {
        return true;
      }

      headersMatchParams[key] = this.validatorsStack.validate(
        endpointRequest.headers[key],
        request.headers[key]
      );

      return false === headersMatchParams[key];
    })
      ? false
      : {
          ...matchParams,
          headers: headersMatchParams,
        };
  }
};
