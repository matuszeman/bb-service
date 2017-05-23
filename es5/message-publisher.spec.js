'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = require('chai').expect;
var sinon = require('sinon');

var _require = require('./index'),
    MessagePublisher = _require.MessagePublisher;

describe('MessagePublisher', function () {
  beforeEach(function () {
    this.validConstructorOptions = {
      service: 'MyService'
    };
    this.emitterStub = sinon.stub({
      next: function next() {}
    });

    this.ins = new MessagePublisher(this.validConstructorOptions, this.emitterStub);
  });

  describe('.emit()', function () {
    [{
      invalid: 'msg'
    }, {
      type: 'msg',
      data: 'dd'
    }, {
      type: 'msg',
      data: {},
      ts: 'invalidts'
    }].forEach(function (msg) {
      it('throws error on invalid message format, msg: ' + (0, _stringify2.default)(msg), function () {
        var _this = this;

        expect(function () {
          _this.ins.emit(msg);
        }).throw(Error);
      });
    });

    it('sets ts and service to emitted message', function () {
      var msg = {
        type: 'msg',
        data: {}
      };

      this.ins.emit(msg);

      //calls messageEmitter
      //should add service into msg object
      var spy = this.emitterStub.next;
      var emittedMsg = spy.firstCall.args[0];
      expect(spy.calledOnce).true;
      expect(emittedMsg).property('service', this.validConstructorOptions.service);
      expect(emittedMsg).property('ts');
    });
  });
});