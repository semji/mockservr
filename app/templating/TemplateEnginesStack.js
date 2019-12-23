const VelocityEngine = require('./VelocityEngine');
const TwigEngine = require('./TwigEngine');

const defaultEngine = 'twig';

module.exports = class TemplateEnginesStack {
  constructor() {
    this.engines = [
      new VelocityEngine(),
      new TwigEngine(),
    ];
  }

  addVoter(engines) {
    this.engines.push(engines);
  }

  run({endpointResponse, bodyFilePath, body, request, endpoint}) {
    let templatingOptions = endpointResponse.templating;

    if (!templatingOptions) {
      return body;
    }

    if (typeof templatingOptions === 'boolean') {
      templatingOptions = {
        enabled: templatingOptions,
        engine: defaultEngine,
        context: {}
      };
    }

    if (templatingOptions.enabled === false) {
      return body;
    }

    let engine = this.engines.find(
      engine => engine.getType() === templatingOptions.engine
    );

    if (!engine) {
      throw `Engine not supported : ${templatingOptions.engine}`;
    }

    return engine.render({
      endpointResponse,
      bodyFilePath,
      body,
      request,
      endpoint,
      context: templatingOptions.context || {}
    });
  }
};
