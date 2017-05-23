'use strict';

var expect = require('chai').expect;

var _require = require('./index'),
    AbstractService = _require.AbstractService,
    Joi = _require.Joi;

describe('AbstractService', function () {
  beforeEach(function () {
    this.ins = new AbstractService();
  });

  describe('.constructor()', function () {
    it('accepts no options and sets this.options to empty object', function () {
      var ins = new AbstractService();
      expect(ins.options).empty;
    });

    it('accepts options and throws Joi validation error if invalid', function () {
      expect(function () {
        new AbstractService({
          opts: 1
        });
      }).throw(Error);
    });

    it('accepts options, Joi schema and sets validated this.options', function () {
      var opts = {
        some: 'option'
      };
      var ins = new AbstractService(opts, {
        some: Joi.string()
      });
      expect(ins.options).eql(opts);
    });
  });

  describe('.params()', function () {
    it('validates and returns params', function () {
      var params = {
        param1: 'val'
      };
      var par = this.ins.params(params, {
        param1: Joi.string()
      });
      expect(par).eql(params);
    });

    it('throws an error when required params are not provided', function () {
      var _this = this;

      var params = {
        optionalParam: 'val2'
      };
      expect(function () {
        _this.ins.params(params, {
          requiredParam: Joi.string(),
          optionalParam: Joi.string().optional()
        });
      }).throw(Error);
    });

    it('does not accepts other params in default strict mode', function () {
      var _this2 = this;

      var params = {
        requiredParam: 'val1',
        other: 'param'
      };
      expect(function () {
        _this2.ins.params(params, {
          requiredParam: Joi.string(),
          optionalParam: Joi.string().optional()
        });
      }).throw(Error);
    });

    it('accepts other params in non-strict mode', function () {
      var params = {
        requiredParam: 'val1',
        other: 'param'
      };
      var par = this.ins.params(params, {
        requiredParam: Joi.string(),
        optionalParam: Joi.string().optional()
      }, false);
      expect(par).eql(params);
    });
  });
});