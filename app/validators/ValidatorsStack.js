const ScalarValidator = require('./ScalarValidator');
const AnyOfValidator = require('./AnyOfValidator');
const RegexValidator = require('./RegexValidator');
const TypeOfValidator = require('./TypeOfValidator');
const RangeValidator = require('./RangeValidator');
const ObjectValidator = require('./ObjectValidator');
const FallbackValidator = require('./FallbackValidator');

module.exports = class ValidatorsStack {
  constructor() {
    this.validators = [
      new ScalarValidator(),
      new AnyOfValidator(this),
      new RegexValidator(),
      new TypeOfValidator(this),
      new RangeValidator(),
      new ObjectValidator(this),
      new FallbackValidator(this),
    ];
  }

  prepareExpected(expected) {
    if (typeof expected === 'string') {
      return {
        type: 'string',
        value: expected,
      };
    }

    if (typeof expected === 'number') {
      return {
        type: 'number',
        value: expected,
      };
    }

    if (typeof expected === 'boolean') {
      return {
        type: 'boolean',
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

    throw new new Error('No validator found for type: ' + expected.type)();
  }
};
