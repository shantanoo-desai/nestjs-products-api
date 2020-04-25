# NESTJS-Products-API

[![Build Status](https://travis-ci.org/shantanoo-desai/nestjs-products-api.svg?branch=master)](https://travis-ci.org/shantanoo-desai/nestjs-products-api)

Academind's Video Tutorial on making RESTful API __Nest__ with __MongoDB__.

This repository will work on integrating Tests with Travis-CI and Docker.

## Installation

```bash
$ npm install
```

## Running the app

Use a `.env` file to load the App Port and MONGODB Cluster's URL to connect to MongoDB. See `sampleENV.env` for details.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

### Development 

Run the image:

    docker build -t nestjs-products-api .

### Production

    docker run -d --name="nestjs-api" -p 3000:3000 -e DATABASE_URL="<MongoDB_URI>" nestjs-products-api:latest


## Travis-CI Automated Docker Build

[Medium.com Blog for Setting up the CI](https://medium.com/@shantanoodesai/ci-cd-notes-nest-js-travis-ci-docker-75843ab2287e)

1. Create an __Access-Token__ from [Docker Hub Security Settings](https://hub.docker.com/settings/security)

2. In your __Travis-CI Build Settings__ add `DOCKER_USERNAME` and `DOCKER_PASSWORD` as environment variables, where `DOCKER_PASSWORD` is the generated __Access-Token__

3. Refer to `.travis.yml` for automated build

