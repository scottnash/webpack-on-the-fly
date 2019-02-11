window.modules["1184"] = [function(require,module,exports){var makeString = require(1185);

module.exports = function capitalize(str, lowercaseRest) {
  str = makeString(str);
  var remainingChars = !lowercaseRest ? str.slice(1) : str.slice(1).toLowerCase();

  return str.charAt(0).toUpperCase() + remainingChars;
};
}, {"1185":1185}];
