window.modules["1199"] = [function(require,module,exports){var makeString = require(1185);

module.exports = function adjacent(str, direction) {
  str = makeString(str);
  if (str.length === 0) {
    return '';
  }
  return str.slice(0, -1) + String.fromCharCode(str.charCodeAt(str.length - 1) + direction);
};
}, {"1185":1185}];
