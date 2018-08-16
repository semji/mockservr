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
    let matches = {};

    if (expected === null) {
      return value === null;
    }

    for (let key of Object.keys(expected)) {
      if (value[key] === undefined) {
        return false;
      }

      matches[key] = this.validatorsStack.validate(expected[key], value[key]);

      if (matches[key] === false) {
        return false;
      }
    }

    return matches;
  }
};
