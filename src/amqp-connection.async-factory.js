const amqplib = require('amqplib');
const Validator = require('./validator');
const Joi = require('joi');

module.exports = function(amqpConnectionOpts) {
  amqpConnectionOpts = Validator.options(amqpConnectionOpts, {
    url: Joi.string()
  });
  return amqplib.connect(amqpConnectionOpts.url);
};
