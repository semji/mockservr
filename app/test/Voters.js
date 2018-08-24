const MaxCallsVoter = require('../voters/MaxCallsVoter');
const MethodVoter = require('../voters/MethodVoter');
const PathVoter = require('../voters/PathVoter');
const HeaderVoter = require('../voters/HeaderVoter');
const QueryVoter = require('../voters/QueryVoter');
const BodyVoter = require('../voters/BodyVoter');
const ValidatorsStack = require('../validators/ValidatorsStack');
const assert = require('assert');

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
            endpoint: {},
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
            endpoint: {},
            endpointRequest: {},
            request: {
              method: 'POST',
            },
          })
        );
      });
      it('should return true when method is OPTIONS and cross origin is activate', () => {
        assert.ok(
          methodVoter.vote({
            endpoint: {
              crossOrigin: true,
            },
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
            endpoint: {},
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
            endpoint: {},
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

  describe('PathVoter', () => {
    const pathVoter = new PathVoter();
    describe('#vote', () => {
      it('should return true when path match validator', () => {
        assert.ok(
          pathVoter.vote({
            endpointRequest: {
              path: '/test/:id/vote',
            },
            request: {
              path: '/test/1/vote',
            },
          })
        );
      });
      it('should return true when path not specified', () => {
        assert.ok(
          pathVoter.vote({
            endpointRequest: {},
            request: {
              path: '/test/1/vote',
            },
          })
        );
      });
      it("should return false when path doesn't match validator", () => {
        assert.strictEqual(
          pathVoter.vote({
            endpointRequest: {
              path: '/test/:id/vote',
            },
            request: {
              path: '/not/match',
            },
          }),
          false
        );
      });
      it('should fill matchParams with matching when match', () => {
        assert.deepStrictEqual(
          {
            path: {
              id: '1',
            },
          },
          pathVoter.vote({
            endpointRequest: {
              path: '/test/:id/vote',
            },
            request: {
              path: '/test/1/vote',
            },
          })
        );
      });
    });
  });

  describe('HeaderVoter', () => {
    const headerVoter = new HeaderVoter(new ValidatorsStack());
    describe('#vote', () => {
      it('should return true when headers match validator', () => {
        assert.ok(
          headerVoter.vote({
            endpointRequest: {
              headers: {
                header: {
                  type: 'regex',
                  value: '^test header (.*)',
                },
              },
            },
            request: {
              headers: {
                header: 'test header matching',
              },
            },
          })
        );
      });
      it('should return true when headers not specified', () => {
        assert.ok(
          headerVoter.vote({
            endpointRequest: {},
            request: {
              headers: {
                header: 'test header matching',
              },
            },
          })
        );
      });
      it('should return true when headers is empty and request headers is empty', () => {
        assert.ok(
          headerVoter.vote({
            endpointRequest: {
              headers: {},
            },
            request: {
              headers: {},
            },
          })
        );
      });
      it('should return false when headers is empty and request headers is not empty', () => {
        assert.strictEqual(
          headerVoter.vote({
            endpointRequest: {
              headers: {},
            },
            request: {
              headers: {
                header: 'test header matching',
              },
            },
          }),
          false
        );
      });
      it("should return false when headers doesn't match validator", () => {
        assert.strictEqual(
          headerVoter.vote({
            endpointRequest: {
              headers: {
                header: {
                  type: 'regex',
                  value: '^test header (.*)',
                },
              },
            },
            request: {
              headers: {
                header: 'not match header',
              },
            },
          }),
          false
        );
      });
      it('should return false when headers not present in request', () => {
        assert.strictEqual(
          headerVoter.vote({
            endpointRequest: {
              headers: {
                header: 'test headers',
              },
            },
            request: {
              headers: {},
            },
          }),
          false
        );
      });
      it('should fill matchParams with matching when match', () => {
        assert.deepStrictEqual(
          { headers: { header: ['matching'] } },
          headerVoter.vote({
            endpointRequest: {
              headers: {
                header: {
                  type: 'regex',
                  value: '^test header (.*)',
                },
              },
            },
            request: {
              headers: {
                header: 'test header matching',
              },
            },
          })
        );
      });
    });
  });

  describe('QueryVoter', () => {
    const queryVoter = new QueryVoter(new ValidatorsStack());
    describe('#vote', () => {
      it('should return true when query match validator', () => {
        assert.ok(
          queryVoter.vote({
            endpointRequest: {
              query: {
                param1: {
                  type: 'regex',
                  value: '^test query (.*)',
                },
              },
            },
            request: {
              query: {
                param1: 'test query matching',
              },
            },
          })
        );
      });
      it('should return true when query is empty and request query is empty', () => {
        assert.ok(
          queryVoter.vote({
            endpointRequest: {
              query: {},
            },
            request: {
              query: {},
            },
          })
        );
      });
      it('should return false when query is empty and request query is not empty', () => {
        assert.strictEqual(
          queryVoter.vote({
            endpointRequest: {
              query: {},
            },
            request: {
              query: {
                param1: 'test query matching',
              },
            },
          }),
          false
        );
      });
      it("should return false when query doesn't match validator", () => {
        assert.strictEqual(
          queryVoter.vote({
            endpointRequest: {
              query: {
                param1: {
                  type: 'regex',
                  value: '^test query (.*)',
                },
              },
            },
            request: {
              query: {
                param1: 'not match query',
              },
            },
          }),
          false
        );
      });
      it('should return false when query not present in request', () => {
        assert.strictEqual(
          queryVoter.vote({
            endpointRequest: {
              query: {
                param1: 'test query',
              },
            },
            request: {
              query: {},
            },
          }),
          false
        );
      });
      it('should fill matchParams with matching when match', () => {
        assert.deepStrictEqual(
          { query: { param1: ['matching'] } },
          queryVoter.vote({
            endpointRequest: {
              query: {
                param1: {
                  type: 'regex',
                  value: '^test query (.*)',
                },
              },
            },
            request: {
              query: {
                param1: 'test query matching',
              },
            },
          })
        );
      });
    });
  });

  describe('BodyVoter', () => {
    const bodyVoter = new BodyVoter(new ValidatorsStack());
    describe('#vote', () => {
      it('should return true when body match validator', () => {
        assert.ok(
          bodyVoter.vote({
            endpointRequest: {
              body: 'test body',
            },
            request: {
              body: 'test body',
            },
          })
        );
      });
      it('should return true when body is empty and request body is empty', () => {
        assert.ok(
          bodyVoter.vote({
            endpointRequest: {
              body: {},
            },
            request: {
              body: {},
            },
          })
        );
      });
      it("should return false when body doesn't match validator", () => {
        assert.strictEqual(
          bodyVoter.vote({
            endpointRequest: {
              body: {
                param1: {
                  type: 'regex',
                  value: '^test body (.*)',
                },
              },
            },
            request: {
              body: {
                param1: 'not match body',
              },
            },
          }),
          false
        );
      });
      it('should return false when body not present in request', () => {
        assert.strictEqual(
          bodyVoter.vote({
            endpointRequest: {
              body: {
                param1: 'test body',
              },
            },
            request: {
              body: {},
            },
          }),
          false
        );
      });
      it('should fill matchParams with matching when match', () => {
        assert.deepStrictEqual(
          { body: { param1: { deepParam: ['matching'] } } },
          bodyVoter.vote({
            endpointRequest: {
              body: {
                param1: {
                  deepParam: {
                    type: 'regex',
                    value: '^test body (.*)',
                  },
                },
              },
            },
            request: {
              body: {
                param1: {
                  deepParam: 'test body matching',
                },
              },
            },
          })
        );
      });
    });
  });
});
