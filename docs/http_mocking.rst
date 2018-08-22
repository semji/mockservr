============
HTTP Mocking
============

Mockservr allows you to mock HTTP endpoints, defined through YAML files. Usin HTTP Mocking, you can easily and
rapidely mock any HTTP based API.

********
Overview
********

As for any mock in Mockservr, it must be defined in a YAML file, with the `.mock.yaml` or `mock.yml` file extension.

HTTP endpoints are defined under a single object, named `http`, which can either contain an array of endpoints
or a single object describing a single endpoint.

Accessing the HTTP endpoints
============================

Once Mockservr is up and running as described in :ref:`quickstart`, it is possible to access the endpoints through
your localhost and the port `8085`.

.. note::
  The port on which Mockservr can be reached through HTTP can be customized, either by using the `-p` option if running
  with Docker (see :ref:`quickstart_running_with_docker`) or by using the `services.XX.port` option if running under
  docker-compose (see :ref:`quickstart_running_with_docker_compose`).

Defining the HTTP endpoints
===========================

There are two ways to define the HTTP endpoints in the mock configuration file.

- If your mock aims to contain a single endpoint, the endpoint is described as un object under `http`.
- If your mock aims to contain many endpoints, the endpoints are described in an array under `htttp`.

Example of single-endpoint mock
-------------------------------

Using an object under `http` will define a single-endpoint mock:

.. code-block:: yaml
  :caption: YAML

  http:
    request:
      path: '/foo'
    response:
      body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": {
        "path": "/foo"
      },
      "response": {
        "body": "Hello World!"
      }
    }
  }

The endpoint is then accessible through HTTP:

.. code-block:: sh

  curl -XGET 'http://localhost:8085/foo'

.. note::
  The endpoint defined above is accessible using any HTTP verb. More about defining which HTTP verb to be used in
  :ref:`http_mocking_method_option`.

Example of multiple endpoints mock
----------------------------------

Using an array of objects under `http` will define multiple endpoints for the mock:

.. code-block:: yaml
  :caption: YAML

  http:
    -
      request:
        path: '/foo'
      response:
        body: 'Hello World!'
    -
      request:
        path: '/bar'
      response:
        body: 'Hello bar!'

.. code-block::  json
  :caption: JSON

  {
    "http": [
      {
        "request": {
          "path": "/foo"
        },
        "response": {
          "body": "Hello World!"
        }
      },
      {
        "request": {
          "path": "/bar"
        },
        "response": {
          "body": "Hello bar!"
        }
      }
    ]
  }

These endpoints are then accessible through HTTP:

.. code-block:: sh

  curl -XGET 'http://localhost:8085/foo'
  curl -XGET 'http://localhost:8085/bar'

*******
Request
*******

This section covers the `http.request` part of the endpoint definition ; it defines how Mockservr will match the
incoming HTTP requests, and what response it will serve to the client.

Request Definition
==================

The `http.request` may either be a string, an object or an array.

Basic definition of a Request
-----------------------------

The simpliest way to define a Request is by only defining its path. Mockservr allows you to write this path directly
under `http.request`, using a string, such as:

.. code-block:: yaml
  :caption: YAML

  http:
    request: '/foo'
    response:
      body: 'Hello World!"

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": "/foo",
      "response": {
        "body": "Hello World!"
      }
    }
  }

The endpoint is then accessible through HTTP:

.. code-block:: sh

  curl -XGET 'http://localhost:8085/foo'

.. note::
  This way to define an endpoint is equal to:

  .. code-block:: yaml
    :caption: YAML

    http:
      request:
        path: '/foo'
      response:
        body: 'Hello World!'

  .. code-block::  json
    :caption: JSON

    {
      "http": {
        "request": {
          "path": "/foo"
        },
        "response": {
          "body": "Hello World!"
        }
      }
    }

.. note::
  If you intend to use more specific definition of the incoming requests, see
:ref:`http_mocking_defining_single_request`.

.. _http_mocking_defining_single_request:

Defining a single Request
-------------------------

If your endpoint must react to single type of Request, then you can use an object to define it. To learn about all
possible options to define the Request, please see :ref:`http_mocking_request_options`.

