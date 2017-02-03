#!/bin/bash

apt-get install -y build-essential libudev-dev

cd /app

npm install

npm run knex-build-db

npm start
