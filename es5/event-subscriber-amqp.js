'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Joi = require('joi');
var EventEmitter = require('events');

var EventSubscriberAmqp = function (_EventEmitter) {
  _inherits(EventSubscriberAmqp, _EventEmitter);

  function EventSubscriberAmqp(eventSubscriberAmqpOpts, amqpConnection) {
    _classCallCheck(this, EventSubscriberAmqp);

    var _this = _possibleConstructorReturn(this, (EventSubscriberAmqp.__proto__ || Object.getPrototypeOf(EventSubscriberAmqp)).call(this));

    _this.options = Joi.attempt(eventSubscriberAmqpOpts, {
      exchange: Joi.string().required(),
      queue: Joi.string().required(),
      prefetch: Joi.number().optional().default(1),
      topics: Joi.array().items(Joi.string()).unique().required()
    });

    _this.connection = amqpConnection;
    return _this;
  }

  _createClass(EventSubscriberAmqp, [{
    key: 'asyncInit',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        var ch, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, topic;

        return regeneratorRuntime.wrap(function _callee$(_context) {
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
                _iterator = this.options.topics[Symbol.iterator]();

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