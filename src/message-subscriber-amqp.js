const Joi = require('joi');
const _ = require('lodash');
const Validator = require('./validator');
const MessageSubscriber = require('./message-subscriber');

/**
 * Message subscriber implementing AMQP (e.g. rabbitmq)
 */
class MessageSubscriberAmqp extends MessageSubscriber {
  /**
   *
   * @param {Object} messageSubscriberAmqpOpts
   * @param {String} messageSubscriberAmqpOpts.exchange
   * @param {String} messageSubscriberAmqpOpts.queue
   * @param {Array} messageSubscriberAmqpOpts.topics Message types to subscribe in format `SERVICE.MSG_TYPE` e.g. `MyService.*` subscribes to all MyService messages
   * @param {Number} [messageSubscriberAmqpOpts.prefetch=1]
   * @param {Object} amqpConnection {@link http://www.squaremobius.net/amqp.node/channel_api.html#connect}
   */
  constructor(messageSubscriberAmqpOpts, amqpConnection) {
    messageSubscriberAmqpOpts = Validator.options(messageSubscriberAmqpOpts, {
      exchange: Joi.string(),
      queue: Joi.string(),
      prefetch: Joi.number().optional().default(1),
      topics: Joi.array().items(Joi.string()).unique()
    }, false);

    super({
      requireAck: messageSubscriberAmqpOpts.requireAck,
      bufferSize: 1
    });

    _.defaults(this.options, messageSubscriberAmqpOpts);

    this.connection = amqpConnection;
  }

  /**
   * Calls {@link MessageSubscriberAmqp#connect} and start consuming messages {@link MessageSubscriberAmqp#consume}
   */
  async asyncInit() {
    await this.connect();
    this.consume();
  }

  /**
   * Creates a channel, asserts an exchange, queue, and bind a queue to topics
   */
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

  /**
   * Start consuming a messages from the queue
   */
  consume() {
    this.channel.consume(this.options.queue, (ret) => {
      //seems like message broker can send empty messages
      //it happened when purging/removing a queues?
      if (!ret) {
        return;
      }

      const str = ret.content.toString();
      const msg = JSON.parse(str);
      msg._deliveryTag = ret.fields.deliveryTag;
      this.logger.log({
        level: 'debug',
        type: 'amqpMessageReceived',
        msg: msg
      });
      this.next(msg);
    }, {
      noAck: !this.options.requireAck
    });
  }

  /**
   * Purge queue
   */
  async purgeQueue() {
    await this.channel.purgeQueue(this.options.queue);
  }

  /**
   * Delete queue
   */
  async deleteQueue() {
    //for (const topic of this.options.topics) {
    //  await this.channel.unbindQueue(this.queue.queue, this.options.exchange, topic);
    //}

    await this.channel.deleteQueue(this.options.queue, {
      //ifUnused: true
    });
  }

  drop(msg) {
    this.channel.reject(this._getAmqpMsg(msg), false);
    super.drop(msg);
  }

  ack(msg) {
    this.channel.ack(this._getAmqpMsg(msg));
    super.ack(msg);
  }

  nack(msg) {
    this.channel.nack(this._getAmqpMsg(msg));
    super.nack(msg);
  }

  _getAmqpMsg(msg) {
    return {
      fields: {
        deliveryTag: msg._deliveryTag
      }
    }
  }
}

module.exports = MessageSubscriberAmqp;
