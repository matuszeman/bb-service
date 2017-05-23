const expect = require('chai').expect;
const sinon = require('sinon');
const {MessagePublisher} = require('./index');

describe('MessagePublisher', () => {
  beforeEach(function() {
    this.validConstructorOptions = {
      service: 'MyService'
    };
    this.emitterStub = sinon.stub({
      next() {}
    });

    this.ins = new MessagePublisher(this.validConstructorOptions, this.emitterStub);
  });

  describe('.emit()', () => {
    [{
      invalid: 'msg'
    }, {
      type: 'msg',
      data: 'dd'
    }, {
      type: 'msg',
      data: {},
      ts: 'invalidts'
    }].forEach((msg) => {
      it('throws error on invalid message format, msg: ' + JSON.stringify(msg), function() {
        expect(() => {
          this.ins.emit(msg);
        }).throw(Error);
      });
    });

    it('sets ts and service to emitted message', function() {
      const msg = {
        type: 'msg',
        data: {
        }
      };

      this.ins.emit(msg);

      //calls messageEmitter
      //should add service into msg object
      const spy = this.emitterStub.next;
      const emittedMsg = spy.firstCall.args[0];
      expect(spy.calledOnce).true;
      expect(emittedMsg).property('service', this.validConstructorOptions.service);
      expect(emittedMsg).property('ts');
    });
  });
});
