'use strict';

var amqplib = require('amqplib');
var Validator = require('./validator');
var Joi = require('joi');

module.exports = function (amqpConnectionOpts) {
  amqpConnectionOpts = Validator.options(amqpConnectionOpts, {
    url: Joi.string()
  });
  return amqplib.connect(amqpConnectionOpts.url);
};