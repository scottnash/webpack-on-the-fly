window.modules["1126"] = [function(require,module,exports){module.exports = function xor (a, b) {
  var len = a.length
  var i = -1
  while (++i < len) {
    a[i] ^= b[i]
  }
  return a
}
}, {}];
