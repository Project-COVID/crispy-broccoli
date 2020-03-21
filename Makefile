env=.env

# make run env={env file} cmd={cmd} flags={flags}
.PHONY: run
run:
	@yarn global add pino-pretty
	@source ./scripts/env.sh $(env) && node ./server/index.js | pino-pretty
