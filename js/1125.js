window.modules["1125"] = [function(require,module,exports){var createHash = require(306)
var Buffer = require(275).Buffer

module.exports = function (seed, len) {
  var t = Buffer.alloc(0)
  var i = 0
  var c
  while (t.length < len) {
    c = i2ops(i++)
    t = Buffer.concat([t, createHash('sha1').update(seed).update(c).digest()])
  }
  return t.slice(0, len)
}

function i2ops (c) {
  var out = Buffer.allocUnsafe(4)
  out.writeUInt32BE(c, 0)
  return out
}
}, {"275":275,"306":306}];
