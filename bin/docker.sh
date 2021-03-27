#!/bin/bash

DIRECTORY=$(dirname $(realpath $0 ))
docker run -it --rm --name autonome-dev -v "$DIRECTORY/..":/home/node/app -w /home/node/app node:14 bash