.. code-block:: yaml
  :caption: YAML

  http:
    request:
      path: '/foo'
    response:
      body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": {
        "path": "/foo"
      },
      "response": {
        "body": "Hello World!"
      }
    }
  }

The endpoint is then accessible through HTTP:

.. code-block:: sh

  curl -XGET 'http://localhost:8085/foo'

Defining multiple Request
-------------------------

In case your endpoint should serve a similar Response to requests that may have different shapes, you can define multiple
matching Requests for the endpoint, by using an array.

.. code-block:: yaml
  :caption: YAML

  http:
    request:
      -
        path: '/foo'
      -
        path: '/bar'
    response:
      body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": [
        {
          "path": "/foo"
        },
        {
          "path": "/bar"
        }
      ],
      "response": {
        "body": "Hello World!"
      }
    }
  }

The endpoint is then available through different HTTP requests:

.. code-block:: sh

  curl -XGET 'http://localhost:8085/foo'
  curl -XGET 'http://localhost:8085/bar'

.. _validator:

Request Validators
==================

For an incoming HTTP to match a defined Request, it must be positively matched against all the options defined for the
endpoint in the mock file.

To perform this, you may use a Validator ; it is an object with two properties:

- `type` which defines the type of Validator to use
- `value` which is the expected value used by the Validator.

Mockservr comes with a **Validator inference** feature, which means, if you do not explicitly define which Validator
to use, Mockservr will guess it for you.

`scalar` Validator
------------------

The `scalar` Validator performs an exact match between the expected value and the given one. This Validator
is automatically inferred when the value is a string, a number or a boolean value.

Some syntactic sugar are also available, to alias the `scalar` Validator and make the definition of the endpoints
more clear. As such, the types `string`, `number` and `boolean` are all alias to the `scalar` Validator.

Example
^^^^^^^

For example, you can use the `scalar` Validator to validate the path. All the following definitions are equals:

Using the `scalar` Validator
""""""""""""""""""""""""""""

.. code-block:: yaml
  :caption: YAML

  http:
    request:
      path:
        type: 'scalar'
        value: '/foo'
    response:
      body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": {
        "path": {
          "type": "scalar",
          "value": "/foo"
        }
      },
      "response": {
        "body": "Hello World!"
      }
    }
  }

Using the `string` Validator
""""""""""""""""""""""""""""

.. code-block:: yaml
  :caption: YAML

  http:
    request:
      path:
        type: 'string'
        value: '/foo'
    response:
      body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": {
        "path": {
          "type": "string",
          "value": "/foo"
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
      path: '/foo'
    response:
      body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": {
        "path": "/foo"
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

.. _http_mocking_request_options:

`anyOf` Validator
-----------------

The `anyOf` Validator may be used to match one of several given values. Under the hood, Mockservr is performing
Validator inference ; it allows to use scalar values (string, number, ...) in the array. However, it is possible
to use Validators inside the array, giving you the possibility to use regular expression, for example.

.. code-block:: yaml
  :caption: YAML

  http:
    request:
      path:
        type: 'anyOf'
        value:
          - '/foo'
          - '/bar'
          -
            type: 'regex'
            value: '/^\/p.*$/'
    response:
      body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": {
        "path": {
          "type": "anyOf",
          "value": [
            "/foo",
            "/bar",
            {
              "type": "regex",
              "value": "/^\/p.*$/"
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

  curl -XGET 'http://localhost:8085/foo'
  curl -XGET 'http://localhost:8085/bar'
  curl -XGET 'http://localhost:8085/plop'

`object` Validator
------------------

The `object` Validator in itself does not perform any validation. Instead, the value is an object, in which one
or more validators are defined.

`typeOf` Validator
------------------

The `typeOf` Validator validates that the given value corresponds to the expected type.

.. code-block:: yaml
  :caption: YAML

  http:
    request:
      path:
        type: 'typeof'
        value: 'string'
    response:
      body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": {
        "path": {
          "type": "typeof",
          "value": "string"
        }
      },
      "response": {
        "body": "Hello World!"
      }
    }
  }

The example above will match any incoming request, as path is always a string.

.. note::
  As Mockservr is using Javascript, running the `typeOf` validator against `null` won't be working as expected.

Request Options
===============

This section describes all the options available for a Request. For an incoming HTTP request to match a defined
Request, it must match positively against all options.

The options are defined under the `request` object of an HTTP endpoint.

Each option can be described as a :ref:`validator`, but may also be described as a scalar value, for which Mockservr
will perform validator inference.

Defining multiple sets of options for a single Request
------------------------------------------------------

It is possible to describe multiple sets of options to describe a Request. To do so, the `request` must be an array of
objects instead of a single object.

For each incoming HTTP request, Mockservr will try to match against all different Requests that have been defined.

It allows you to describe several ways to reach a single endpoint.

.. code-block:: yaml
  :caption: YAML

    http:
      request:
        -
          path: '/foo'
        -
          path: '/bar'
      response:
        body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": [
        {
          "path": "/foo"
        },
        {
          "path": "/bar"
        }
      ]
      "response": {
        "body": "Hello World!"
      }
    }
  }

