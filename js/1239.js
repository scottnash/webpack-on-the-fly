window.modules["1239"] = [function(require,module,exports){var makeString = require(1185);

module.exports = function(str, callback) {
  str = makeString(str);

  if (str.length === 0 || typeof callback !== 'function') return str;

  return str.replace(/./g, callback);
};
}, {"1185":1185}];
