const Joi = require('joi');
const AbstractService = require('./abstract-service');

/**
 * AMQP message emitter
 *
 * Implements {@link MessageEmitter} interface.
 */
class MessageEmitterAmqp extends AbstractService {
  /**
   *
   * @param {Object} messageEmitterAmqpOpts
   * @param {String} messageEmitterAmqpOpts.exchange
   * @param {Object} amqpConnection
   */
  constructor(messageEmitterAmqpOpts, amqpConnection) {
    super(messageEmitterAmqpOpts, {
      exchange: Joi.string()
    });

    this.connection = amqpConnection;
  }

  /**
   * Calls {@link MessageEmitterAmqp#connect}
   */
  async asyncInit() {
    await this.connect();
  }

  /**
   * Creates a channel and an exchange
   */
  async connect() {
    const ch = this.channel = await this.connection.createChannel();
    await ch.assertExchange(this.options.exchange, 'topic', {
      durable: true
    });
  }

  /**
   * Impl of interface {@link MessageEmitter}
   *
   * @param {Message} msg
   */
  next(msg) {
    const eventName = msg.service + '.' + msg.type;
    this.channel.publish(this.options.exchange, eventName, Buffer.from(JSON.stringify(msg)), 'utf8');

    this.logger.log({
      level: 'debug',
      type: 'msgPublished',
      msg: msg,
      eventName: eventName,
      exchange: this.options.exchange
    });
  }
}

module.exports = MessageEmitterAmqp;
