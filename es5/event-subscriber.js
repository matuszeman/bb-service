'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Rx = require('rxjs/Rx');
var _ = require('lodash');

var EventSubscriber = function (_Rx$Subject) {
  (0, _inherits3.default)(EventSubscriber, _Rx$Subject);

  function EventSubscriber() {
    (0, _classCallCheck3.default)(this, EventSubscriber);
    return (0, _possibleConstructorReturn3.default)(this, (EventSubscriber.__proto__ || (0, _getPrototypeOf2.default)(EventSubscriber)).apply(this, arguments));
  }

  (0, _createClass3.default)(EventSubscriber, [{
    key: 'subscribeType',
    value: function subscribeType(types) {
      return _promise2.default.resolve(this.filter(function (event) {
        var received = event.type.split('.');
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(types), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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