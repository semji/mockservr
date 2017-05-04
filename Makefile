DOCKER_DEPENDENCY_CONTAINER_COMMAND=docker run --rm -v $$SSH_AUTH_SOCK:/ssh-agent -v $$(pwd)/ssh_config:/etc/ssh/ssh_config --env SSH_AUTH_SOCK=/ssh-agent

npm_install:
	$(DOCKER_DEPENDENCY_CONTAINER_COMMAND) -v $$(pwd)/app:/usr/src/app -w /usr/src/app node:7 npm install || if [ $(STOP_ON_FAILURE) = true ]; then exit 1 ; fi

npm_bash:
	$(DOCKER_DEPENDENCY_CONTAINER_COMMAND) -it -v $$(pwd)/app:/usr/src/app -w /usr/src/app node:7 bash || if [ $(STOP_ON_FAILURE) = true ]; then exit 1 ; fi

npm_clear:
	$(DOCKER_DEPENDENCY_CONTAINER_COMMAND) -it -v $$(pwd)/app:/usr/src/app -w /usr/src/app node:7 rm -rf node_modules || if [ $(STOP_ON_FAILURE) = true ]; then exit 1 ; fi

dev: npm_install
	docker-compose up
