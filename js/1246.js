window.modules["1246"] = [function(require,module,exports){var makeString = require(1185);
var defaultToWhiteSpace = require(1200);
var nativeTrimRight = String.prototype.trimRight;

module.exports = function rtrim(str, characters) {
  str = makeString(str);
  if (!characters && nativeTrimRight) return nativeTrimRight.call(str);
  characters = defaultToWhiteSpace(characters);
  return str.replace(new RegExp(characters + '+$'), '');
};
}, {"1185":1185,"1200":1200}];
