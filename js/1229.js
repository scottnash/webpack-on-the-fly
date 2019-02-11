window.modules["1229"] = [function(require,module,exports){var makeString = require(1185);
var toPositive = require(1195);

module.exports = function startsWith(str, starts, position) {
  str = makeString(str);
  starts = '' + starts;
  position = position == null ? 0 : Math.min(toPositive(position), str.length);
  return str.lastIndexOf(starts, position) === position;
};
}, {"1185":1185,"1195":1195}];
