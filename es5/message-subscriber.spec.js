'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var _require = require('./index'),
    MessageSubscriber = _require.MessageSubscriber;

describe('MessageSubscriber', function () {
  beforeEach(function () {
    this.validConstructorOptions = {
      //requireAck: true
    };
    this.ins = new MessageSubscriber(this.validConstructorOptions);
    //this.ins.setLogger({
    //  log(entry) { console.log(entry) }
    //});
    this.subscriber = sinon.stub({
      next: function next() {},
      error: function error(err) {}
    });
  });

  describe('.subscribe', function () {
    it('receives msg', function () {
      var msg = {
        type: 'TYPE',
        data: {}
      };
      this.ins.subscribe(this.subscriber);

      this.ins.next(msg);

      sinon.assert.calledOnce(this.subscriber.next);
      sinon.assert.calledWith(this.subscriber.next, msg);
    });

    it('needs to process the msg before emitting another one', function () {
      var msg = {
        type: 'TYPE',
        data: {}
      };
      this.ins.subscribe(this.subscriber);

      this.ins.next(msg);
      this.ins.next(msg);
      this.ins.next(msg);
      this.ins.next(msg);

      sinon.assert.callCount(this.subscriber.next, 1);
      sinon.assert.calledWith(this.subscriber.next, msg);

      this.ins.ack(msg);

      sinon.assert.callCount(this.subscriber.next, 2);
      sinon.assert.calledWith(this.subscriber.next, msg);

      this.ins.nack(msg);

      sinon.assert.callCount(this.subscriber.next, 3);
      sinon.assert.calledWith(this.subscriber.next, msg);

      this.ins.drop(msg);

      sinon.assert.callCount(this.subscriber.next, 4);
      sinon.assert.calledWith(this.subscriber.next, msg);
    });
  });
});