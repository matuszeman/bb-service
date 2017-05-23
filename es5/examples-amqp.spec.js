'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = require('chai').expect;
var sinon = require('sinon');
var sleep = require('sleep-promise');

var _require = require('./index'),
    MessagePublisher = _require.MessagePublisher,
    MessageEmitterAmqp = _require.MessageEmitterAmqp,
    MessageSubscriberAmqp = _require.MessageSubscriberAmqp,
    AmqpConnectionAsyncFactory = _require.AmqpConnectionAsyncFactory;

describe('Examples: amqp', function () {
  before((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var logger, opts;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            logger = {
              log: function log(msg) {
                console.log(msg); //XXX
              }
            };
            opts = {
              exchange: 'test'
            };
            _context.next = 4;
            return AmqpConnectionAsyncFactory({
              url: 'amqp://localhost'
            });

          case 4:
            this.amqpConnection = _context.sent;


            this.emitter = new MessageEmitterAmqp({
              exchange: opts.exchange
            }, this.amqpConnection);
            //this.emitter.setLogger(logger);
            _context.next = 8;
            return this.emitter.asyncInit();

          case 8:

            this.publisher = new MessagePublisher({
              service: 'MyService'
            }, this.emitter);

            this.publisher2 = new MessagePublisher({
              service: 'OtherService'
            }, this.emitter);

            //this.publisher.setLogger(logger);

            this.subscriber = new MessageSubscriberAmqp({
              exchange: opts.exchange,
              queue: 'test-subscriber',
              topics: ['MyService.*', 'OtherService.*']
            }, this.amqpConnection);
            //this.subscriber1.setLogger(logger);
            _context.next = 13;
            return this.subscriber.asyncInit();

          case 13:

            this.subscriber2 = new MessageSubscriberAmqp({
              exchange: opts.exchange,
              queue: 'test-subscriber2',
              topics: ['MyService.*']
            }, this.amqpConnection);
            //this.subscriber2.setLogger(logger);
            _context.next = 16;
            return this.subscriber2.asyncInit();

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  })));

  after((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return this.subscriber.deleteQueue();

          case 2:
            _context2.next = 4;
            return this.subscriber2.deleteQueue();

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));

  beforeEach(function () {
    this.publisher.emit({
      type: 'test',
      data: {
        val: '111'
      }
    });

    this.publisher.emit({
      type: 'test',
      data: {
        val: '222'
      }
    });

    this.publisher2.emit({
      type: 'test',
      data: {
        val: '333'
      }
    });
  });

  afterEach((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return this.subscriber.purgeQueue();

          case 2:
            _context3.next = 4;
            return this.subscriber2.purgeQueue();

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  })));

  describe('.subscribe', function () {
    it('receives msg', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
      var _this = this;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              this.subscriber.subscribe(function (ret) {
                console.log('subscriber: Msg received', ret); //XXX
                _this.subscriber.ack(ret);
              });

              this.subscriber2.subscribe(function (ret) {
                console.log('subscriber2: Msg received', ret); //XXX
                _this.subscriber2.ack(ret);
              });

              _context4.next = 4;
              return sleep(1000);

            case 4:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    })));
  });
});