#!/bin/bash

export $(egrep -v '^#' $1 | xargs)
