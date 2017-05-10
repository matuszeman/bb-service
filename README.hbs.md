# bb-service

TODO

Abstract service implementation with the following spec:

* service options: constructor first parameter is immutable plain object
* service methods: always async so they can be called either locally (when installed as npm package) or remotely (e.g. using seneca) without a consumer refactoring, accepts only only one parameter plain object, and always return plain object
* private methods: should be prefixed with "_"


# Installation

```
npm install matuszeman/bb-service
```

# Usage

For ES5 compatible implementation use `require('bb-service/es5')`.

TODO

# API

{{>main}}