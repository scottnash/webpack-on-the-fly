window.modules["1183"] = [function(require,module,exports){var makeString = require(1185);

module.exports = function decapitalize(str) {
  str = makeString(str);
  return str.charAt(0).toLowerCase() + str.slice(1);
};
}, {"1185":1185}];
