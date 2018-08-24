============
HTTP Mocking
============

Mockservr allows you to mock HTTP endpoints, defined through YAML/JSON files. Usin HTTP Mocking, you can easily and
rapidely mock any HTTP based API.

********
Overview
********

As for any mock in Mockservr, it must be defined in a YAML/JSON file, with the `.mock.yaml` or `mock.yml` or `mock.json` file extension.

HTTP endpoints are defined under a single object, named `http`, which should contain an array of endpoints.

Accessing the HTTP endpoints
============================

Once Mockservr is up and running as described in :ref:`quickstart`, it is possible to access the endpoints through
your localhost and the port `8080`.

.. note::
  The port on which Mockservr can be reached through HTTP can be customized, either by using the `-p` option if running
  with Docker (see :ref:`quickstart_running_with_docker`) or by using the `services.XX.port` option if running under
  docker-compose (see :ref:`quickstart_running_with_docker_compose`).

Defining the HTTP endpoints
===========================

There are two ways to define the HTTP endpoints in the Mockservr.

- Describe endpoints in an array under `http` in a YAML/JSON file
- Use :ref:`API`

Example of endpoints mock file
------------------------------

Using an array of objects under `http` will define endpoints for the mock:

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

  curl -XGET 'http://localhost:8080/foo'
  curl -XGET 'http://localhost:8080/bar'

.. note::
    It is possible to define a single endpoint for a mock, by using an object instead of an array under `http`.

********
Endpoint
********

An Endpoint is defined as one or more responses that correspond to one or more requests, all of them defined under
`http`. If `http` is an array, then each element is an Endpoint. If `http` is an object, then the object is the only
endpoint of the mock.

An Endpoint defines at least a `request` and an `response` property.

Mandatory properties
====================

`request` option
----------------

More details about the `request` option are availble in :ref:`Request`.

`response` option
-----------------

More details about the `response` option are available in :ref:`Response`.

Endpoint Options
================

`crossOrigin` option
--------------------

The `crossOrigin` option enables cross origin requests on Mockservr. This value can either be a boolean or an object.

If a boolean is given, it will authorize HTTP `OPTION` requests on the endpoint.

The default response to the `OPTION` method is the following JSON:

.. code-block::  json
  :caption: JSON

    {
      "headers": {
        "access-control-allow-credentials": true,
        "access-control-allow-headers": "request.headers['access-control-request-headers'] || '*'",
        "access-control-allow-methods": "GET,HEAD,POST,PUT,DELETE,CONNECT,OPTIONS,TRACE,PATCH",
        "access-control-allow-origin": "*",
        "access-control-max-age": 3600
      },
      "body": ""
    }

.. note::
  The value of `access-control-allow-headers` is either equal to the request's `access-control-request-headers` header
  if defined or `*` (allowing all headers).

If `crossOrigin` option is an object, it must be a Response object (see `Response`Response_ for more information about
Response's options). It overrides the default response as defined above.

.. note::
  All headers defined within the `crossOrigin` options will be present in the response sent by Mockservr to any incoming
  HTTP request that matches the endpoint. These headers can be overwritten using the `headers`headers_ option of the
  `response` object.

`maxCalls` option
----------------

The `maxCalls` option defines a maximum calls count for a given Endpoint. It does not provide validator inference,
as the only possible value is a plain integer.

.. code-block:: yaml
    :caption: YAML

    http:
      maxCalls: 5
      request:
        path: '/foo'
      response:
        body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "maxCalls": 5
      "request": {
        "path": "/foo"
      },
      "response": {
        "body": "Hello World!"
      }
    }
  }

In the above example, the Endpoint is going to be positively matched 5 times. When the 6th call arrives, Mockservr will
not match it positively against this Endpoint.

`rateLimit` option
------------------

The `rateLimit` option may either be a plain integer or an object. If a plain integer, it is the maximum number of
accepted calls on this endpoint within one second. If an object, it must define a `callCount` property which is a plain
integer defining the number of accepted calls and a `interval` property defining the time window in milliseconds in
which the `callCount` lies.

