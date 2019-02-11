window.modules["1241"] = [function(require,module,exports){var makeString = require(1185);

module.exports = function stripTags(str) {
  return makeString(str).replace(/<\/?[^>]+>/g, '');
};
}, {"1185":1185}];
