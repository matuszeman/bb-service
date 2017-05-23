'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Joi = require('joi');

/**
 * Validation helpers
 */

var Validator = function () {
  function Validator() {
    (0, _classCallCheck3.default)(this, Validator);
  }

  (0, _createClass3.default)(Validator, null, [{
    key: 'params',

    /**
     * Validates params using Joi schema provided. All parameters defined in Joi schema are required.
     *
     * @param {Object} params
     * @param {Joi} schema
     * @param {boolean} [strict=true] Allows unknown parameters
     * @returns {Object} Validated params
     */
    value: function params(_params, schema) {
      var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return Joi.attempt(_params, Joi.compile(schema).options({ stripUnknown: false, allowUnknown: !strict, presence: 'required' }));
    }

    /**
     * Async version of {@link Validator#params}
     *
     * @param {Object} params
     * @param {Joi} schema
     * @param {boolean} [strict=true] Allows unknown parameters
     * @returns {Promise}
     */

  }, {
    key: 'paramsAsync',
    value: function paramsAsync(params, schema) {
      var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      try {
        return _promise2.default.resolve(Validator.params(params, schema, strict));
      } catch (err) {
        return _promise2.default.reject(err);
      }
    }

    /**
     * Validates service options
     *
     * @param {Object} options
     * @param {Joi} schema
     * @param {Joi} [strict=true]
     * @returns {Object} Validated options
     */

  }, {
    key: 'options',
    value: function options() {
      var _options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var schema = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return Joi.attempt(_options, Joi.compile(schema).options({ stripUnknown: false, allowUnknown: !strict, presence: 'required' }));
    }

    /**
     * Validates object's API
     *
     * @param {Object} api
     * @param {Joi} schema
     * @param {String} [desc]
     * @returns {*}
     */

  }, {
    key: 'api',
    value: function api(_api, schema) {
      var desc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      Joi.attempt(_api, Joi.compile(schema).options({ presence: 'required', allowUnknown: true }), desc);
      return _api;
    }
  }]);
  return Validator;
}();

module.exports = Validator;