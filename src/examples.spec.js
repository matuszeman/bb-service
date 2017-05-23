const expect = require('chai').expect;
const {MessagePublisher, MessageSubscriber} = require('./index');

describe('Examples', () => {
  beforeEach(function() {
    this.validConstructorOptions = {
      service: 'MyService'
    };
    this.subscriber = new MessageSubscriber();
    //subscriber acts as msg emitter too.
    this.publisher = new MessagePublisher(this.validConstructorOptions, this.subscriber);
  });

  it('subscribe before emitting', function() {
    this.publisher.emit({
      type: 'msgExample',
      data: {
        some: 'stuff'
      }
    });

    this.subscriber.subscribe(msg => {
      //console.log('sub', msg);//XXX
    });
  });

  it('ack message', function() {
    this.publisher.emit({
      type: 'msgExample',
      data: {
        some: 'stuff'
      }
    });

    this.subscriber.subscribe(msg => {
      this.subscriber.ack(msg);
    })
  });

  it('nack message', function() {
    this.publisher.emit({
      type: 'msgExample',
      data: {
        some: 'stuff'
      }
    });

    this.subscriber.subscribe(msg => {
      this.subscriber.nack(msg);
    })
  });

  it('drop message', function() {
    this.publisher.emit({
      type: 'msgExample',
      data: {
        some: 'stuff'
      }
    });

    this.subscriber.subscribe(msg => {
      this.subscriber.drop(msg);
    })
  });
});
