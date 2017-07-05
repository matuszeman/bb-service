'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var Joi = require('joi');
var Validator = require('./validator');

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

var AbstractService = function () {
  /**
   * @param {Object} options
   * @param {Joi} optionsSchema
   */
  function AbstractService() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var optionsSchema = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, AbstractService);

    this.options = Validator.options(options, optionsSchema);

    this.logger = {
      log: function log() {}
    };
  }

  /**
   * Set service logger
   *
   * @param {Object} logger
   * @param {Function} logger.log Log function
   */


  (0, _createClass3.default)(AbstractService, [{
    key: 'setLogger',
    value: function setLogger(logger) {
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

  }, {
    key: 'validateParamsAsync',
    value: function validateParamsAsync(params, schema) {
      var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return Validator.paramsAsync(params, schema, strict);
    }

    /**
     * Alias of {@link AbstractService#validateParamsAsync}
     */

  }, {
    key: 'paramsAsync',
    value: function paramsAsync(params, schema) {
      var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

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

  }, {
    key: 'validateParams',
    value: function validateParams(params, schema) {
      var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return Validator.params(params, schema, strict);
    }

    /**
     * Alias of {@link AbstractService#validateParams}
     */

  }, {
    key: 'params',
    value: function params(_params, schema) {
      var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.validateParams(_params, schema, strict);
    }
  }]);
  return AbstractService;
}();

module.exports = AbstractService;