window.modules["1204"] = [function(require,module,exports){var capitalize = require(1184);
var underscored = require(1205);
var trim = require(1182);

module.exports = function humanize(str) {
  return capitalize(trim(underscored(str).replace(/_id$/, '').replace(/_/g, ' ')));
};
}, {"1182":1182,"1184":1184,"1205":1205}];
