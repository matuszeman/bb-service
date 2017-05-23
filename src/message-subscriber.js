const Rx = require('rxjs/Rx');
const AbstractService = require('./abstract-service');
const Validator = require('./validator');
const Joi = require('joi');

/**
 * Message subscriber
 *
 * Implements the {@link MessageEmitter} interface
 */
class MessageSubscriber extends AbstractService {
  /**
   *
   * @param {Object} messageSubscriberOpts
   * @param {boolean} [messageSubscriberOpts.requireAck=true]
   * @param {Number} [messageSubscriberOpts.bufferSize=10]
   */
  constructor(messageSubscriberOpts) {
    super(messageSubscriberOpts, {
      requireAck: Joi.boolean().optional().default(true),
      bufferSize: Joi.number().optional().default(10)
    });

    this.inputStream = this.outputStream = new Rx.ReplaySubject(this.options.bufferSize);
    if (this.options.requireAck) {
      this.nextSignalling = new Rx.BehaviorSubject(true);
      this.outputStream = Rx.Observable.zip(this.inputStream, this.nextSignalling, (val) => val);
    }
  }

  /**
   * Drops the message
   *
   * @param {Message} msg
   */
  drop(msg) {
    if (this.nextSignalling) {
      this.nextSignalling.next(true);
    }

    this.logger.log({
      level: 'debug',
      type: 'msgDropped',
      msg: msg
    });
  }

  /**
   * Ack the message
   *
   * @param {Message} msg
   */
  ack(msg) {
    if (this.nextSignalling) {
      this.nextSignalling.next(true);
    }

    this.logger.log({
      level: 'debug',
      type: 'msgAcked',
      msg: msg
    });
  }

  /**
   * Nack the message
   *
   * @param {Message} msg
   */
  nack(msg) {
    //TODO push as first message, this adds the message to the end of the 'queue'
    //this.next(msg);

    if (this.nextSignalling) {
      this.nextSignalling.next(true);
    }

    this.logger.log({
      level: 'debug',
      type: 'msgNacked',
      msg: msg
    });
  }

  /**
   * Receives the message
   *
   * @param {Message} msg
   */
  next(msg) {
    this.logger.log({
      level: 'debug',
      type: 'msgReceived',
      msg: msg
    });

    this.inputStream.next(msg);
  }

  /**
   * Subscribe to {@link http://reactivex.io/rxjs/} message stream
   *
   * @param {Rx.Subscriber} subscriber {@link http://reactivex.io/rxjs/class/es6/Subscriber.js~Subscriber.html}
   * @returns {Rx.Subscription} msg {@link http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html}
   */
  subscribe() {
    return this.outputStream.subscribe.apply(this.outputStream, arguments);
  }
}

module.exports = MessageSubscriber;
