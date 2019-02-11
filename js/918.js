window.modules["918"] = [function(require,module,exports){var crypto = self.crypto || self.msCrypto

module.exports = function (bytes) {
  return crypto.getRandomValues(new Uint8Array(bytes))
}
}, {}];
