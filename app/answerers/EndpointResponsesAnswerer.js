const BaseAnswerer = require('./BaseAnswerer');

module.exports = class EndpointResponsesAnswerer extends BaseAnswerer {
  static prepareEndpointResponses(EndpointResponses) {
    if (typeof EndpointResponses === 'string') {
      return [
        {
          body: EndpointResponses,
        },
      ];
    }

    if (Array.isArray(EndpointResponses)) {
      return EndpointResponses;
    }

    return [EndpointResponses];
  }

  answer({ endpoint }) {
    let weightResponseIndexes = [];
    let preparedResponses = EndpointResponsesAnswerer.prepareEndpointResponses(endpoint.response);

    preparedResponses.forEach(
      (responseItem, index) => {
        weightResponseIndexes = weightResponseIndexes.concat(
          new Array(responseItem.weight || 1).fill(index)
        );
      }
    );

    const randIndex =
      weightResponseIndexes[
        Math.floor(Math.random() * weightResponseIndexes.length)
        ];

    return {
      stop: true,
      response: randIndex ? preparedResponses[randIndex] : preparedResponses[0]
    };
  }
};