.. code-block:: yaml
    :caption: YAML

    http:
      rateLimit:
        callCount: 2
        interval: 5000
      request: '/foo'
      response: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "rateLimit": {
        "callCount": 2,
        "interval": 5000
      },
      "request": "/foo",
      "response": "Hello World!"
    }
  }

In the above example, the API has a rate limit of 2 calls every 5 seconds.

.. _Request:

*******
Request
*******

This section covers the `http.request` part of the endpoint definition ; it defines how Mockservr will match the
incoming HTTP requests, and what response it will serve to the client.

Request Definition
==================

The `http.request` may either be a string, an object or an array.

Mockservr comes with a **inference** feature, which means, if you do not explicitly define full `request` options
to use, Mockservr will guess it for you.

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

  curl -XGET 'http://localhost:8080/foo'

.. note::
  This way to define an endpoint is equal to:

  .. code-block:: yaml
    :caption: YAML

    http:
      request:
        -
         path: '/foo'
      response:
        body: 'Hello World!'

  .. code-block::  json
    :caption: JSON

    {
      "http": {
        "request": [
          {
            "path": "/foo"
          }
        ],
        "response": {
          "body": "Hello World!"
        }
      }
    }

Defining a single Request
-------------------------

If your endpoint must react to a single type of Request, then you can use an object to define it. To learn about all
possible options to define the Request, please see `Requests Options`http_mocking_request_options_.

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

  curl -XGET 'http://localhost:8080/foo'

.. note::
  This way to define an endpoint is equal to:

  .. code-block:: yaml
    :caption: YAML

    http:
      request:
        -
         path: '/foo'
      response:
        body: 'Hello World!'

  .. code-block::  json
    :caption: JSON

    {
      "http": {
        "request": [
          {
            "path": "/foo"
          }
        ],
        "response": {
          "body": "Hello World!"
        }
      }
    }

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

  curl -XGET 'http://localhost:8080/foo'
  curl -XGET 'http://localhost:8080/bar'

Request Options
===============

This section describes all the options available for a Request. For an incoming HTTP request to match a defined
Request, it must match positively against all options.

The options are defined under the `request` object of an HTTP endpoint.

Most option can be described as a :ref:`validator`, but may also be described as a scalar value, for which Mockservr
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

  curl -XGET 'http://localhost:8080/foo'
  curl -XGET 'http://localhost:8080/bar'

`path` option (required)
------------------------

The `path` option defines on which path the endpoint can be reached.
The `path` option matching is powered by path-to-regexp_.

.. _path-to-regexp: https://github.com/pillarjs/path-to-regexp

.. code-block:: yaml
    :caption: YAML

    http:
      request:
        path: '/foo/:id'
      response:
        body: 'Hello World!'

.. code-block::  json
    :caption: JSON

    {
      "http": {
        "request": {
          "path": "/foo/:id",
        },
        "response": {
          "body": "Hello World!"
        }
      }
    }

The example above is an endpoint reachable on the `/foo/[id]` path of Mockservr (typically `http://localhost:8080`)

.. code-block:: sh

  curl -XGET 'http://localhost:8080/foo/1'

`basepath` option
-----------------

The `basepath` option allows to define the base path of the request. It is mainly useful to group requests by their
base path in the Mockservr GUI.
`basepath` will concat with `path` option before matching

.. code-block:: yaml
  :caption: YAML

    http:
      request:
        basepath: '/foo'
        path: '/:id'
      response:
        body: 'Hello World!'

.. code-block::  json
  :caption: JSON

  {
    "http": {
      "request": {
        "basepath": "/foo",
        "path": "/:id"
      },
      "response": {
        "body": "Hello World!"
      }
    }
  }

.. code-block:: sh

  curl -XGET 'http://localhost:8080/foo/1'

`body` option
-------------

The `body` option allows you to define what the incoming HTTP request's body must look like. For it to be working as an object, the
`Content-Type` header must be defined as `application/x-www-form-urlencoded` or as `application/json`. If not it will be working as string.

All types of :ref:`validator` may be used with the `body` option.
In case the body is a JSON or a form, it is possible to use an object under `body`.
If not defined `body` will match any incoming request.

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
must be "John" (the `equal` validator is automatically inferred) ; the second one is `last_name` and its value must
either be "Doe" or "Bar" (the `anyOf` validator is automatically inferred).

