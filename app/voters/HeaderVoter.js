const BaseVoter = require('./BaseVoter');

module.exports = class HeaderVoter extends BaseVoter {
  constructor(validatorsStack) {
    super();
    this.validatorsStack = validatorsStack;
  }

  vote({ endpointRequest, request, matchParams }) {
    if (endpointRequest.headers === undefined) {
      return {...matchParams};
    }

    let headersMatchParams = {};

    return Object.keys(endpointRequest.headers).some(key => {
      if (request.headers[key] === undefined) {
        return true;
      }

      headersMatchParams[key] = request.headers[key];

      return (
        false ===
        this.validatorsStack.validate(
          endpointRequest.headers[key],
          request.headers[key]
        )
      );
    })
      ? false
      : {
          ...matchParams,
          headers: headersMatchParams,
        };
  }
};
