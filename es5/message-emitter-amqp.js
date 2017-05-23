'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

/**
 * AMQP message emitter
 *
 * Implements {@link MessageEmitter} interface.
 */

var MessageEmitterAmqp = function (_AbstractService) {
  (0, _inherits3.default)(MessageEmitterAmqp, _AbstractService);

  /**
   *
   * @param {Object} messageEmitterAmqpOpts
   * @param {String} messageEmitterAmqpOpts.exchange
   * @param {Object} amqpConnection
   */
  function MessageEmitterAmqp(messageEmitterAmqpOpts, amqpConnection) {
    (0, _classCallCheck3.default)(this, MessageEmitterAmqp);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MessageEmitterAmqp.__proto__ || (0, _getPrototypeOf2.default)(MessageEmitterAmqp)).call(this, messageEmitterAmqpOpts, {
      exchange: Joi.string()
    }));

    _this.connection = amqpConnection;
    return _this;
  }

  /**
   * Calls {@link MessageEmitterAmqp#connect}
   */


  (0, _createClass3.default)(MessageEmitterAmqp, [{
    key: 'asyncInit',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.connect();

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function asyncInit() {
        return _ref.apply(this, arguments);
      }

      return asyncInit;
    }()

    /**
     * Creates a channel and an exchange
     */

  }, {
    key: 'connect',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var ch;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.connection.createChannel();

              case 2:
                ch = this.channel = _context2.sent;
                _context2.next = 5;
                return ch.assertExchange(this.options.exchange, 'topic', {
                  durable: true
                });

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function connect() {
        return _ref2.apply(this, arguments);
      }

      return connect;
    }()

    /**
     * Impl of interface {@link MessageEmitter}
     *
     * @param {Message} msg
     */

  }, {
    key: 'next',
    value: function next(msg) {
      var eventName = msg.service + '.' + msg.type;
      this.channel.publish(this.options.exchange, eventName, Buffer.from((0, _stringify2.default)(msg)), 'utf8');

      this.logger.log({
        level: 'debug',
        type: 'msgPublished',
        msg: msg,
        eventName: eventName,
        exchange: this.options.exchange
      });
    }
  }]);
  return MessageEmitterAmqp;
}(AbstractService);

module.exports = MessageEmitterAmqp;