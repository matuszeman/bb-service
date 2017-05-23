'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Joi = require('joi');
var AbstractService = require('./abstract-service');
var Validator = require('./validator');

/**
 * @typedef {Object} MessageEmitter
 * @property {Function} next Function which emits the message `function(message) {}`
 */

/**
 * @typedef {Object} Message
 * @property {string} type
 * @property {string} service
 * @property {string} ts ISO 8601 string
 * @property {Object} data
 */

/**
 * Message publisher
 */

var MessagePublisher = function (_AbstractService) {
  (0, _inherits3.default)(MessagePublisher, _AbstractService);

  /**
   *
   * @param {Object} messagePublisherOpts
   * @param {string} messagePublisherOpts.service
   * @param {MessageEmitter} messageEmitter
   */
  function MessagePublisher(messagePublisherOpts, messageEmitter) {
    (0, _classCallCheck3.default)(this, MessagePublisher);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MessagePublisher.__proto__ || (0, _getPrototypeOf2.default)(MessagePublisher)).call(this, messagePublisherOpts, {
      service: Joi.string()
    }));

    _this.messageEmitter = Validator.api(messageEmitter, {
      next: Joi.func()
    }, 'messageEmitter');
    return _this;
  }

  (0, _createClass3.default)(MessagePublisher, [{
    key: 'validateMessage',
    value: function validateMessage(msg) {
      msg = this.params(msg, {
        type: Joi.string(),
        data: Joi.object(),
        ts: Joi.string().isoDate().optional().default(new Date().toISOString())
      });
      msg.service = this.options.service;
      return msg;
    }

    /**
     * Emits the message
     *
     * @param {Object} msg
     * @param {String} msg.type Message type
     * @param {Object} msg.data The payload
     * @param {String} [msg.ts=now] ISO 8601 string
     */

  }, {
    key: 'emit',
    value: function emit(msg) {
      this.messageEmitter.next(this.validateMessage(msg));

      this.logger.log({
        level: 'debug',
        type: 'messageEmitted',
        msg: msg
      });
    }
  }]);
  return MessagePublisher;
}(AbstractService);

module.exports = MessagePublisher;