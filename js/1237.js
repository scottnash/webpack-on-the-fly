window.modules["1237"] = [function(require,module,exports){var makeString = require(1185);
var strRepeat = require(1203);

module.exports = function repeat(str, qty, separator) {
  str = makeString(str);

  qty = ~~qty;

  // using faster implementation if separator is not needed;
  if (separator == null) return strRepeat(str, qty);

  // this one is about 300x slower in Google Chrome
  /*eslint no-empty: 0*/
  for (var repeat = []; qty > 0; repeat[--qty] = str) {}
  return repeat.join(separator);
};
}, {"1185":1185,"1203":1203}];
