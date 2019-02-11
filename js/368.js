window.modules["368"] = [function(require,module,exports){var MD5 = require(366)

module.exports = function (buffer) {
  return new MD5().update(buffer).digest()
}
}, {"366":366}];
