window.modules["162"] = [function(require,module,exports){'use strict';

var _isNumber = require(159),
    _isDate = require(901);
/**
 * Always returns a date:
 * either the Date given or a new Date from timestamp or now
 * @param {Date|number} [date]
 * @returns {Date}
 */


function ensureDate(date) {
  if (_isNumber(date)) {
    date = new Date(date);
  } else if (!_isDate(date)) {
    date = new Date();
  }

  return date;
}
/**
 * Human readable day of week
 * @param {Date|number} [date]
 * @returns {string}
 */


function getDayOfWeek(date) {
  date = ensureDate(date);

  switch (date.getDay()) {
    case 0:
      return 'Sunday';

    case 1:
      return 'Monday';

    case 2:
      return 'Tuesday';

    case 3:
      return 'Wednesday';

    case 4:
      return 'Thursday';

    case 5:
      return 'Friday';

    case 6:
      return 'Saturday';

    default:
      return '';
  }
} // public methods.


module.exports.ensureDate = ensureDate;
module.exports.getDayOfWeek = getDayOfWeek;
}, {"159":159,"901":901}];
