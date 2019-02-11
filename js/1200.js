window.modules["1200"] = [function(require,module,exports){var escapeRegExp = require(1201);

module.exports = function defaultToWhiteSpace(characters) {
  if (characters == null)
    return '\\s';
  else if (characters.source)
    return characters.source;
  else
    return '[' + escapeRegExp(characters) + ']';
};
}, {"1201":1201}];
