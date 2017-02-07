# bb-service

TODO

Abstract service implementation with the following spec:

* service options: constructor first parameter is non mutable plain object
* service methods: always async so they can be called either locally (when installed as npm package) or remotely (e.g. using seneca) without a consumer refactoring, accepts only only one parameter plain object, and always return plain object
* private methods: should be prefixed with "_"


# Installation

```
npm install matuszeman/bb-service
```

# API

<a name="AbstractService"></a>

## AbstractService
Abstract service.

Used as abstract service to extend from only.

**Kind**: global class  

* [AbstractService](#AbstractService)
    * [new AbstractService(options, optionsSchema)](#new_AbstractService_new)
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
