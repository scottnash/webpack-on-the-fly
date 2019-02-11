window.modules["1185"] = [function(require,module,exports){/**
 * Ensure some object is a coerced to a string
 **/
module.exports = function makeString(object) {
  if (object == null) return '';
  return '' + object;
};
}, {}];
