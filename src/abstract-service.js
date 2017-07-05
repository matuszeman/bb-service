'use strict';

const _ = require('lodash');
const Joi = require('joi');
const Validator = require('./validator');

/**
 * Abstract service.
 *
 * Provides generic param validation methods. Uses [Joi](https://github.com/hapijs/joi/) for validation.
 * Constructor accepts options parameter with Joi schema to validate the options against.
 *
 * @example
 * const {AbstractService, Joi} = require('@kapitchi/bb-service');
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
  constructor(options = {}, optionsSchema = {}) {
    this.options = Validator.options(options, optionsSchema);

    this.logger = {
      log: () => {}
    };
  }

  /**
   * Set service logger
   *
   * @param {Object} logger
   * @param {Function} logger.log Log function
   */
  setLogger(logger) {
    this.logger = Validator.api(logger, {
      log: Joi.func()
    }, 'logger');
  }

  /**
   * Async validates params using Joi schema provided.
   *
   * @param {Object} params
   * @param {Joi} schema
   * @param {boolean} [strict=true] false - allows unknown parameters
   * @returns {Promise}
   */
  validateParamsAsync(params, schema, strict = true) {
    return Validator.paramsAsync(params, schema, strict);
  }

  /**
   * Alias of {@link AbstractService#validateParamsAsync}
   */
  paramsAsync(params, schema, strict = true) {
    return this.validateParamsAsync(params, schema, strict);
  }

  /**
   * Validates params using Joi schema provided.
   *
   * @param {Object} params
   * @param {Joi} schema
   * @param {boolean} [strict=true] false - allows unknown parameters
   * @returns {*}
   */
  validateParams(params, schema, strict = true) {
    return Validator.params(params, schema, strict);
  }

  /**
   * Alias of {@link AbstractService#validateParams}
   */
  params(params, schema, strict = true) {
    return this.validateParams(params, schema, strict);
  }
}

module.exports = AbstractService;
