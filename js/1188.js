window.modules["1188"] = [function(require,module,exports){var capitalize = require(1184);
var camelize = require(1181);
var makeString = require(1185);

module.exports = function classify(str) {
  str = makeString(str);
  return capitalize(camelize(str.replace(/[\W_]/g, ' ')).replace(/\s/g, ''));
};
}, {"1181":1181,"1184":1184,"1185":1185}];