The incoming request's body may also be a simple string or any other scalar then the `equal` validator is automatically inferred.

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

The `headers` options allows the control of the incoming HTTP request. **It must be an object** be an object with
key/value pairs. The key is the header's name, and the value is the expected value.

Each object's property value can be any type of :ref:`validator`, allowing a fine-grain control of the headers.
If not defined `headers`, will match any incoming request.

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
and if its value is either `application/json` or `application/x-www-form-urlencoded` (the `anyOf` validator is
automatically inferred).

.. _http_mocking_method_option:

`method` option
---------------

The `method` option defines which type of HTTP requests will match positively with the endpoint. Apart of the usual
HTTP verbs (GET, POST, ...), it is possible to set custom HTTP verbs.

Each object's property value can be any type of :ref:`validator`, allowing a fine-grain control of the incoming query
parameters. If not defined, `query` will match any incoming request.

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

The Request defined above will match positively against any incoming HTTP request which is a GET or a POST request (the
`anyOf` validator is automatically inferred).

.. _http_mocking_query_option:

`query` option
--------------

The `query` option defines how the incoming HTTP request's query parameters will be matched. **It must be an object**
in which each key/value pair correspond to a query parameter/value.

The value in each key/value pair is a :ref:`validator`.
If not defined `query` will match any incoming request.

.. code-block:: yaml
    :caption: YAML

    http:
      request:
        path: '/foo'
        query:
          action: 'show'
          id:
            type: 'typeOf'
            Value: 'number'
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
            "id": {
              "type": "typeOf",
              "value": "number"
            }
          }
        },
        "response": {
          "body": "Hello World!"
        }
      }
    }

To match the above Request, the incoming HTTP request must be of the form `/foo?action=show&id=3`

.. _Response:

********
Response
********

When Mockservr matches an incoming HTTP request to a Request defined in an endpoint, it will send back a HTTP response.
The definition of this response lies into the `http.response` object.

It is possible to define several Responses for an endpoint and the way Mockservr should pick one of Responses from
the incoming HTTP request.

Response Definition
===================

A Response is defined by a set of options that describe Mockservr how to build the HTTP response to an incoming HTTP
request that has been match successfully to the endpoint.

It is also possible to define several possible Responses for a single endpoint. To do so, `http.response` must be an
array of objects, each object defining a possible Response. In that case, each object must also contains some options
that will tell Mockservr how to pick the right Response ; otherwise, Mockservr will pick one of Response in the
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
            weight: 1
          -
            body: "Bye World!"
            weight: 1

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
              "weight": 1
            },
            {
              "body": "Bye World!",
              weight: 1
            }
          ]
        }
      }

For the endpoint defined above, Mockservr will pick a random Response ; as both their weights are 1, they'll be pick
randomly with equal chances. See http_mocking_response_weight_option_.

.. _http_mocking_request_options:

Response Options
================

.. _http_mocking_response_weight_option:

Response options let you specify what content Mockservr will send as a response to a matching incoming HTTP request.

`body` option
-------------

The `body` option lets you specify the body of the response. It must be a string.

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

`bodyFile` option
-----------------

The `bodyFile` option lets you specify the path to a file that contain the response to send. The file may be of any
type, which lets you define JSON responses, XML responses, pictures, ... The option is the path where to fetch the
file, relatively to the mock file.

.. code-block:: yaml
    :caption: YAML

      http:
        request:
          path: '/foo'
        response:
          bodyFile: './responses/foo/response.json'

.. code-block::  json
    :caption: JSON

      {
        "http": {
          "request": {
            "path": "/foo"
          },
          "response": {
            "bodyFile": "./responses/foo/response.json"
          }
        }
      }

In the previous examples, the response file must be located in a `responses/foo/` directory from the mock's directory,
within a `response.json` file.

.. note::
  For pictures, only the following mime types are allowed: `image/gif`, `image/jpeg`, `image/pjpeg`, `image/x-png`,
  `image/png`, `image/svg+xml`.

`delay` option
--------------

