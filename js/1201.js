window.modules["1201"] = [function(require,module,exports){var makeString = require(1185);

module.exports = function escapeRegExp(str) {
  return makeString(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};
}, {"1185":1185}];
