'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Rx = require('rxjs/Rx');

var EventPublisher = function (_Rx$Subject) {
  (0, _inherits3.default)(EventPublisher, _Rx$Subject);

  function EventPublisher() {
    (0, _classCallCheck3.default)(this, EventPublisher);
    return (0, _possibleConstructorReturn3.default)(this, (EventPublisher.__proto__ || (0, _getPrototypeOf2.default)(EventPublisher)).apply(this, arguments));
  }

  return EventPublisher;
}(Rx.Subject);

module.exports = EventPublisher;