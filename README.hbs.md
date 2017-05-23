# bb-service

TODO

Abstract service implementation with the following spec:

* service options: constructor first parameter is immutable plain object
* service public methods: always async so they can be called either locally (when installed as npm package) or remotely (e.g. using seneca)
  without a consumer refactoring, accepts only one parameter plain object and always return a plain object.
* private methods: should be prefixed with "_"
* implements setLogger method - logger API: `{ log: Function }`

## Message publisher/subscriber

TODO

# Installation

```
npm install matuszeman/bb-service
```

# Usage

For ES5 compatible implementation use `require('bb-service/es5')`.

See `src/examples*.spec.js` files for some examples.

TODO

# API

{{>main}}

# Development

## Tests

```
npm test
```

Tests / examples currently require rabbitmq to be running on amqp://localhost
