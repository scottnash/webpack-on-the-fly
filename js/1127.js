window.modules["1127"] = [function(require,module,exports){var BN = require(252)
var Buffer = require(275).Buffer

function withPublic (paddedMsg, key) {
  return Buffer.from(paddedMsg
    .toRed(BN.mont(key.modulus))
    .redPow(new BN(key.publicExponent))
    .fromRed()
    .toArray())
}

module.exports = withPublic
}, {"252":252,"275":275}];