Then, the two following HTTP requests will lead to the same response:

.. code-block:: sh

  curl -XGET 'http://localhost:8085/foo'
  curl -XGET 'http://localhost:8085/bar'

`basepath` option
-----------------

The `basepath` option allows to define the base path of the request. It is mainly useful to group requests by their
base path in the Mockservr GUI.

.. code-block:: yaml
  :caption: YAML

    http:
      request:
        basepath: '/foo'
        path: '/1'
      response:
        body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": {
        "basepath": "/foo",
        "path": "/1"
      },
      "response": {
        "body": "Hello World!"
      }
    }
  }

`body` option
-------------

The `body` option allows you to define what the incoming HTTP request's body must look like. For it to be working, the
`Content-Type` header must be defined as `application/x-www-form-urlencoded` or as `application/json`.

All types of validator may be used with the `body` option.

In case the body is a JSON or a form, it is possible to use an object under `body`. In this case, the keys of the object
will be used to find the corresponding key in the HTTP request's body, and it will be matched against the value specified
at the corresponding key.

.. code-block:: yaml
  :caption: YAML

    http:
      request:
        path: '/foo'
        body:
          name: 'John'
          last_name: ['Doe', 'Bar']
      response:
        body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": {
        "path": "/foo",
        "body": {
          "name": "John",
          "last_name": ["Doe", "Bar"]
        }
      },
      "response": {
        "body": "Hello World!"
      }
    }
  }

In the above example, the JSON or form body must define two key/value pairs: The first one is `name` and its value
must be "John" (the `string` validator is automatically inferred) ; the second one is `last_name` and its value must
either be "Doe" or "Bar" (the `anyOf` validator is automatically inferred).

The incoming request's body may also be a simple string or any other scalar.

.. code-block:: yaml
    :caption: YAML

    http:
      request:
        path: '/foo'
        body: "Hello"
      response:
        body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": {
        "path": "/foo",
        "body": "Hello"
      },
      "response": {
        "body": "Hello World!"
      }
    }
  }

`headers` option
----------------

The `headers` options allows the control of the incoming HTTP request. This option can only be an object with
key/value pairs. The key is the header's name, and the value is the expected value.

The value can be any type of validator, allowing a fine-grain control of the headers.

.. code-block:: yaml
    :caption: YAML

    http:
      request:
        path: '/foo'
        headers:
          Content-Type: ['application/json', 'application/x-www-form-urlencoded']
      response:
        body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": {
        "path": "/foo",
        "headers": ['application/json', 'application/x-www-form-urlencoded']
      },
      "response": {
        "body": "Hello World!"
      }
    }
  }

In the above example, the endpoint will be triggered in the incoming HTTP request contains a `Content-Type` header
and if its value is either `application/json` or `application/x-www-form-urlencoded`.

`maxCalls` option
----------------

The `maxCalls` option defines a maximum calls count for a given Request. This gives the possibility to simulate API
rate limits, for example.

The `maxCalls` option does not provide validator inference, as the only possible value is a plain integer.

.. code-block:: yaml
    :caption: YAML

    http:
      request:
        path: '/foo'
        maxCalls: 5
      response:
        body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": {
        "path": "/foo",
        "headers": 5
      },
      "response": {
        "body": "Hello World!"
      }
    }
  }

In the above example, the Request is going to be positively matched 5 times. When the 6th call arrives, Mockservr will
not match it positively against this Request.

.. _http_mocking_method_option:

`method` option
---------------

