const expect = require('chai').expect;
const {AbstractService, Joi} = require('./index');

describe('AbstractService', () => {
  beforeEach(function() {
    this.ins = new AbstractService();
  });

  describe('.constructor()', () => {
    it('accepts no options and sets this.options to empty object', function() {
      const ins = new AbstractService();
      expect(ins.options).empty;
    });

    it('accepts options and throws Joi validation error if invalid', function() {
      expect(() => {
        new AbstractService({
          opts: 1
        });
      }).throw(Error);
    });

    it('accepts options, Joi schema and sets validated this.options', function() {
      const opts = {
        some: 'option'
      };
      const ins = new AbstractService(opts, {
        some: Joi.string()
      });
      expect(ins.options).eql(opts);
    });
  });

  describe('.params()', () => {
    it('validates and returns params', function() {
      const params = {
        param1: 'val'
      };
      const par = this.ins.params(params, {
        param1: Joi.string()
      });
      expect(par).eql(params);
    });

    it('throws an error when required params are not provided', function() {
      const params = {
        optionalParam: 'val2'
      };
      expect(() => {
        this.ins.params(params, {
          requiredParam: Joi.string(),
          optionalParam: Joi.string().optional()
        });
      }).throw(Error);
    });

    it('does not accepts other params in default strict mode', function() {
      const params = {
        requiredParam: 'val1',
        other: 'param'
      };
      expect(() => {
        this.ins.params(params, {
          requiredParam: Joi.string(),
          optionalParam: Joi.string().optional()
        });
      }).throw(Error);
    });

    it('accepts other params in non-strict mode', function() {
      const params = {
        requiredParam: 'val1',
        other: 'param'
      };
      const par = this.ins.params(params, {
        requiredParam: Joi.string(),
        optionalParam: Joi.string().optional()
      }, false);
      expect(par).eql(params);
    });
  });
});
