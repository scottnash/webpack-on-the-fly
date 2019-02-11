window.modules["1192"] = [function(require,module,exports){var trim = require(1182);

module.exports = function dasherize(str) {
  return trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
};
}, {"1182":1182}];
