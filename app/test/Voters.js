const MaxCallsVoter = require('../voters/MaxCallsVoter');
const MethodVoter = require('../voters/MethodVoter');
const PathVoter = require('../voters/PathVoter');
const HeaderVoter = require('../voters/HeaderVoter');
const QueryVoter = require('../voters/QueryVoter');
const BodyVoter = require('../voters/BodyVoter');
const ValidatorsStack = require('../validators/ValidatorsStack');
const assert = require('assert');
var matchParams = {};

describe('Voters', () => {
  describe('MaxCallVoter', () => {
    const maxCallsVoter = new MaxCallsVoter();
    describe('#vote', () => {
      it('should return true when calls lower than max calls', () => {
        assert.ok(
          maxCallsVoter.vote({
            endpoint: {
              callCount: 5,
              maxCalls: 10,
            },
          })
        );
      });

      it('should return true when max calls options is undefined', () => {
        assert.ok(maxCallsVoter.vote({ endpoint: {} }));
      });

      it('should return false when calls greater than max calls', () => {
        assert.strictEqual(
          maxCallsVoter.vote({
            endpoint: {
              callCount: 11,
              maxCalls: 10,
            },
          }),
          false
        );
      });

      it('should return false when calls equals max calls', () => {
        assert.strictEqual(
          maxCallsVoter.vote({
            endpoint: {
              callCount: 10,
              maxCalls: 10,
            },
          }),
          false
        );
      });
    });
  });

  describe('MethodVoter', () => {
    const methodVoter = new MethodVoter(new ValidatorsStack());
    describe('#vote', () => {
      it('should return true when method match validator', () => {
        assert.ok(
          methodVoter.vote({
            endpointRequest: {
              method: 'POST',
            },
            request: {
              method: 'POST',
            },
          })
        );
      });
      it('should return true when method not specified', () => {
        assert.ok(
          methodVoter.vote({
            endpointRequest: {},
            request: {
              method: 'POST',
            },
          })
        );
      });
      it("should return false when method doesn't match validator", () => {
        assert.strictEqual(
          methodVoter.vote({
            endpointRequest: {
              method: 'POST',
            },
            request: {
              method: 'PUT',
            },
          }),
          false
        );
      });
      it('should fill matchParams with matching when match', () => {
        assert.deepStrictEqual(
          {
            method: ['P', 'T'],
          },
          methodVoter.vote({
            endpointRequest: {
              method: {
                type: 'regex',
                value: '(.*)U(.*)',
              },
            },
            request: {
              method: 'PUT',
            },
          })
        );
      });
    });
  });
});
