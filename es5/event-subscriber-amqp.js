'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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
var EventEmitter = require('events');

var EventSubscriberAmqp = function (_EventEmitter) {
  (0, _inherits3.default)(EventSubscriberAmqp, _EventEmitter);

  function EventSubscriberAmqp(eventSubscriberAmqpOpts, amqpConnection) {
    (0, _classCallCheck3.default)(this, EventSubscriberAmqp);

    var _this = (0, _possibleConstructorReturn3.default)(this, (EventSubscriberAmqp.__proto__ || (0, _getPrototypeOf2.default)(EventSubscriberAmqp)).call(this));

    _this.options = Joi.attempt(eventSubscriberAmqpOpts, {
      exchange: Joi.string().required(),
      queue: Joi.string().required(),
      prefetch: Joi.number().optional().default(1),
      topics: Joi.array().items(Joi.string()).unique().required()
    });

    _this.connection = amqpConnection;
    return _this;
  }

  (0, _createClass3.default)(EventSubscriberAmqp, [{
    key: 'asyncInit',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var _this2 = this;

        var ch, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, topic;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.connection.createChannel();

              case 2:
                ch = _context.sent;

                this.channel = ch;

                ch.prefetch(this.options.prefetch);

                _context.next = 7;
                return ch.assertExchange(this.options.exchange, 'topic', {
                  durable: true
                });

              case 7:
                _context.next = 9;
                return ch.assertQueue(this.options.queue, {
                  durable: true
                });

              case 9:
                this.queue = _context.sent;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 13;
                _iterator = (0, _getIterator3.default)(this.options.topics);

              case 15:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 22;
                  break;
                }

                topic = _step.value;
                _context.next = 19;
                return this.channel.bindQueue(this.queue.queue, this.options.exchange, topic);

              case 19:
                _iteratorNormalCompletion = true;
                _context.next = 15;
                break;

              case 22:
                _context.next = 28;
                break;

              case 24:
                _context.prev = 24;
                _context.t0 = _context['catch'](13);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 28:
                _context.prev = 28;
                _context.prev = 29;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 31:
                _context.prev = 31;

                if (!_didIteratorError) {
                  _context.next = 34;
                  break;
                }

                throw _iteratorError;

              case 34:
                return _context.finish(31);

              case 35:
                return _context.finish(28);

              case 36:

                ch.consume(this.queue.queue, function (msg) {
                  var str = msg.content.toString();
                  var message = JSON.parse(str);

                  _this2.emit('event', message, {
                    ack: function ack() {
                      ch.ack(msg);
                    },
                    nack: function nack() {
                      ch.nack(msg);
                    },
                    drop: function drop() {
                      ch.reject(msg, false);
                    }
                  });
                }, {
                  noAck: false
                });

              case 37:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[13, 24, 28, 36], [29,, 31, 35]]);
      }));

      function asyncInit() {
        return _ref.apply(this, arguments);
      }

      return asyncInit;
    }()
  }]);
  return EventSubscriberAmqp;
}(EventEmitter);

module.exports = EventSubscriberAmqp;