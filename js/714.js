window.modules["714"] = [function(require,module,exports){var getNative = require(645);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;
}, {"645":645}];
