window.modules["154"] = [function(require,module,exports){'use strict';

var moment = require(190);
/**
 * Format date <10-07-2017> to <October 7>
 * or <10-07-2017 && 11-08-2017> to <October 7-November 8, 2017>
 *
 * @param {string} dateFrom - Beginning date.
 * @param {string} dateTo - Ending date.
 * @param {string} [format] - Format for parsing date // Full Month Name, Day number, Full Year.
 * @returns {string} formatted Date.
 *
 * Note (c.g. 2017-11-22): Since we're not passing the hour moment
 * is returning a day less so for avoiding this we need to set
 * the hours in this case 24.
 */


function formatDateRange() {
  var dateFrom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var dateTo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'MMMM D, YYYY';

  if (dateTo && dateFrom) {
    return "".concat(moment(new Date(dateFrom).setHours(24)).format('MMMM D'), "-").concat(moment(new Date(dateTo).setHours(24)).format(format));
  } else if (!dateTo && dateFrom) {
    return "".concat(moment(new Date(dateFrom).setHours(24)).format(format));
  } else {
    return '';
  }
}

function secondsToISO(seconds) {
  return moment.duration(seconds, 'seconds').toISOString();
}

module.exports.formatDateRange = formatDateRange;
module.exports.secondsToISO = secondsToISO;
}, {"190":190}];
