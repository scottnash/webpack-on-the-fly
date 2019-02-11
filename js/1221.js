window.modules["1221"] = [function(require,module,exports){var trim = require(1182);
var dasherize = require(1192);
var cleanDiacritics = require(1190);

module.exports = function slugify(str) {
  return trim(dasherize(cleanDiacritics(str).replace(/[^\w\s-]/g, '-').toLowerCase()), '-');
};
}, {"1182":1182,"1190":1190,"1192":1192}];
