const Joi = require('joi');

/**
 * Validation helpers
 */
class Validator {
  /**
   * Validates params using Joi schema provided. All parameters defined in Joi schema are required.
   *
   * @param {Object} params
   * @param {Joi} schema
   * @param {boolean} [strict=true] Allows unknown parameters
   * @returns {Object} Validated params
   */
  static params(params, schema, strict = true) {
    return Joi.attempt(params, Joi.compile(schema).options({ stripUnknown: false, allowUnknown: !strict, presence: 'required' }));
  }

  /**
   * Async version of {@link Validator#params}
   *
   * @param {Object} params
   * @param {Joi} schema
   * @param {boolean} [strict=true] Allows unknown parameters
   * @returns {Promise}
   */
  static paramsAsync(params, schema, strict = true) {
    try {
      return Promise.resolve(Validator.params(params, schema, strict));
    } catch(err) {
      return Promise.reject(err);
    }
  }

  /**
   * Validates service options
   *
   * @param {Object} options
   * @param {Joi} schema
   * @returns {Object} Validated options
   */
  static options(options = {}, schema = {}) {
    return Joi.attempt(options, Joi.compile(schema).options({ allowUnknown: false, presence: 'required' }));
  }

  /**
   * Validates object's API
   *
   * @param {Object} api
   * @param {Joi} schema
   * @param {String} [desc]
   * @returns {*}
   */
  static api(api, schema, desc = '') {
    Joi.attempt(api, Joi.compile(schema).options({presence: 'required', allowUnknown: true}), desc);
    return api;
  }
}

module.exports = Validator;
