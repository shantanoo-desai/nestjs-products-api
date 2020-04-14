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
