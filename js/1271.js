window.modules["1271"] = [function(require,module,exports){'use strict';

var moment = require(190);

function getPrettyMonthAbrev(month) {
  switch (month) {
    case 'May':
      return month;
      break;

    case 'Jun':
      return 'June';
      break;

    case 'Jul':
      return 'July';
      break;

    case 'Sep':
      return 'Sept.';
      break;

    default:
      return month + '.';
      break;
  }
}

module.exports = function (date) {
  var mDate = moment(date),
      now = moment();

  if (!mDate.isValid(date)) {
    return '';
  }

  if (moment.duration(now.diff(mDate)).asDays() < 1) {
    return "".concat(mDate.format('h:mm'), " ").concat(mDate.format('A'));
  } else {
    return "".concat(getPrettyMonthAbrev(mDate.format('MMM')), " ").concat(mDate.format('D, YYYY'));
  }
};
}, {"190":190}];
