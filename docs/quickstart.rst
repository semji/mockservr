Quickstart
==========

Mockservr is designed to be as user-friendly as possible, hence it can be integrated into an existing stack really
quickly, immediately providing a way to mock APIs.

System requirements
-------------------

In order to run mockservr in the easiest way, we provide docker images.

- Docker >= 18 (https://www.docker.com/)

Running with docker
-------------------

One way of running Mockservr is through Docker.

.. code-block:: sh

  docker run -dit --name my-mockservr -p 8080:80 -p 4580:4580 -v "$PWD":/usr/src/app/mocks mockservr/mockservr:latest

Running with docker-compose
---------------------------

Assuming your stack runs using docker-compose, Mockservr can be easily integrated in your docker-compose.yaml file :

.. code-block:: yaml

  mockservr:
    image: mockservr/mockservr:latest
    volumes:
      - ./mocks:/usr/src/app/mocks
    ports:
      - 8080:80
      - 4580:4580
