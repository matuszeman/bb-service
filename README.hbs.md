# bb-service

[![Build Status](https://travis-ci.org/matuszeman/bb-service.svg?branch=master)](https://travis-ci.org/matuszeman/bb-service)

TODO

Abstract service implementation with the following spec:

* service options: constructor first parameter is immutable plain object
* service public methods: always async so they can be called either locally (when installed as npm package) or remotely (e.g. using seneca)
  without a consumer refactoring, accepts only one parameter plain object and always return a plain object.
* private methods: should be prefixed with "_"
* implements setLogger method - logger API: `{ log: Function }`

# Installation

```
npm install @kapitchi/bb-service
```

# Usage

TODO

For ES5 compatible implementation use `require('@kapitchi/bb-service/es5')`.

# API

{{>main}}

# Development

Run the command below to builds es5 folder and README.md.

```
npm run build
```

## Tests

```
npm test
```

# Contribute

Please feel free to submit an issue/PR or contact me at matus.zeman@gmail.com.

# License

[MIT](LICENSE)
