#!/bin/bash

# $1    .env file
# $2    image name
# $3    tag

source ./scripts/env.sh $1

docker run -it --rm -p $PORT:$PORT --env-file=$1 $2:$3
