.. _quickstart

==========
Quickstart
==========

Mockservr is designed to be as user-friendly as possible, hence it can be integrated into an existing stack really
quickly, immediately providing a way to mock APIs.

*******************
System requirements
*******************

In order to run mockservr in the easiest way, we provide docker images.

The minimum requirements on the host system are:

- Docker >= 18 (https://www.docker.com/)

.. _quickstart_running_with_docker

*******************
Running with docker
*******************

One way of running Mockservr is through Docker.

.. code-block:: sh

  docker run -dit --name my-mockservr -p 8085:80 -p 4580:4580 -v "$PWD":/usr/src/app/mocks mockservr/mockservr:latest

From now, all defined mocks will be accessible through `http://localhost:8085`.

.. _quickstart_running_with_docker_compose

***************************
Running with docker-compose
***************************

Assuming your stack runs using docker-compose, Mockservr can be easily integrated in your docker-compose.yaml file :

.. code-block:: yaml

  services:
    # ...

    mockservr:
      image: mockservr/mockservr:latest
      volumes:
        - ./mocks:/usr/src/app/mocks
      ports:
        - 8085:80
        - 4580:4580

From now on, all defined mocks will be accessible through `http://localhost:8085`.
