window.modules["1182"] = [function(require,module,exports){var makeString = require(1185);
var defaultToWhiteSpace = require(1200);
var nativeTrim = String.prototype.trim;

module.exports = function trim(str, characters) {
  str = makeString(str);
  if (!characters && nativeTrim) return nativeTrim.call(str);
  characters = defaultToWhiteSpace(characters);
  return str.replace(new RegExp('^' + characters + '+|' + characters + '+$', 'g'), '');
};
}, {"1185":1185,"1200":1200}];
