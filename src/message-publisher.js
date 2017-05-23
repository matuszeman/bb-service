const Joi = require('joi');
const Validator = require('./validator');

/**
 * @typedef {Object} MessageEmitter
 * @property {Function} next Function which emits the message `function(message) {}`
 */

/**
 * Message publisher
 */
class MessagePublisher {
  /**
   *
   * @param {Object} messagePublisherOpts
   * @param {string} messagePublisherOpts.service
   * @param {MessageEmitter} messageEmitter
   */
  constructor(messagePublisherOpts, messageEmitter) {
    this.options = Validator.options(messagePublisherOpts, {
      service: Joi.string()
    });

    this.messageEmitter = Validator.api(messageEmitter, {
      next: Joi.func()
    }, 'messageEmitter');
  }

  validateMessage(msg) {
    /**
     * @typedef {Object} Message
     * @property {string} type
     * @property {string} service
     * @property {string} ts ISO 8601 string
     * @property {Object} [data]
     */
    msg = Validator.params(msg, {
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
   * @param {string} msg.type Message type
   * @param {Object} msg.data The payload
   */
  emit(msg) {
    this.messageEmitter.next(this.validateMessage(msg));
  }
}

module.exports = MessagePublisher;
