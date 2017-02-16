'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Joi = require('joi');
var EventPublisher = require('./event-publisher');

var EventPublisherAmqp = function (_EventPublisher) {
  _inherits(EventPublisherAmqp, _EventPublisher);

  function EventPublisherAmqp(eventPublisherAmqpOpts, amqpConnection) {
    _classCallCheck(this, EventPublisherAmqp);

    var _this = _possibleConstructorReturn(this, (EventPublisherAmqp.__proto__ || Object.getPrototypeOf(EventPublisherAmqp)).call(this));

    _this.options = Joi.attempt(eventPublisherAmqpOpts, {
      exchange: Joi.string().required(),
      service: Joi.string().required()
    });

    _this.connection = amqpConnection;
    return _this;
  }

  _createClass(EventPublisherAmqp, [{
    key: 'asyncInit',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var ch;
        return regeneratorRuntime.wrap(function _callee$(_context) {
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
      this.channel.publish(this.options.exchange, eventName, Buffer.from(JSON.stringify(event)), 'utf8');
    }
  }]);

  return EventPublisherAmqp;
}(EventPublisher);

module.exports = EventPublisherAmqp;