The `delay` option lets you specify a delay (in ms) or a min-max range of delay (in milliseconds) after which the
response will be sent.

If the given value is a number, it will be considered as a fix delay. You can also specify an object with a `min` and
a `max` property which will respectively be the minimum and maximum delay time, in milliseconds.

.. code-block:: yaml
    :caption: YAML

      http:
        request:
          path: '/foo'
        response:
          body: 'Hello, World!'
          delay:
            min: 20
            max: 500

.. code-block::  json
    :caption: JSON

      {
        "http": {
          "request": {
            "path": "/foo"
          },
          "response": {
            "body": "Hello, World!",
            "delay": {
              "min": 20,
              "max": 500
            }
          }
        }
      }

.. _headers:

`headers` option
----------------

The `headers` option lets you specify the headers sent along with the response. It is an object in which the key/value
pairs correspond the name/value pairs of the headers.

.. code-block:: yaml
    :caption: YAML

      http:
        request:
          path: '/foo'
        response:
          body: 'Hello, World!'
          headers:
            Content-Type: 'text/plain'

.. code-block::  json
    :caption: JSON

      {
        "http": {
          "request": {
            "path": "/foo"
          },
          "response": {
            "body": "Hello, World!",
            "headers": {
              "Content-Type": "text/plain"
            }
          }
        }
      }

`status` option
---------------

The `status` option lets you define the HTTP status code of the response.

.. code-block:: yaml
    :caption: YAML

      http:
        request:
          path: '/foo'
        response:
          body: 'Not found'
          status: 404

.. code-block::  json
    :caption: JSON

      {
        "http": {
          "request": {
            "path": "/foo"
          },
          "response": {
            "body": "Not found",
            "status": 404
          }
        }
      }

`velocity` option
-----------------

The `velocity` option either a boolean or an object. If a boolean, it tells mockservr if the value specified
in `response.body` or `response.bodyFile` is an Apache Velocity template file and should be parsed accordingly.

If an object, it may define an `enabled` value which tells mockservr if it should parse the response body as a Apache
Velocity template file. It may also define a `context` value which is an object. The values in this object will then
be passed to the Velocity engine and thus be available in the Apache Velcity template file.

Velocity templates let you access some of the request's parameters (such as query params and form data) and forge a
tailored response.

.. code-block:: yaml
    :caption: YAML

      http:
        request:
          path: '/foo'
        response:
          bodyFile: './responses/foo/response.json'
          velocity:
            enabled: true

.. code-block::  json
    :caption: JSON

      {
        "http": {
          "request": {
            "path": "/foo"
          },
          "response": {
            "bodyFile": "./responses/foo/response.json",
            "velocity": {
              "enabled": true
            }
          }
        }
      }

.. note::
    Mockservr take advantage of the `VelocityJS`VeloctiyJS_ javascript library, which does not implement all Velocity features.
    Check out their Github page for more information.

.. _VelocityJS: https://github.com/shepherdwind/velocity.js

.. note::
    More information about Apache Velocity template files can be foud on `Apache Velocity Documention`__.

.. _ApacheVelocityDoc: http://velocity.apache.org/engine/2.0/user-guide.html

__ ApacheVelocityDoc_

.. note::
    From within the Apache Velocity template, the following objects are available:
        - a `math` object which is a Javascript `Math` object
        - a `req` object which contains all data from the incoming HTTP request
        - an `endpoint` which is the object representing the matched endpoint from the mock definition file
        - a `context` which is the optional `velocity.context` object defined above

`weight` option
---------------

In case you define multiple responses for a single Request, the `weight` option lets you put weights on responses so
that the random selection of a response will be biased by this weight. Weight are plain numbers.

.. code-block:: yaml
    :caption: YAML

      http:
        request:
          path: '/foo'
        response:
          -
            body: 'Hello World!'
            weight: 10
          -
            body: "Bye World!"
            weight: 1

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
              "weight": 10
            },
            {
              "body": "Bye World!",
              weight: 1
            }
          ]
        }
      }

In the previous example, the "Hello World!" response will be sent by Mockservr 10 out of 11 times and the "By World!"
response 1 out of 11 times.
