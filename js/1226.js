window.modules["1226"] = [function(require,module,exports){var makeString = require(1185);
var slice = [].slice;

module.exports = function join() {
  var args = slice.call(arguments),
    separator = args.shift();

  return args.join(makeString(separator));
};
}, {"1185":1185}];
