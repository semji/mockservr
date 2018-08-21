module.exports = class BaseVoter {
  vote({ endpoint, endpointRequest, request, matchParams }) {
    return {...matchParams};
  }
};
