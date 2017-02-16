'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rx = require('rxjs/Rx');
var _ = require('lodash');

var EventSubscriber = function (_Rx$Subject) {
  _inherits(EventSubscriber, _Rx$Subject);

  function EventSubscriber() {
    _classCallCheck(this, EventSubscriber);

    return _possibleConstructorReturn(this, (EventSubscriber.__proto__ || Object.getPrototypeOf(EventSubscriber)).apply(this, arguments));
  }

  _createClass(EventSubscriber, [{
    key: 'subscribeType',
    value: function subscribeType(types) {
      return Promise.resolve(this.filter(function (event) {
        var received = event.type.split('.');
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = types[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var type = _step.value;

            var curr = _.map(type.split('.'), function (val, index) {
              if (val === '*') {
                return _.get(received, index);
              }
              return val;
            });
            if (_.isEqual(received, curr)) {
              return true;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return false;
      }));
    }
  }]);

  return EventSubscriber;
}(Rx.Subject);

module.exports = EventSubscriber;