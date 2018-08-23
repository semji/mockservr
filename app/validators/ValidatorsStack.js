const EqualValidator = require('./EqualValidator');
const AnyOfValidator = require('./AnyOfValidator');
const RegexValidator = require('./RegexValidator');
const TypeOfValidator = require('./TypeOfValidator');
const RangeValidator = require('./RangeValidator');
const ObjectValidator = require('./ObjectValidator');

module.exports = class ValidatorsStack {
  constructor() {
    this.validators = [
      new EqualValidator(),
      new AnyOfValidator(this),
      new RegexValidator(),
      new TypeOfValidator(this),
      new RangeValidator(),
      new ObjectValidator(this),
    ];
  }

  prepareExpected(expected) {
    if (typeof expected === 'string' || typeof expected === 'number' || typeof expected === 'boolean') {
      return {
        type: 'equal',
        value: expected,
      };
    }

    if (expected === null) {
      return {
        type: 'object',
        value: null,
      };
    }

    if (Array.isArray(expected)) {
      return {
        type: 'anyOf',
        value: expected,
      };
    }

    if (
      typeof expected === 'object' &&
      (expected.type === undefined || expected.value === undefined)
    ) {
      return {
        type: 'object',
        value: expected,
      };
    }

    return expected;
  }

  validate(expected, value) {
    expected = this.prepareExpected(expected);

    const validator = this.validators.find(validator => {
      return validator.supportsValidation(expected.type);
    });

    if (validator !== -1) {
      return validator.validate(expected.value, value);
    }

    throw new Error('No validator found for type: ' + expected.type);
  }
};
