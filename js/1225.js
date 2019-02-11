window.modules["1225"] = [function(require,module,exports){var makeString = require(1185);

module.exports = function swapCase(str) {
  return makeString(str).replace(/\S/g, function(c) {
    return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
  });
};
}, {"1185":1185}];
