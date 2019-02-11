window.modules["371"] = [function(require,module,exports){exports.publicEncrypt = require(1124)
exports.privateDecrypt = require(1123)

exports.privateEncrypt = function privateEncrypt (key, buf) {
  return exports.publicEncrypt(key, buf, true)
}

exports.publicDecrypt = function publicDecrypt (key, buf) {
  return exports.privateDecrypt(key, buf, true)
}
}, {"1123":1123,"1124":1124}];
