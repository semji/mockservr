.. _API:

===
API
===

Mockservr exposes an HTTP API which allow to get information about current endpoints, and to update them if needed.
This API is available through HTTP queries on `http://localhost:4580` (the API is exposed through the port 4580 of
the Mockservr's container).

-------------
API Endpoints
-------------

All endpoints are JSON endpoints (`Content-Type: application/json`) and must be prefixed with `/api`.

`/api` endpoint
===============

`GET` method
~~~~~~~~~~~~

The response is an object with a single attribute `httpEndpoints`, it contains the number of endpoints currently served
by Mockservr.

`/api/http-endpoints` endpoint
==============================

`GET` Method
~~~~~~~~~~~~

The response is a collection of all HTTP endpoints cuurrently served by Mockservr. The response includes the internal
ID of the endpoint and the source (mock file or API).

`POST` method
~~~~~~~~~~~~~

It expects a JSON body as defined in :ref:`http_mocking`, defining an endpoint with a Request and a Response.

The response contains the newly created endpoint with its ID and source. If any error occurred, the response is an
HTTP 400 response with a json object that contains all encountered errors.

`/api/http-endpoints/:id` endpoint
==================================

`GET` Method
~~~~~~~~~~~~

The response is an object defining the endpoint corresponding to the given `:id`.

`DELETE` method
~~~~~~~~~~~~~

Deletes the endpoint from Mockservr. The response is an HTTP 204 response. If any error occurred, the response is an
HTTP 400 response with a json object that contains all encountered errors.

.. note::
    `DELETE` method does not delete the mock file, if the target endpoint is defined in a mock file.
