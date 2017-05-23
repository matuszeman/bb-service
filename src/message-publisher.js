const Joi = require('joi');
const AbstractService = require('./abstract-service');
const Validator = require('./validator');

/**
 * @typedef {Object} MessageEmitter
 * @property {Function} next Function which emits the message `function(message) {}`
 */

/**
 * @typedef {Object} Message
 * @property {string} type
 * @property {string} service
 * @property {string} ts ISO 8601 string
 * @property {Object} data
 */

/**
 * Message publisher
 */
class MessagePublisher extends AbstractService {
  /**
   *
   * @param {Object} messagePublisherOpts
   * @param {string} messagePublisherOpts.service
   * @param {MessageEmitter} messageEmitter
   */
  constructor(messagePublisherOpts, messageEmitter) {
    super(messagePublisherOpts, {
      service: Joi.string()
    });

    this.messageEmitter = Validator.api(messageEmitter, {
      next: Joi.func()
    }, 'messageEmitter');
  }

  validateMessage(msg) {
    msg = this.params(msg, {
      type: Joi.string(),
      data: Joi.object(),
      ts: Joi.string().isoDate().optional().default(new Date().toISOString())
    });
    msg.service = this.options.service;
    return msg;
  }

  /**
   * Emits the message
   *
   * @param {Object} msg
   * @param {String} msg.type Message type
   * @param {Object} msg.data The payload
   * @param {String} [msg.ts=now] ISO 8601 string
   */
  emit(msg) {
    this.messageEmitter.next(this.validateMessage(msg));

    this.logger.log({
      level: 'debug',
      type: 'messageEmitted',
      msg: msg
    });
  }
}

module.exports = MessagePublisher;
