const BaseValidator = require('./BaseValidator');

module.exports = class RangeValidator extends BaseValidator {
  supportsValidation(type) {
    return type === 'range';
  }

  validate(expected, value) {
    return expected.min <= value && expected.max >= value;
  }
};
