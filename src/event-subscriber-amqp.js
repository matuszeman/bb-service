const Joi = require('joi');
const EventEmitter = require('events');

class EventSubscriberAmqp extends EventEmitter {
  constructor(eventSubscriberAmqpOpts, amqpConnection) {
    super();

    this.options = Joi.attempt(eventSubscriberAmqpOpts, {
      exchange: Joi.string().required(),
      queue: Joi.string().required(),
      prefetch: Joi.number().optional().default(1),
      topics: Joi.array().items(Joi.string()).unique().required()
    });

    this.connection = amqpConnection;
  }

  async asyncInit() {
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

    ch.consume(this.queue.queue, (msg) => {
      const str = msg.content.toString();
      const message = JSON.parse(str);

      this.emit('event', message, {
        ack: function() {
          ch.ack(msg);
        },
        nack: function() {
          ch.nack(msg);
        },
        drop: function() {
          ch.reject(msg, false);
        }
      });
    }, {
      noAck: false
    });
  }
}

module.exports = EventSubscriberAmqp;
