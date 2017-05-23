'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Joi = require('joi');
var _ = require('lodash');
var Validator = require('./validator');
var MessageSubscriber = require('./message-subscriber');

/**
 * Message subscriber implementing AMQP (e.g. rabbitmq)
 */

var MessageSubscriberAmqp = function (_MessageSubscriber) {
  (0, _inherits3.default)(MessageSubscriberAmqp, _MessageSubscriber);

  /**
   *
   * @param {Object} messageSubscriberAmqpOpts
   * @param {String} messageSubscriberAmqpOpts.exchange
   * @param {String} messageSubscriberAmqpOpts.queue
   * @param {Array} messageSubscriberAmqpOpts.topics Message types to subscribe in format `SERVICE.MSG_TYPE` e.g. `MyService.*` subscribes to all MyService messages
   * @param {Number} [messageSubscriberAmqpOpts.prefetch=1]
   * @param {Object} amqpConnection {@link http://www.squaremobius.net/amqp.node/channel_api.html#connect}
   */
  function MessageSubscriberAmqp(messageSubscriberAmqpOpts, amqpConnection) {
    (0, _classCallCheck3.default)(this, MessageSubscriberAmqp);

    messageSubscriberAmqpOpts = Validator.options(messageSubscriberAmqpOpts, {
      exchange: Joi.string(),
      queue: Joi.string(),
      prefetch: Joi.number().optional().default(1),
      topics: Joi.array().items(Joi.string()).unique()
    }, false);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MessageSubscriberAmqp.__proto__ || (0, _getPrototypeOf2.default)(MessageSubscriberAmqp)).call(this, {
      requireAck: messageSubscriberAmqpOpts.requireAck,
      bufferSize: 1
    }));

    _.defaults(_this.options, messageSubscriberAmqpOpts);

    _this.connection = amqpConnection;
    return _this;
  }

  /**
   * Calls {@link MessageSubscriberAmqp#connect} and start consuming messages {@link MessageSubscriberAmqp#consume}
   */


  (0, _createClass3.default)(MessageSubscriberAmqp, [{
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
                this.consume();

              case 3:
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
     * Creates a channel, asserts an exchange, queue, and bind a queue to topics
     */

  }, {
    key: 'connect',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var ch, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, topic;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.connection.createChannel();

              case 2:
                ch = _context2.sent;

                this.channel = ch;

                ch.prefetch(this.options.prefetch);

                _context2.next = 7;
                return ch.assertExchange(this.options.exchange, 'topic', {
                  durable: true
                });

              case 7:
                _context2.next = 9;
                return ch.assertQueue(this.options.queue, {
                  durable: true
                });

              case 9:
                this.queue = _context2.sent;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 13;
                _iterator = (0, _getIterator3.default)(this.options.topics);

              case 15:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context2.next = 22;
                  break;
                }

                topic = _step.value;
                _context2.next = 19;
                return this.channel.bindQueue(this.queue.queue, this.options.exchange, topic);

              case 19:
                _iteratorNormalCompletion = true;
                _context2.next = 15;
                break;

              case 22:
                _context2.next = 28;
                break;

              case 24:
                _context2.prev = 24;
                _context2.t0 = _context2['catch'](13);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 28:
                _context2.prev = 28;
                _context2.prev = 29;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 31:
                _context2.prev = 31;

                if (!_didIteratorError) {
                  _context2.next = 34;
                  break;
                }

                throw _iteratorError;

              case 34:
                return _context2.finish(31);

              case 35:
                return _context2.finish(28);

              case 36:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[13, 24, 28, 36], [29,, 31, 35]]);
      }));

      function connect() {
        return _ref2.apply(this, arguments);
      }

      return connect;
    }()

    /**
     * Start consuming a messages from the queue
     */

  }, {
    key: 'consume',
    value: function consume() {
      var _this2 = this;

      this.channel.consume(this.options.queue, function (ret) {
        //seems like message broker can send empty messages
        //it happened when purging/removing a queues?
        if (!ret) {
          return;
        }

        var str = ret.content.toString();
        var msg = JSON.parse(str);
        msg._deliveryTag = ret.fields.deliveryTag;
        _this2.logger.log({
          level: 'debug',
          type: 'amqpMessageReceived',
          msg: msg
        });
        _this2.next(msg);
      }, {
        noAck: !this.options.requireAck
      });
    }

    /**
     * Purge queue
     */

  }, {
    key: 'purgeQueue',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.channel.purgeQueue(this.options.queue);

              case 2:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function purgeQueue() {
        return _ref3.apply(this, arguments);
      }

      return purgeQueue;
    }()

    /**
     * Delete queue
     */

  }, {
    key: 'deleteQueue',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.channel.deleteQueue(this.options.queue, {
                  //ifUnused: true
                });

              case 2:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function deleteQueue() {
        return _ref4.apply(this, arguments);
      }

      return deleteQueue;
    }()
  }, {
    key: 'drop',
    value: function drop(msg) {
      this.channel.reject(this._getAmqpMsg(msg), false);
      (0, _get3.default)(MessageSubscriberAmqp.prototype.__proto__ || (0, _getPrototypeOf2.default)(MessageSubscriberAmqp.prototype), 'drop', this).call(this, msg);
    }
  }, {
    key: 'ack',
    value: function ack(msg) {
      this.channel.ack(this._getAmqpMsg(msg));
      (0, _get3.default)(MessageSubscriberAmqp.prototype.__proto__ || (0, _getPrototypeOf2.default)(MessageSubscriberAmqp.prototype), 'ack', this).call(this, msg);
    }
  }, {
    key: 'nack',
    value: function nack(msg) {
      this.channel.nack(this._getAmqpMsg(msg));
      (0, _get3.default)(MessageSubscriberAmqp.prototype.__proto__ || (0, _getPrototypeOf2.default)(MessageSubscriberAmqp.prototype), 'nack', this).call(this, msg);
    }
  }, {
    key: '_getAmqpMsg',
    value: function _getAmqpMsg(msg) {
      return {
        fields: {
          deliveryTag: msg._deliveryTag
        }
      };
    }
  }]);
  return MessageSubscriberAmqp;
}(MessageSubscriber);

module.exports = MessageSubscriberAmqp;