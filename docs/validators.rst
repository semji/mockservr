.. _validator:

==========
Validators
==========

For an incoming HTTP to match a defined Request, it must be positively matched against all the options defined for the
endpoint in the mock file.

To perform this, you may use a Validator ; it is an object with two properties:

- `type` which defines the type of Validator to use
- `value` which is the expected value used by the Validator.

Mockservr comes with a **Validator inference** feature, which means, if you do not explicitly define which Validator
to use, Mockservr will guess it for you.

Inference transform rules :

- `string` will be transform in `equal` Validator
- `number` will be transform in `equal` Validator
- `boolean` will be transform in `equal` Validator
- `array` will be transform in `anyOf` Validator
- `null` will be transform in `object` Validator
- `object` that is not a validator will be transform in `object` Validator

`equal` Validator
------------------

The `equal` Validator performs an exact match between the expected value and the given one. This Validator
is automatically inferred when the value is a string, a number or a boolean value.

Example
^^^^^^^

For example, you can use the `equal` Validator to validate the method. All the following definitions are equals:

Using the `equal` Validator
""""""""""""""""""""""""""""

.. code-block:: yaml
  :caption: YAML

      http:
        request:
          path: '/foo'
          method:
            type: 'equal'
            value: 'GET'
        response:
          body: 'Hello World!'

.. code-block::  json
  :caption: JSON

      {
        "http": {
          "request": {
            "path": "/foo",
            "method": {
              "type": "equal",
              "value": "GET"
            }
          },
          "response": {
            "body": "Hello World!"
          }
        }
      }

Using the Validator inference
"""""""""""""""""""""""""""""

.. code-block:: yaml
  :caption: YAML

      http:
        request:
          path: "/foo"
          method: "GET"
        response:
          body: 'Hello World!'

.. code-block::  json
  :caption: JSON

      {
        "http": {
          "request": {
            "path": "/foo",
            "method": "GET",
          },
          "response": {
            "body": "Hello World!"
          }
        }
      }

`range` Validator
-----------------

The `range` Validator may be used to define a range in which the given value should lie. The `value` is an object
composed of two entries:

- `min`: The lower bound of the range (inclusive)
- `max`: The upper bound of the range (inclusive)

Both ranges must be numbers (either integer or floats). An example of the `range` Validator can be is presented in
:ref:`http_mocking_query_option`.

`regex` Validator
-----------------

The `regex` Validator may be used to match a given value against a regular expression. As such, the `value` entry
is the given regular expression. References about Javascript Regular Expressions can be found on Mozilla_.

.. _Mozilla: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

An example of the `regex` Validator can be is presented in :ref:`http_mocking_method_option`.

`anyOf` Validator
-----------------

The `anyOf` Validator may be used to match one of several given values. Under the hood, Mockservr is performing
Validator inference ; it allows to use equals values (string, number, ...) in the array. However, it is possible
to use Validators inside the array, giving you the possibility to use regular expression, for example.

.. code-block:: yaml
  :caption: YAML

      http:
        request:
          path: "/foo"
          method:
            type: 'anyOf'
            value:
              - 'GET'
              - 'POST'
              -
                type: 'regex'
                value: '/^P.*$/'
        response:
          body: 'Hello World!'

.. code-block::  json
  :caption: JSON

      {
        "http": {
          "request": {
            "path": "/foo",
            "method": {
              "type": "anyOf",
              "value": [
                "GET",
                "POST",
                {
                  "type": "regex",
                  "value": "/^P.*$/"
                }
              ]
            }
          },
          "response": {
            "body": "Hello World!"
          }
        }
      }

    The endpoint is then available through different HTTP requests:

.. code-block:: sh

  curl -XGET 'http://localhost:8080/foo'
  curl -XPOST 'http://localhost:8080/foo'
  curl -XPUT 'http://localhost:8080/foo'

`object` Validator
------------------

The `object` Validator in itself does not perform any validation. Instead, the value is an object, in which one
or more validators are defined for each object attribute.
Validation of `object` Validator will perform recursively.

`typeOf` Validator
------------------

The `typeOf` Validator validates that the given value corresponds to the expected type.

.. code-block:: yaml
  :caption: YAML

      http:
        request:
          path: '/foo'
          method:
            type: 'typeof'
            value: 'string'
        response:
          body: 'Hello World!'

.. code-block::  json
  :caption: JSON

      {
        "http": {
          "request": {
            "path": "/foo"
            "method": {
              "type": "typeof",
              "value": "string"
            }
          },
          "response": {
            "body": "Hello World!"
          }
        }
      }

    The example above will match any incoming request, as method is always a string.

.. note::
As Mockservr is using Javascript, running the `typeOf` validator against `null` won't be working as expected.
  Use `object` Validator with `null` value instead.
