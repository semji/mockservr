# Mockservr Quickstart Guide

![travis status](https://travis-ci.com/mockservr/mockservr.svg?branch=master) ![Docker Pulls](https://img.shields.io/docker/pulls/mockservr/mockservr.svg?maxAge=604800)

Mockservr is an API mocking system, allowing to configure endpoints, specifying requests details and responses.

 * YAML or JSON endpoint configuration
 * Ability to use Apache Velocity Template files to dynamically adapt responses to requests parameters
 * Available under docker image, see dockerhub to be easily integrated into a development / test stack

Mockservr is designed to be as user-friendly as possible, hence it can be integrated into an existing stack really quickly, immediately providing a way to mock APIs.

## Docker Container

![docker hub](https://hub.docker.com/public/images/logos/mini-logo.svg) [mockservr/mockservr](https://hub.docker.com/r/mockservr/mockservr/)

```
docker pull mockservr/mockservr
docker run -p 8080:80 -p 4580:4580 -v /some/mocks:/usr/src/app/mocks -d mockservr/mockservr
```

## Requirements

* `docker`

## Mockservr browser

Mockservr comes with an embedded web based object browser.

Default web browser url : [http://localhost:4580](http://localhost:4580).

## Hello World

Put sample config mock below in `/some/mock` directory on your host.

hello-world.mock.yaml
```yaml
http:
    -
        request: "/hello/world"
        response: "Hello World !"
```
hello-world.mock.json
```json
{
  "http": [
    {
      "request": "/hello/world",
      "response": "Hello World !"
    }
  ]
}
```
Go to [http://localhost:8080/hello/world](http://localhost:8080/hello/world)

## Full documentation

[Read the docs](https://mockservr.readthedocs.io/)
