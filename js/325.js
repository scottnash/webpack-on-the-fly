window.modules["325"] = [function(require,module,exports){'use strict';

var expirationYear = require(318);
var isArray = require(326);

function parseDate(value) {
  var month, len, year, yearValid;

  if (/\//.test(value)) {
    value = value.split(/\s*\/\s*/g);
  } else if (/\s/.test(value)) {
    value = value.split(/ +/g);
  }

  if (isArray(value)) {
    return {
      month: value[0],
      year: value.slice(1).join()
    };
  }

  len = value[0] === '0' || value.length > 5 ? 2 : 1;

  if (value[0] === '1') {
    year = value.substr(1);
    yearValid = expirationYear(year);
    if (!yearValid.isPotentiallyValid) {
      len = 2;
    }
  }

  month = value.substr(0, len);

  return {
    month: month,
    year: value.substr(month.length)
  };
}

module.exports = parseDate;
}, {"318":318,"326":326}];
