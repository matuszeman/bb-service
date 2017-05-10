'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var Joi = require('joi');

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

var AbstractService = function () {
  /**
   * @param {Object} options
   * @param {Joi} optionsSchema
   */
  function AbstractService(options, optionsSchema) {
    (0, _classCallCheck3.default)(this, AbstractService);

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


  (0, _createClass3.default)(AbstractService, [{
    key: 'validateParamsAsync',
    value: function validateParamsAsync(params, schema) {
      var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      try {
        return _promise2.default.resolve(this.validateParams(params, schema, strict));
      } catch (err) {
        return _promise2.default.reject(err);
      }
    }

    /**
     * Alias of {@link AbstractService#validateParamsAsync}
     */

  }, {
    key: 'paramsAsync',
    value: function paramsAsync(params, schema, strict) {
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

  }, {
    key: 'validateParams',
    value: function validateParams(params, schema) {
      var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var ret = Joi.validate(params, schema, { stripUnknown: false, allowUnknown: !strict, presence: 'required' });
      if (ret.error) {
        throw ret.error;
      }
      return ret.value;
    }

    /**
     * Alias of {@link AbstractService#validateParams}
     */

  }, {
    key: 'params',
    value: function params(_params, schema, strict) {
      return this.validateParams(_params, schema, strict);
    }
  }, {
    key: '_validateOptions',
    value: function _validateOptions(options, schema) {
      var ret = Joi.validate(options, schema, { allowUnknown: false, presence: 'required' });
      if (ret.error) {
        throw ret.error;
      }
      return ret.value;
    }
  }]);
  return AbstractService;
}();

module.exports = AbstractService;