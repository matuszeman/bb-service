'use strict';

const _ = require('lodash');
const Joi = require('joi');

/**
 * Abstract service.
 *
 * Used as abstract service to extend from only.
 *
 * @example
 * const {AbstractService, Joi} = require('bb-service');
 *
 * class MyService extends AbstractService {
 *   constructor(myServiceOpts) {
 *     super(myServiceOpts, {
 *       param1: Joi.string(),
 *       param2: Joi.number().optional().default(10)
 *     })
 *   }
 *
 *   ping(params) {
 *     params = this.params(params, {
 *       value: Joi.string()
 *     });
 *
 *     //service options
 *     this.options.param1;
 *     this.options.param2 === 10;
 *
 *     //method param
 *     params.value;
 *
 *     return {
 *       pong: params.value
 *     }
 *   }
 * }
 */
class AbstractService {
  /**
   * @param {Object} options
   * @param {Joi} optionsSchema
   */
  constructor(options, optionsSchema) {
    this.options = {};
    this.optionsSchema = optionsSchema || {};

    options = this._validateOptions(options || {}, this.optionsSchema);
    this.options = options;
  }

  /**
   * Async validates params using Joi schema provided.
   *
   * @param {Object} params
   * @param {Joi} schema
   * @param {boolean} strict TODO
   * @returns {Promise}
   */
  validateParamsAsync(params, schema, strict = true) {
    try {
      return Promise.resolve(this.validateParams(params, schema, strict));
    } catch(err) {
      return Promise.reject(err);
    }
  }

  /**
   * Alias of {@link AbstractService#validateParamsAsync}
   */
  paramsAsync(params, schema, strict) {
    return this.validateParamsAsync(params, schema, strict);
  }

  /**
   * Validates params using Joi schema provided.
   *
   * @param {Object} params
   * @param {Joi} schema
   * @param {boolean} strict
   * @returns {*}
   */
  validateParams(params, schema, strict = true) {
    const ret = Joi.validate(params, schema, { stripUnknown: false, allowUnknown: !strict, presence: 'required' });
    if (ret.error) {
      throw ret.error;
    }
    return ret.value;
  }

  /**
   * Alias of {@link AbstractService#validateParams}
   */
  params(params, schema, strict) {
    return this.validateParams(params, schema, strict);
  }

  _validateOptions(options, schema) {
    const ret = Joi.validate(options, schema, { allowUnknown: false, presence: 'required' });
    if (ret.error) {
      throw ret.error;
    }
    return ret.value;
  }
}

module.exports = AbstractService;
