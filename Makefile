SHELL:=/bin/bash

service_image=crispy-broccoli
tag=v0.0.1
env=.env


# make clean
.PHONY: clean
clean:
	@rm -rf ./server/node_modules


# make build
.PHONY: build
build:
	@pushd server; yarn; popd
	@echo "TODO: Julian to build web app here :)"


# make run env={env file}
.PHONY: run
run:
	@yarn global add pino-pretty
	@source ./scripts/env.sh $(env) && node ./server/index.js | pino-pretty


# make docker tag={tag}
.PHONY: docker
docker: clean
	@docker build -t $(service_image):$(tag) .


# make docker_run env={env file} tag={tag}
.PHONY: docker_run
docker_run:
	@./scripts/docker.sh $(env)	$(service_image) $(tag)


.PHONY: changelog
changelog:
	@git-chglog > CHANGELOG.md
	@echo "Changelog has been updated."


.PHONY: changelog_release
changelog_release:
	@git-chglog --next-tag $(tag) > CHANGELOG.md
	@echo "Changelog has been updated."
