DOCKER_DEPENDENCY_CONTAINER_COMMAND=docker run --rm -v $$SSH_AUTH_SOCK:/ssh-agent -v $$(pwd)/ssh_config:/etc/ssh/ssh_config --env SSH_AUTH_SOCK=/ssh-agent

npm_install_app:
	$(DOCKER_DEPENDENCY_CONTAINER_COMMAND) -v $$(pwd)/app:/usr/src/app -w /usr/src/app node:8 npm install || if [ $(STOP_ON_FAILURE) = true ]; then exit 1 ; fi

npm_install_gui:
	$(DOCKER_DEPENDENCY_CONTAINER_COMMAND) -v $$(pwd)/app/gui:/usr/src/app -w /usr/src/app node:8 npm install || if [ $(STOP_ON_FAILURE) = true ]; then exit 1 ; fi

npm_install: npm_install_app npm_install_gui

npm_bash:
	$(DOCKER_DEPENDENCY_CONTAINER_COMMAND) -it -v $$(pwd)/app:/usr/src/app -w /usr/src/app node:8 bash || if [ $(STOP_ON_FAILURE) = true ]; then exit 1 ; fi

npm_clear_app:
	$(DOCKER_DEPENDENCY_CONTAINER_COMMAND) -it -v $$(pwd)/app:/usr/src/app -w /usr/src/app node:8 rm -rf node_modules || if [ $(STOP_ON_FAILURE) = true ]; then exit 1 ; fi

npm_clear_gui:
	$(DOCKER_DEPENDENCY_CONTAINER_COMMAND) -it -v $$(pwd)/app/gui:/usr/src/app -w /usr/src/app node:8 rm -rf node_modules || if [ $(STOP_ON_FAILURE) = true ]; then exit 1 ; fi

npm_clear: npm_clear_gui npm_clear_app

dev: npm_install
	docker-compose up

reset_compose_override:
	cp docker-compose.override.dist.yml docker-compose.override.yml
