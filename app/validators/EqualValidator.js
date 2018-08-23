const BaseValidator = require('./BaseValidator');

module.exports = class EqualValidator extends BaseValidator {
  supportsValidation(type) {
    return type === 'equal';
  }
};
