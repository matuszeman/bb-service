const expect = require('chai').expect;
const sinon = require('sinon');
const sleep = require('sleep-promise');
const {MessagePublisher, MessageEmitterAmqp, MessageSubscriberAmqp, AmqpConnectionAsyncFactory} = require('./index');

describe('Examples: amqp', () => {
  before(async function() {
    const logger = {
      log(msg) {
        console.log(msg);//XXX
      }
    };

    const opts = {
      exchange: 'test',
    };

    this.amqpConnection = await AmqpConnectionAsyncFactory({
      url: 'amqp://localhost'
    });

    this.emitter = new MessageEmitterAmqp({
      exchange: opts.exchange
    }, this.amqpConnection);
    //this.emitter.setLogger(logger);
    await this.emitter.asyncInit();

    this.publisher = new MessagePublisher({
      service: 'MyService'
    }, this.emitter);

    this.publisher2 = new MessagePublisher({
      service: 'OtherService'
    }, this.emitter);

    //this.publisher.setLogger(logger);

    this.subscriber = new MessageSubscriberAmqp({
      exchange: opts.exchange,
      queue: 'test-subscriber',
      topics: ['MyService.*', 'OtherService.*']
    }, this.amqpConnection);
    //this.subscriber1.setLogger(logger);
    await this.subscriber.asyncInit();

    this.subscriber2 = new MessageSubscriberAmqp({
      exchange: opts.exchange,
      queue: 'test-subscriber2',
      topics: ['MyService.*']
    }, this.amqpConnection);
    //this.subscriber2.setLogger(logger);
    await this.subscriber2.asyncInit();
  });

  after(async function() {
    await this.subscriber.deleteQueue();
    await this.subscriber2.deleteQueue();
  });

  beforeEach(function() {
    this.publisher.emit({
      type: 'test',
      data: {
        val: '111'
      }
    });

    this.publisher.emit({
      type: 'test',
      data: {
        val: '222'
      }
    });

    this.publisher2.emit({
      type: 'test',
      data: {
        val: '333'
      }
    });
  });

  afterEach(async function() {
    await this.subscriber.purgeQueue();
    await this.subscriber2.purgeQueue();
  });

  describe('.subscribe', () => {
    it('receives msg', async function() {
      this.subscriber.subscribe(ret => {
        console.log('subscriber: Msg received', ret);//XXX
        this.subscriber.ack(ret);
      });

      this.subscriber2.subscribe(ret => {
        console.log('subscriber2: Msg received', ret);//XXX
        this.subscriber2.ack(ret);
      });

      await sleep(1000);
    });
  });
});
