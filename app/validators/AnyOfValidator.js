const BaseValidator = require('./BaseValidator');

module.exports = class AnyOfValidator extends BaseValidator {
  constructor(validatorsStack) {
    super();
    this.validatorsStack = validatorsStack;
  }

  supportsValidation(type) {
    return type === 'anyOf';
  }

  validate(expected, value) {
    return expected.some((expectedValue) => {
      return this.validatorsStack.validate(expectedValue, value);
    });
  }
};
