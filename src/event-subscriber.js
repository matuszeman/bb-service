const Rx = require('rxjs/Rx');
const _ = require('lodash');

class EventSubscriber extends Rx.Subject {
  subscribeType(types) {
    return Promise.resolve(this.filter(event => {
      const received = event.type.split('.');
      for(const type of types) {
        const curr = _.map(type.split('.'), (val, index) => {
          if (val === '*') {
            return _.get(received, index);
          }
          return val;
        });
        if (_.isEqual(received, curr)) {
          return true;
        }
      }
      return false;
    }));
  }
}

module.exports = EventSubscriber;
