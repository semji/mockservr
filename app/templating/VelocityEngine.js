const BaseEngine = require('./BaseEngine');
const Velocity = require('velocityjs');

const type = 'velocity';

module.exports = class VelocityEngine extends BaseEngine {
  static get type() {
    return type;
  }

  getType() {
    return type;
  }

  render({ body, endpoint, request, context }) {
    return Velocity.render(
      body,
      {
        math: Math,
        request: request,
        endpoint: endpoint,
        context: context,
      }
    );
  }
};
