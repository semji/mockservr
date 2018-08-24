module.exports = class BaseAnswerer {
  answer({ endpoint, request }) {
    return {
      stop: false,
      response: {}
    };
  }
};
