window.modules["1265"] = [function(require,module,exports){'use strict';

var parse = require(54),
    isValid = require(491),
    differenceInMinutes = require(487),
    distanceInWordsStrict = require(489),
    isSameDay = require(499),
    isFuture = require(82),
    format = require(52);
/**
 * generate display date (without time), based on a relative format
 * @param  {Date|string} datetime for `date-fns` to parse
 * @return {string}
 */


module.exports = function (datetime) {
  var date = parse(datetime),
      now = new Date(),
      // we want an abbreviated version of 'minute' and 'minutes'
  tokens = {
    lessThanXSeconds: {
      one: 'less than a second',
      other: 'less than {{count}} seconds'
    },
    xSeconds: {
      one: '1 second',
      other: '{{count}} seconds'
    },
    xMinutes: {
      one: '1 min',
      other: '{{count}} mins'
    }
  },
      locale = {
    distanceInWords: {
      localize: function localize(token, count) {
        var result;

        if (count === 1) {
          result = tokens[token].one;
        } else {
          result = tokens[token].other.replace('{{count}}', count);
        }

        return "".concat(result, " ago");
      }
    }
  };

  if (isValid(date) && !isFuture(date)) {
    // articles < 30 min old should display 'x seconds ago / x minutes ago'
    if (differenceInMinutes(now, date) < 1) {
      return distanceInWordsStrict(now, date, {
        unit: 's',
        addSuffix: true,
        locale: locale
      });
    } else if (differenceInMinutes(now, date) < 30) {
      return distanceInWordsStrict(now, date, {
        unit: 'm',
        addSuffix: true,
        locale: locale
      });
    } else if (isSameDay(now, date)) {
      return format(date, 'h:mm aa');
    } else {
      return format(date, 'M/D/YYYY');
    }
  } else {
    return '';
  }
};
}, {"52":52,"54":54,"82":82,"487":487,"489":489,"491":491,"499":499}];
