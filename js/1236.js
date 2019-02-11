window.modules["1236"] = [function(require,module,exports){var makeString = require(1185);

module.exports = function strLeftBack(str, sep) {
  str = makeString(str);
  sep = makeString(sep);
  var pos = str.lastIndexOf(sep);
  return~ pos ? str.slice(0, pos) : str;
};
}, {"1185":1185}];
