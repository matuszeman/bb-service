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
var EventPublisher = require('./event-publisher');

var EventPublisherAmqp = function (_EventPublisher) {
  (0, _inherits3.default)(EventPublisherAmqp, _EventPublisher);

  function EventPublisherAmqp(eventPublisherAmqpOpts, amqpConnection) {
    (0, _classCallCheck3.default)(this, EventPublisherAmqp);

    var _this = (0, _possibleConstructorReturn3.default)(this, (EventPublisherAmqp.__proto__ || (0, _getPrototypeOf2.default)(EventPublisherAmqp)).call(this));

    _this.options = Joi.attempt(eventPublisherAmqpOpts, {
      exchange: Joi.string().required(),
      service: Joi.string().required()
    });

    _this.connection = amqpConnection;
    return _this;
  }

  (0, _createClass3.default)(EventPublisherAmqp, [{
    key: 'asyncInit',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var ch;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.connection.createChannel();

              case 2:
                ch = _context.sent;

                this.channel = ch;

                _context.next = 6;
                return ch.assertExchange(this.options.exchange, 'topic', {
                  durable: true
                });

              case 6:
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
  }, {
    key: 'next',
    value: function next(event) {
      event = Joi.attempt(event, {
        type: Joi.string(),
        data: Joi.object(),
        ts: Joi.string().optional().default(new Date().toISOString())
      });
      var eventName = this.options.service + '.' + event.type;
      event.service = this.options.service;
      this.channel.publish(this.options.exchange, eventName, Buffer.from((0, _stringify2.default)(event)), 'utf8');
    }
  }]);
  return EventPublisherAmqp;
}(EventPublisher);

module.exports = EventPublisherAmqp;