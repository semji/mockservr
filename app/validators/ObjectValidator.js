const BaseValidator = require('./BaseValidator');

module.exports = class ObjectValidator extends BaseValidator {
  constructor(validatorsStack) {
    super();
    this.validatorsStack = validatorsStack;
  }

  supportsValidation(type) {
    return type === 'object';
  }

  validate(expected, value) {
    return !Object.keys(expected).some(key => {
      if (value[key] === undefined) {
        return true;
      }

      return !this.validatorsStack.validate(expected[key], value[key]);
    });
  }
};
