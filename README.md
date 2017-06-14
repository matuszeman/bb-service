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

## Classes

<dl>
<dt><a href="#AbstractService">AbstractService</a></dt>
<dd><p>Abstract service.</p>
<p>Provides generic param validation methods. Uses <a href="https://github.com/hapijs/joi/">Joi</a> for validation.
Constructor accepts options parameter with Joi schema to validate the options against.</p>
</dd>
<dt><a href="#Validator">Validator</a></dt>
<dd><p>Validation helpers</p>
</dd>
</dl>

<a name="AbstractService"></a>

## AbstractService
Abstract service.

Provides generic param validation methods. Uses [Joi](https://github.com/hapijs/joi/) for validation.
Constructor accepts options parameter with Joi schema to validate the options against.

**Kind**: global class  

* [AbstractService](#AbstractService)
    * [new AbstractService(options, optionsSchema)](#new_AbstractService_new)
    * [.setLogger(logger)](#AbstractService+setLogger)
    * [.validateParamsAsync(params, schema, strict)](#AbstractService+validateParamsAsync) ⇒ <code>Promise</code>
    * [.paramsAsync()](#AbstractService+paramsAsync)
    * [.validateParams(params, schema, strict)](#AbstractService+validateParams) ⇒ <code>\*</code>
    * [.params()](#AbstractService+params)

<a name="new_AbstractService_new"></a>

### new AbstractService(options, optionsSchema)

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 
| optionsSchema | <code>Joi</code> | 

**Example**  
```js
const {AbstractService, Joi} = require('bb-service');

class MyService extends AbstractService {
  constructor(myServiceOpts) {
    super(myServiceOpts, {
      param1: Joi.string(),
      param2: Joi.number().optional().default(10)
    })
  }

  ping(params) {
    params = this.params(params, {
      value: Joi.string()
    });

    //service options
    this.options.param1;
    this.options.param2 === 10;

    //method param
    params.value;

    return {
      pong: params.value
    }
  }
}
```
<a name="AbstractService+setLogger"></a>

### abstractService.setLogger(logger)
Set service logger

**Kind**: instance method of <code>[AbstractService](#AbstractService)</code>  

| Param | Type | Description |
| --- | --- | --- |
| logger | <code>Object</code> |  |
| logger.log | <code>function</code> | Log function |

<a name="AbstractService+validateParamsAsync"></a>

### abstractService.validateParamsAsync(params, schema, strict) ⇒ <code>Promise</code>
Async validates params using Joi schema provided.

**Kind**: instance method of <code>[AbstractService](#AbstractService)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  |  |
| schema | <code>Joi</code> |  |  |
| strict | <code>boolean</code> | <code>true</code> | TODO |

<a name="AbstractService+paramsAsync"></a>

### abstractService.paramsAsync()
Alias of [validateParamsAsync](#AbstractService+validateParamsAsync)

**Kind**: instance method of <code>[AbstractService](#AbstractService)</code>  
<a name="AbstractService+validateParams"></a>

### abstractService.validateParams(params, schema, strict) ⇒ <code>\*</code>
Validates params using Joi schema provided.

**Kind**: instance method of <code>[AbstractService](#AbstractService)</code>  

| Param | Type | Default |
| --- | --- | --- |
| params | <code>Object</code> |  | 
| schema | <code>Joi</code> |  | 
| strict | <code>boolean</code> | <code>true</code> | 

<a name="AbstractService+params"></a>

### abstractService.params()
Alias of [validateParams](#AbstractService+validateParams)

**Kind**: instance method of <code>[AbstractService](#AbstractService)</code>  
<a name="Validator"></a>

## Validator
Validation helpers

**Kind**: global class  

* [Validator](#Validator)
    * [.params(params, schema, [strict])](#Validator.params) ⇒ <code>Object</code>
    * [.paramsAsync(params, schema, [strict])](#Validator.paramsAsync) ⇒ <code>Promise</code>
    * [.options(options, schema, [strict])](#Validator.options) ⇒ <code>Object</code>
    * [.api(api, schema, [desc])](#Validator.api) ⇒ <code>\*</code>

<a name="Validator.params"></a>

### Validator.params(params, schema, [strict]) ⇒ <code>Object</code>
Validates params using Joi schema provided. All parameters defined in Joi schema are required.

**Kind**: static method of <code>[Validator](#Validator)</code>  
**Returns**: <code>Object</code> - Validated params  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  |  |
| schema | <code>Joi</code> |  |  |
| [strict] | <code>boolean</code> | <code>true</code> | Allows unknown parameters |

<a name="Validator.paramsAsync"></a>

### Validator.paramsAsync(params, schema, [strict]) ⇒ <code>Promise</code>
Async version of [Validator#params](Validator#params)

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object</code> |  |  |
| schema | <code>Joi</code> |  |  |
| [strict] | <code>boolean</code> | <code>true</code> | Allows unknown parameters |

<a name="Validator.options"></a>

### Validator.options(options, schema, [strict]) ⇒ <code>Object</code>
Validates service options

**Kind**: static method of <code>[Validator](#Validator)</code>  
**Returns**: <code>Object</code> - Validated options  

| Param | Type | Default |
| --- | --- | --- |
| options | <code>Object</code> |  | 
| schema | <code>Joi</code> |  | 
| [strict] | <code>Joi</code> | <code>true</code> | 

<a name="Validator.api"></a>

### Validator.api(api, schema, [desc]) ⇒ <code>\*</code>
Validates object's API

**Kind**: static method of <code>[Validator](#Validator)</code>  

| Param | Type |
| --- | --- |
| api | <code>Object</code> | 
| schema | <code>Joi</code> | 
| [desc] | <code>String</code> | 


# Development

## Tests

```
npm test
```

Tests / examples currently require rabbitmq to be running on amqp://localhost
