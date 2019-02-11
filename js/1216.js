window.modules["1216"] = [function(require,module,exports){var isBlank = require(1228);
var trim = require(1182);

module.exports = function words(str, delimiter) {
  if (isBlank(str)) return [];
  return trim(str, delimiter).split(delimiter || /\s+/);
};
}, {"1182":1182,"1228":1228}];
