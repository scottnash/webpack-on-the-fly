window.modules["1233"] = [function(require,module,exports){var makeString = require(1185);

module.exports = function strRight(str, sep) {
  str = makeString(str);
  sep = makeString(sep);
  var pos = !sep ? -1 : str.indexOf(sep);
  return~ pos ? str.slice(pos + sep.length, str.length) : str;
};
}, {"1185":1185}];
