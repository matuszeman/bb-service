const expect = require('chai').expect;
const sinon = require('sinon');
const {MessageSubscriber} = require('./index');

describe('MessageSubscriber', () => {
  beforeEach(function() {
    this.validConstructorOptions = {
      //requireAck: true
    };
    this.ins = new MessageSubscriber(this.validConstructorOptions);
    //this.ins.setLogger({
    //  log(entry) { console.log(entry) }
    //});
    this.subscriber = sinon.stub({
      next: () => {},
      error: (err) => {}
    })
  });

  describe('.subscribe', () => {
    it('receives msg', function() {
      const msg = {
        type: 'TYPE',
        data: {
        }
      };
      this.ins.subscribe(this.subscriber);

      this.ins.next(msg);

      sinon.assert.calledOnce(this.subscriber.next);
      sinon.assert.calledWith(this.subscriber.next, msg);
    });

    it('needs to process the msg before emitting another one', function() {
      const msg = {
        type: 'TYPE',
        data: {
        }
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
  })
});
