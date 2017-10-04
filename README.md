# Mockserver

## Starting the application with Docker

### Requirements

It is necessary for starting the project with Docker to have :

* `docker` >= `1.10.1`
* `docker-compose` >= `1.7`

### Steps

Launch the following command in order to generate `docker-compose.override.yml` file. You can customize it to your specific needs:

`make reset_compose_override`

And launch the server with:

`make dev`
