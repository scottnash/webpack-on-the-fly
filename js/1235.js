window.modules["1235"] = [function(require,module,exports){var makeString = require(1185);

module.exports = function strLeft(str, sep) {
  str = makeString(str);
  sep = makeString(sep);
  var pos = !sep ? -1 : str.indexOf(sep);
  return~ pos ? str.slice(0, pos) : str;
};
}, {"1185":1185}];
