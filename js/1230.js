window.modules["1230"] = [function(require,module,exports){var makeString = require(1185);

module.exports = function titleize(str) {
  return makeString(str).toLowerCase().replace(/(?:^|\s|-)\S/g, function(c) {
    return c.toUpperCase();
  });
};
}, {"1185":1185}];
