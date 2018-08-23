const ValidatorsStack = require('../validators/ValidatorsStack');
const EqualValidator = require('../validators/EqualValidator');
const AnyOfValidator = require('../validators/AnyOfValidator');
const TypeOfValidator = require('../validators/TypeOfValidator');
const RangeValidator = require('../validators/RangeValidator');
const RegexValidator = require('../validators/RegexValidator');
const ObjectValidator = require('../validators/ObjectValidator');
const assert = require('assert');

describe('Validators', () => {
  describe('ValidatorsStack', () => {
    const validatorsStack = new ValidatorsStack();
    describe('#prepareExpected', () => {
      it('should create string validator from string', () => {
        assert.deepStrictEqual(validatorsStack.prepareExpected('test'), {
          type: 'equal',
          value: 'test',
        });
      });
      it('should create boolean validator from boolean', () => {
        assert.deepStrictEqual(validatorsStack.prepareExpected(true), {
          type: 'equal',
          value: true,
        });
      });
      it('should create number validator from number', () => {
        assert.deepStrictEqual(validatorsStack.prepareExpected(1), {
          type: 'equal',
          value: 1,
        });
      });
      it('should create anyOf validator from array', () => {
        assert.deepStrictEqual(
          validatorsStack.prepareExpected(['test', 'prepare']),
          {
            type: 'anyOf',
            value: ['test', 'prepare'],
          }
        );
      });
      it('should create object validator from object', () => {
        assert.deepStrictEqual(
          validatorsStack.prepareExpected({ test: 'prepare' }),
          {
            type: 'object',
            value: { test: 'prepare' },
          }
        );
      });
      it('should create object validator from null', () => {
        assert.deepStrictEqual(validatorsStack.prepareExpected(null), {
          type: 'object',
          value: null,
        });
      });
      it('should do nothing if validator', () => {
        assert.deepStrictEqual(
          validatorsStack.prepareExpected({
            type: 'equal',
            value: 'test',
          }),
          {
            type: 'equal',
            value: 'test',
          }
        );
      });
    });
    describe('#validate', () => {
      it('should return true if match', () => {
        assert.ok(validatorsStack.validate('test', 'test'));
      });
      it('should return false if not match', () => {
        assert.strictEqual(
          validatorsStack.validate('test', 'not match'),
          false
        );
      });
      it('should throw exception if Validator type not supported', () => {
        assert.throws(() => {
          validatorsStack.validate(
            {
              type: 'Unknown',
              value: null,
            },
            null
          );
        }, Error);
      });
    });
  });
  describe('EqualValidator', () => {
    const equalValidator = new EqualValidator();
    describe('#supportsValidation', () => {
      it('should return true for equal', () =>
        assert.ok(equalValidator.supportsValidation('equal')));
      it('should return false for others', () =>
        assert.strictEqual(equalValidator.supportsValidation('anyOf'), false));
    });
    describe('#validate', () => {
      it('should return true if expected equals value', () =>
        assert.ok(equalValidator.validate(1, 1)));
      it('should return false if expected not equals value', () => {
        assert.strictEqual(equalValidator.validate(1, 2), false);
      });
    });
  });
  describe('AnyOfValidator', () => {
    const anyOfValidator = new AnyOfValidator(new ValidatorsStack());
    describe('#supportsValidation', () => {
      it('should return true for anyOf', () =>
        assert.ok(anyOfValidator.supportsValidation('anyOf')));
      it('should return false for others', () =>
        assert.strictEqual(anyOfValidator.supportsValidation('string'), false));
    });
    describe('#validate', () => {
      it('should return true if expected is in value array', () =>
        assert.ok(anyOfValidator.validate([1, 2, 3], 2)));
      it('should return true if value is in expected validator array', () =>
        assert.ok(
          anyOfValidator.validate([1, { type: 'equal', value: 2 }, 3], 2)
        ));
      it('should return false if expected is not in value array', () => {
        assert.strictEqual(anyOfValidator.validate([1, 3], 2), false);
      });
    });
  });
  describe('TypeOfValidator', () => {
    const typeOfValidator = new TypeOfValidator(new ValidatorsStack());
    describe('#supportsValidation', () => {
      it('should return true for typeOf', () =>
        assert.ok(typeOfValidator.supportsValidation('typeOf')));
      it('should return false for others', () =>
        assert.strictEqual(
          typeOfValidator.supportsValidation('string'),
          false
        ));
    });
    describe('#validate', () => {
      it('should return true if expected is value type', () =>
        assert.ok(typeOfValidator.validate('number', 2)));
      it('should return true if value type match expected validator', () =>
        assert.ok(
          typeOfValidator.validate({ type: 'equal', value: 'number' }, 2)
        ));
      it('should return false if expected is not in value type', () => {
        assert.strictEqual(typeOfValidator.validate('string', 2), false);
      });
    });
  });
  describe('RangeValidator', () => {
    const rangeValidator = new RangeValidator();
    describe('#supportsValidation', () => {
      it('should return true for range', () =>
        assert.ok(rangeValidator.supportsValidation('range')));
      it('should return false for others', () =>
        assert.strictEqual(rangeValidator.supportsValidation('string'), false));
    });
    describe('#validate', () => {
      it('should return true if value in between expected min and expected max', () =>
        assert.ok(rangeValidator.validate({ min: 1, max: 3 }, 2)));
      it('should return false if value is out of range', () => {
        assert.strictEqual(
          rangeValidator.validate({ min: 3, max: 6 }, 2),
          false
        );
      });
    });
  });
  describe('RegexValidator', () => {
    const regexValidator = new RegexValidator();
    describe('#supportsValidation', () => {
      it('should return true for regex', () =>
        assert.ok(regexValidator.supportsValidation('regex')));
      it('should return false for others', () =>
        assert.strictEqual(regexValidator.supportsValidation('string'), false));
    });
    describe('#validate', () => {
      it('should return true if value match expected regex', () =>
        assert.ok(regexValidator.validate(/^t.*t$/, 'test')));
      it("should return false if value doesn't match expected regex", () => {
        assert.strictEqual(regexValidator.validate(/^t.*o.*t$/, 'test'), false);
      });
      it('should return matches capturing group if value match expected regex', () => {
        assert.deepStrictEqual(
          regexValidator.validate(
            /^(g[rou]*?p[0-9]).*?(g[rou]*?p[0-9]).*?(g[rou]*?p[0-9])$/,
            'group1 group2 non capturing group3'
          ),
          ['group1', 'group2', 'group3']
        );
      });
    });
  });
  describe('ObjectValidator', () => {
    const objectValidator = new ObjectValidator(new ValidatorsStack());
    describe('#supportsValidation', () => {
      it('should return true for object', () =>
        assert.ok(objectValidator.supportsValidation('object')));
      it('should return false for others', () =>
        assert.strictEqual(
          objectValidator.supportsValidation('string'),
          false
        ));
    });
    describe('#validate', () => {
      it('should return true if value match expected object', () =>
        assert.ok(
          objectValidator.validate({ first: 'test' }, { first: 'test' })
        ));
      it('should return true if value has more attribute than expected object', () =>
        assert.ok(
          objectValidator.validate(
            { first: 'test' },
            { first: 'test', second: 'test' }
          )
        ));
      it('should return true if value is null and expected is null', () =>
        assert.ok(objectValidator.validate(null, null)));
      it("should return false if value doesn't match expected object", () => {
        assert.strictEqual(
          objectValidator.validate({ first: 'test' }, { first: 'mismatch' }),
          false
        );
      });
      it("should return false if value doesn't have all expected attribute", () => {
        assert.strictEqual(
          objectValidator.validate(
            { first: 'test', second: 'test' },
            { first: 'test' }
          ),
          false
        );
      });
      it('should return true if deep value attribute match deep expected attribute', () =>
        assert.ok(
          objectValidator.validate(
            {
              first: { deep: { moreDeep: 'test' } },
              second: 2,
              third: { deep: null },
            },
            {
              first: { deep: { moreDeep: 'test' } },
              second: 2,
              third: { deep: null },
            }
          )
        ));
      it("should return false if deep value attribute doesn't match deep expected attribute", () =>
        assert.strictEqual(
          objectValidator.validate(
            {
              first: { deep: { moreDeep: 'test' } },
              second: 2,
              third: { deep: null },
            },
            {
              first: { deep: { moreDeep: 'mismatch' } },
              second: 2,
              third: { deep: null },
            }
          ),
          false
        ));
      it('should return matches capturing group if value match expected regex', () => {
        assert.deepStrictEqual(
          objectValidator.validate(
            {
              first: {
                deep: {
                  moreDeep: {
                    type: 'regex',
                    value: /^(g[rou]*?p[0-9]).*?(g[rou]*?p[0-9]).*?(g[rou]*?p[0-9])$/,
                  },
                },
              },
              second: { type: 'regex', value: '^([0-9])$' },
              third: { deep: null },
            },
            {
              first: {
                deep: { moreDeep: 'group1 group2 non capturing group3' },
              },
              second: 2,
              third: { deep: null },
            }
          ),
          {
            first: { deep: { moreDeep: ['group1', 'group2', 'group3'] } },
            second: ['2'],
            third: { deep: true },
          }
        );
      });
    });
  });
});
