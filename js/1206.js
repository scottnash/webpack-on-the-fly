window.modules["1206"] = [function(require,module,exports){var makeString = require(1185);

module.exports = function include(str, needle) {
  if (needle === '') return true;
  return makeString(str).indexOf(needle) !== -1;
};
}, {"1185":1185}];
