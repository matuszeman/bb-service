'use strict';

module.exports = {
  AbstractService: require('./abstract-service'),
  MessagePublisher: require('./message-publisher'),
  MessageSubscriber: require('./message-subscriber'),
  Validator: require('./validator'),
  //EventPublisherAmqp: require('./event-publisher-amqp'),
  //EventSubscriberAmqp: require('./event-subscriber-amqp'),
  Joi: require('joi')
};