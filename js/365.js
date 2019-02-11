window.modules["365"] = [function(require,module,exports){var exports = module.exports = function SHA (algorithm) {
  algorithm = algorithm.toLowerCase()

  var Algorithm = exports[algorithm]
  if (!Algorithm) throw new Error(algorithm + ' is not supported (we accept pull requests)')

  return new Algorithm()
}

exports.sha = require(1153)
exports.sha1 = require(1154)
exports.sha224 = require(1155)
exports.sha256 = require(1150)
exports.sha384 = require(1151)
exports.sha512 = require(1152)
}, {"1150":1150,"1151":1151,"1152":1152,"1153":1153,"1154":1154,"1155":1155}];
