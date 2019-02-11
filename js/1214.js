window.modules["1214"] = [function(require,module,exports){var chars = require(1186);

module.exports = function splice(str, i, howmany, substr) {
  var arr = chars(str);
  arr.splice(~~i, ~~howmany, substr);
  return arr.join('');
};
}, {"1186":1186}];
