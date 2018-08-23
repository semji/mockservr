npm_install_app:
	docker-compose run mockservr npm install

npm_install_gui:
	docker-compose run -w /usr/src/app/gui mockservr npm install

npm_install: npm_install_app npm_install_gui

npm_shell:
	docker-compose run mockservr sh

npm_clear_app:
	docker-compose run mockservr rm -rf node_modules

npm_clear_gui:
	docker-compose run -w /usr/src/app/gui mockservr rm -rf node_modules

npm_clear: npm_clear_gui npm_clear_app

dev: npm_install
	docker-compose up

reset_compose_override:
	cp docker-compose.override.dist.yml docker-compose.override.yml
