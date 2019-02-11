window.modules["1223"] = [function(require,module,exports){var surround = require(1210);

module.exports = function quote(str, quoteChar) {
  return surround(str, quoteChar || '"');
};
}, {"1210":1210}];
