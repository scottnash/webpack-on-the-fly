window.modules["1244"] = [function(require,module,exports){var makeString = require(1185);
var defaultToWhiteSpace = require(1200);
var nativeTrimLeft = String.prototype.trimLeft;

module.exports = function ltrim(str, characters) {
  str = makeString(str);
  if (!characters && nativeTrimLeft) return nativeTrimLeft.call(str);
  characters = defaultToWhiteSpace(characters);
  return str.replace(new RegExp('^' + characters + '+'), '');
};
}, {"1185":1185,"1200":1200}];