The `method` option defines which type of HTTP requests will match positively with the endpoint. Apart of the usual
HTTP verbs (GET, POST, ...), it is possible to set custom HTTP verbs.

.. code-block:: yaml
    :caption: YAML

    http:
      request:
        path: '/foo'
        method: ['GET', 'POST']
      response:
        body: 'Hello World!'

.. code-block::  json
    :caption: JSON

    {
      "http": {
        "request": {
          "path": "/foo",
          "method": ["GET", "POST"]
        },
        "response": {
          "body": "Hello World!"
        }
      }
    }

The Request defined above will match positively against any incoming HTTP request which is a GET or a POST request. d

`path` option
-------------

The `path` option defines on which path the endpoint can be reached.

.. code-block:: yaml
    :caption: YAML

    http:
      request:
        path: '/foo'
      response:
        body: 'Hello World!'

.. code-block::  json
    :caption: JSON

    {
      "http": {
        "request": {
          "path": "/foo",
        },
        "response": {
          "body": "Hello World!"
        }
      }
    }

The example above is an endpoint reachable on the `/foo` path of Mockservr (typically `http://localhost:8085`)

.. _http_mocking_query_option:

`query` option
--------------

The `query` option defines how the incoming HTTP request's query parameters will be matched. **It must be an object**
in which each key/value pair correspond to a query parameter/value. The value in each key/value pair is a :ref:`validator`.

.. code-block:: yaml
    :caption: YAML

    http:
      request:
        path: '/foo'
        query:
          action: 'show'
          id: 1
      response:
        body: 'Hello World!'

.. code-block::  json
    :caption: JSON

    {
      "http": {
        "request": {
          "path": "/foo",
          "query": {
            "action": "show",
            "id": 1
          }
        },
        "response": {
          "body": "Hello World!"
        }
      }
    }

To match the above Request, the incoming HTTP request must be of the form `/foo?action=show&id=1`

********
Response
********

When Mockservr matches an incoming HTTP request to a Request defined in an endpoint, it will send back a HTTP response.
The definition of this response lies into the `http.response` object.

It is possible to define several Responses for an endpoint and the way Mockservr should pick the right Response from
the incoming HTTP request.

Response Definition
===================

A Response is defined by a set of options that describe Mockservr how to build the HTTP response to an incoming HTTP
request that has been match successfully to the endpoint.

It is also possible to define several possible Responses for a single endpoint. To do so, `http.response` must be an
array of objects, each object defining a possible Response. In that case, each object must also contains some options
that will tell Mockservr how to pick the right Response ; otherwise, Mockservr will pick the first Response in the
array.

Defining a single Response
--------------------------

Basically, an HTTP response is composed of a body and a status code. By default, the status code returned by Mockservr
is 200 if not defined otherwise.

A basic Response definition would be:

.. code-block:: yaml
    :caption: YAML

      http:
        request:
          path: '/foo'
        response:
          body: 'Hello World!'

.. code-block::  json
    :caption: JSON

      {
        "http": {
          "request": {
            "path": "/foo"
          },
          "response": {
            "body": "Hello World!"
          }
        }
      }

This endpoint definition will match any incoming request on `/foo`, and the HTTP response's body will be "Hello World!"
with HTTP status code 200.

Defining several possible Responses
-----------------------------------

Using an array instead of an object under `http.response`, it is possible to define several possible Response for a
single endpoint. It is then possible to give a weight to each of the Responses, and Mockservr will pick one of the
Response randomly, according to their respective weight.

.. code-block:: yaml
    :caption: YAML

      http:
        request:
          path: '/foo'
        response:
          -
            body: 'Hello World!'
            weight: 0.5
          -
            body: "Bye World!"
            weight: 0.5

.. code-block::  json
    :caption: JSON

      {
        "http": {
          "request": {
            "path": "/foo"
          },
          "response": [
            {
              "body": "Hello World!",
              "weight": 0.5
            },
            {
              "body": "Bye World!",
              weight: 0.5
            }
          ]
        }
      }

For the endpoint defined above, Mockservr will pick a random Response ; as both their weights are 0.5, they'll be pick
randomly with equal chances. See :ref:`http_mocking_response_weight_option`

Response Options
================

.. _http_mocking_response_weight_option:

`weight` option
---------------

