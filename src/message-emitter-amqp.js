const Joi = require('joi');
const AbstractService = require('./abstract-service');

class MessageEmitterAmqp extends AbstractService {
  constructor(messageEmitterAmqpOpts, amqpConnection) {
    super(messageEmitterAmqpOpts, {
      exchange: Joi.string()
    });

    this.connection = amqpConnection;
  }

  async asyncInit() {
    const ch = this.channel = await this.connection.createChannel();
    await ch.assertExchange(this.options.exchange, 'topic', {
      durable: true
    });
  }

  next(msg) {
    const eventName = msg.service + '.' + msg.type;
    this.channel.publish(this.options.exchange, eventName, Buffer.from(JSON.stringify(msg)), 'utf8');
  }
}

module.exports = EventPublisherAmqp;
