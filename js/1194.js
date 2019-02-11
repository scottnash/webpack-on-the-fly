window.modules["1194"] = [function(require,module,exports){var makeString = require(1185);
var toPositive = require(1195);

module.exports = function endsWith(str, ends, position) {
  str = makeString(str);
  ends = '' + ends;
  if (typeof position == 'undefined') {
    position = str.length - ends.length;
  } else {
    position = Math.min(toPositive(position), str.length) - ends.length;
  }
  return position >= 0 && str.indexOf(ends, position) === position;
};
}, {"1185":1185,"1195":1195}];
