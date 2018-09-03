Mockservr Documentation
=======================

Mockservr is an API mocking system, allowing to configure endpoints, specifying requests details and
responses.

- YAML or JSON endpoint configuration
- Manage endpoint configuration with API
- Ability to use Apache Velocity Template files to dynamically adapt responses to requests parameters
- Available under docker image, see dockerhub to be easily integrated into a development / test stack

Using Mockservr gives the ability to avoid real API calls to external providers, while ensuring that the code
carries no logic related to the environment.

Summary
=======

.. toctree::
  :maxdepth: 3

  quickstart
  http_mocking
  validators
  API
