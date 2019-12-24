const BaseEngine = require('./BaseEngine');
const Twig = require('twig');
const path = require('path');

const type = 'twig';

module.exports = class TwigEngine extends BaseEngine {
  static get type() {
    return type;
  }

  getType() {
    return type;
  }

  render({bodyFilePath, body, endpoint, request, context }) {
    const template = Twig.twig({
      data: body,
      namespaces: { 'template-root-dir': path.dirname(bodyFilePath) }
    });

    return template.render({
      endpoint,
      request,
      context
    });
  }
};
