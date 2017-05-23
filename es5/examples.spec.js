'use strict';

var expect = require('chai').expect;

var _require = require('./index'),
    MessagePublisher = _require.MessagePublisher,
    MessageSubscriber = _require.MessageSubscriber;

describe('Examples', function () {
  beforeEach(function () {
    this.validConstructorOptions = {
      service: 'MyService'
    };
    this.subscriber = new MessageSubscriber();
    //subscriber acts as msg emitter too.
    this.publisher = new MessagePublisher(this.validConstructorOptions, this.subscriber);
  });

  it('subscribe before emitting', function () {
    this.publisher.emit({
      type: 'msgExample',
      data: {
        some: 'stuff'
      }
    });

    this.subscriber.subscribe(function (msg) {
      //console.log('sub', msg);//XXX
    });
  });

  it('ack message', function () {
    var _this = this;

    this.publisher.emit({
      type: 'msgExample',
      data: {
        some: 'stuff'
      }
    });

    this.subscriber.subscribe(function (msg) {
      _this.subscriber.ack(msg);
    });
  });

  it('nack message', function () {
    var _this2 = this;

    this.publisher.emit({
      type: 'msgExample',
      data: {
        some: 'stuff'
      }
    });

    this.subscriber.subscribe(function (msg) {
      _this2.subscriber.nack(msg);
    });
  });

  it('drop message', function () {
    var _this3 = this;

    this.publisher.emit({
      type: 'msgExample',
      data: {
        some: 'stuff'
      }
    });

    this.subscriber.subscribe(function (msg) {
      _this3.subscriber.drop(msg);
    });
  });
});