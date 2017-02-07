module.exports = {
  AbstractService: require('./src/abstract-service'),
  EventPublisher: require('./src/event-publisher'),
  EventPublisherAmqp: require('./src/event-publisher-amqp'),
  EventSubscriber: require('./src/event-subscriber'),
  EventSubscriberAmqp: require('./src/event-subscriber-amqp'),
  Joi: require('joi')
};
