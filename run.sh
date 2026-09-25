#!/bin/bash

./scripts/ssl.sh
exit 1
./scripts/install.sh
./scripts/setup_env.sh
./scripts/build.sh
./scripts/run_prod.sh
