const BaseValidator = require('./BaseValidator');

module.exports = class TypeOfValidator extends BaseValidator {
  constructor(validatorsStack) {
    super();
    this.validatorsStack = validatorsStack;
  }

  supportsValidation(type) {
    return type === 'typeOf';
  }

  validate(expected, value) {
    return this.validatorsStack.validate(expected, typeof value);
  }
};
