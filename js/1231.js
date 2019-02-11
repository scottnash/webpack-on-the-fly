window.modules["1231"] = [function(require,module,exports){var makeString = require(1185);

module.exports = function truncate(str, length, truncateStr) {
  str = makeString(str);
  truncateStr = truncateStr || '...';
  length = ~~length;
  return str.length > length ? str.slice(0, length) + truncateStr : str;
};
}, {"1185":1185}];
