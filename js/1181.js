window.modules["1181"] = [function(require,module,exports){var trim = require(1182);
var decap = require(1183);

module.exports = function camelize(str, decapitalize) {
  str = trim(str).replace(/[-_\s]+(.)?/g, function(match, c) {
    return c ? c.toUpperCase() : '';
  });

  if (decapitalize === true) {
    return decap(str);
  } else {
    return str;
  }
};
}, {"1182":1182,"1183":1183}];
