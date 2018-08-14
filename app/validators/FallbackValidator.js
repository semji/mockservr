const ObjectValidator = require('./ObjectValidator');

module.exports = class FallbackValidator extends ObjectValidator {
  supportsValidation(type) {
    return true;
  }
};
