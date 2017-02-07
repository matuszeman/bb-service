const Joi = require('joi');
const EventPublisher = require('./event-publisher');

class EventPublisherAmqp extends EventPublisher {
  constructor(eventPublisherAmqpOpts, amqpConnection) {
    super();

    this.options = Joi.attempt(eventPublisherAmqpOpts, {
      exchange: Joi.string().required(),
      service: Joi.string().required()
    });

    this.connection = amqpConnection;
  }

  async asyncInit() {
    const ch = await this.connection.createChannel();
    this.channel = ch;

    await ch.assertExchange(this.options.exchange, 'topic', {
      durable: true
    });
  }

  next(event) {
    event = Joi.attempt(event, {
      type: Joi.string(),
      data: Joi.object(),
      ts: Joi.string().optional().default(new Date().toISOString())
    });
    const eventName = this.options.service + '.' + event.type;
    event.service = this.options.service;
    this.channel.publish(this.options.exchange, eventName, Buffer.from(JSON.stringify(event)), 'utf8');
  }
}

module.exports = EventPublisherAmqp;
