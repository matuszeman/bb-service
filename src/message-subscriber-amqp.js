const Joi = require('joi');
const _ = require('lodash');
const Validator = require('./validator');
const MessageSubscriber = require('./message-subscriber');

class MessageSubscriberAmqp extends MessageSubscriber {
  constructor(messageSubscriberAmqpOpts, amqpConnection) {
    super(messageSubscriberAmqpOpts);

    _.merge(this.options, Validator.options(messageSubscriberAmqpOpts, {
      exchange: Joi.string().required(),
      queue: Joi.string().required(),
      prefetch: Joi.number().optional().default(1),
      topics: Joi.array().items(Joi.string()).unique().required()
    }));

    this.connection = amqpConnection;
  }

  /**
   * Calls {@link MessageSubscriberAmqp#connect} and start consuming messages {@link MessageSubscriberAmqp#consume}
   */
  async asyncInit() {
    await this.connect();
    this.consume();
  }

  async connect() {
    const ch = await this.connection.createChannel();
    this.channel = ch;

    ch.prefetch(this.options.prefetch);

    await ch.assertExchange(this.options.exchange, 'topic', {
      durable: true
    });

    this.queue = await ch.assertQueue(this.options.queue, {
      durable: true
    });

    for (const topic of this.options.topics) {
      await this.channel.bindQueue(this.queue.queue, this.options.exchange, topic);
    }
  }

  consume() {
    this.channel.consume(this.queue.queue, (msg) => {
      const str = msg.content.toString();
      this.next(JSON.parse(str));
    }, {
      noAck: !this.options.requireAck
    });
  }

  drop(msg) {
    this.channel.reject(msg, false);
    super.drop(msg);
  }

  ack(msg) {
    this.channel.ack(msg);
    super.ack(msg);
  }

  nack(msg) {
    this.channel.nack(msg);
    super.nack(msg);
  }
}

module.exports = MessageSubscriberAmqp;
