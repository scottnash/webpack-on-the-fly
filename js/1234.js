window.modules["1234"] = [function(require,module,exports){var makeString = require(1185);

module.exports = function strRightBack(str, sep) {
  str = makeString(str);
  sep = makeString(sep);
  var pos = !sep ? -1 : str.lastIndexOf(sep);
  return~ pos ? str.slice(pos + sep.length, str.length) : str;
};
}, {"1185":1185}];
