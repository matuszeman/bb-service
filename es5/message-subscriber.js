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

var Rx = require('rxjs/Rx');
var AbstractService = require('./abstract-service');
var Validator = require('./validator');
var Joi = require('joi');

/**
 * Message subscriber
 *
 * Implements the {@link MessageEmitter} interface
 */

var MessageSubscriber = function (_AbstractService) {
  (0, _inherits3.default)(MessageSubscriber, _AbstractService);

  /**
   *
   * @param {Object} messageSubscriberOpts
   * @param {boolean} [messageSubscriberOpts.requireAck=true]
   * @param {Number} [messageSubscriberOpts.bufferSize=10]
   */
  function MessageSubscriber(messageSubscriberOpts) {
    (0, _classCallCheck3.default)(this, MessageSubscriber);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MessageSubscriber.__proto__ || (0, _getPrototypeOf2.default)(MessageSubscriber)).call(this, messageSubscriberOpts, {
      requireAck: Joi.boolean().optional().default(true),
      bufferSize: Joi.number().optional().default(10)
    }));

    _this.inputStream = _this.outputStream = new Rx.ReplaySubject(_this.options.bufferSize);
    if (_this.options.requireAck) {
      _this.nextSignalling = new Rx.BehaviorSubject(true);
      _this.outputStream = Rx.Observable.zip(_this.inputStream, _this.nextSignalling, function (val) {
        return val;
      });
    }
    return _this;
  }

  /**
   * Drops the message
   *
   * @param {Message} msg
   */


  (0, _createClass3.default)(MessageSubscriber, [{
    key: 'drop',
    value: function drop(msg) {
      if (this.nextSignalling) {
        this.nextSignalling.next(true);
      }

      this.logger.log({
        level: 'debug',
        type: 'msgDropped',
        msg: msg
      });
    }

    /**
     * Ack the message
     *
     * @param {Message} msg
     */

  }, {
    key: 'ack',
    value: function ack(msg) {
      if (this.nextSignalling) {
        this.nextSignalling.next(true);
      }

      this.logger.log({
        level: 'debug',
        type: 'msgAcked',
        msg: msg
      });
    }

    /**
     * Nack the message
     *
     * @param {Message} msg
     */

  }, {
    key: 'nack',
    value: function nack(msg) {
      //TODO push as first message, this adds the message to the end of the 'queue'
      //this.next(msg);

      if (this.nextSignalling) {
        this.nextSignalling.next(true);
      }

      this.logger.log({
        level: 'debug',
        type: 'msgNacked',
        msg: msg
      });
    }

    /**
     * Receives the message
     *
     * @param {Message} msg
     */

  }, {
    key: 'next',
    value: function next(msg) {
      this.logger.log({
        level: 'debug',
        type: 'msgReceived',
        msg: msg
      });

      this.inputStream.next(msg);
    }

    /**
     * Subscribe to {@link http://reactivex.io/rxjs/} message stream
     *
     * @param {Rx.Subscriber} subscriber {@link http://reactivex.io/rxjs/class/es6/Subscriber.js~Subscriber.html}
     * @returns {Rx.Subscription} msg {@link http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html}
     */

  }, {
    key: 'subscribe',
    value: function subscribe() {
      return this.outputStream.subscribe.apply(this.outputStream, arguments);
    }
  }]);
  return MessageSubscriber;
}(AbstractService);

module.exports = MessageSubscriber;