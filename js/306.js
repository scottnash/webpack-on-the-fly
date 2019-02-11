window.modules["306"] = [function(require,module,exports){'use strict'
var inherits = require(259)
var MD5 = require(366)
var RIPEMD160 = require(367)
var sha = require(365)
var Base = require(277)

function Hash (hash) {
  Base.call(this, 'digest')

  this._hash = hash
}

inherits(Hash, Base)

Hash.prototype._update = function (data) {
  this._hash.update(data)
}

Hash.prototype._final = function () {
  return this._hash.digest()
}

module.exports = function createHash (alg) {
  alg = alg.toLowerCase()
  if (alg === 'md5') return new MD5()
  if (alg === 'rmd160' || alg === 'ripemd160') return new RIPEMD160()

  return new Hash(sha(alg))
}
}, {"259":259,"277":277,"365":365,"366":366,"367":367}];
