SHELL:=/bin/bash

service_image=the-kindness-project-webapp
tag=v0.0.1
env=.env


# make lint
.PHONY: lint
lint:
	@pushd server; yarn run prettier --write --config .prettierrc .; popd


# make clean
.PHONY: clean
clean:
	@rm -rf ./server/node_modules


# make mongo
.PHONY: mongo
mongo:
	@-docker stop mongo
	@docker run -d -it --rm --name mongo -p 27017:27017 mongo:3.6


# make build
.PHONY: build
build: lint
	@pushd server; yarn; popd
	@pushd web; bower install; yarn; popd


# make run env={env file}
.PHONY: run
run:
	@yarn global add pino-pretty
	@source ./scripts/env.sh $(env) && node ./server/index.js | pino-pretty


# make run_watch env={env file}
.PHONY: run_watch
run_watch:
	@yarn global add pino-pretty
	@source ./scripts/env.sh $(env) && nodemon --watch ./server --watch ./web/src ./server/index.js | pino-pretty


# make docker tag={tag}
.PHONY: docker
docker: clean
	@docker build -t $(service_image):$(tag) .


# make docker_run env={env file} tag={tag}
.PHONY: docker_run
docker_run:
	@./scripts/docker.sh $(env)	$(service_image) $(tag)


# make changelog
.PHONY: changelog
changelog:
	@git-chglog > CHANGELOG.md
	@echo "Changelog has been updated."


# make changelog_release tag={tag}
.PHONY: changelog_release
changelog_release:
	@git-chglog --next-tag $(tag) > CHANGELOG.md
	@echo "Changelog has been updated."


# make release tag={tag}
.PHONY: release
release: build docker
	@git tag -s $(tag) -m "Release $(tag)"
	@git push --tags
	@heroku login
	@heroku container:login
	@docker tag $(service_image):$(tag) registry.heroku.com/$(service_image)/web
	@docker push registry.heroku.com/$(service_image)/web
	@heroku container:release web
