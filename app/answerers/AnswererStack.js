const RateLimitAnswerer = require('./RateLimitAnswerer');
const CrossOriginAnswerer = require('./CrossOriginAnswerer');
const EndpointResponsesAnswerer = require('./EndpointResponsesAnswerer');

module.exports = class AnswererStack {
  constructor() {
    this.answerers = [
      new RateLimitAnswerer(),
      new CrossOriginAnswerer(),
      new EndpointResponsesAnswerer()
    ];
  }

  run(endpoint, request, endpoints) {
    let response = {};

    return this.answerers.some(answerer => {
      let answer = answerer.answer({
        endpoint,
        request,
        endpoints
      });

      response = {
        ...response,
        ...answer.response
      };

      if (answer.stop) {
        return true;
      }

      return answer.stop;
    })
      ? response
      : false;
  }
};
