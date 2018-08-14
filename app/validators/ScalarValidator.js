const BaseValidator = require('./BaseValidator');

module.exports = class ScalarValidator extends BaseValidator {
  supportsValidation(type) {
    return type === 'string' || type === 'number' || type === 'boolean' || type === 'array';
  }
};
