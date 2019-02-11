window.modules["1196"] = [function(require,module,exports){var makeString = require(1185);
var escapeChars = require(1197);

var regexString = '[';
for(var key in escapeChars) {
  regexString += key;
}
regexString += ']';

var regex = new RegExp( regexString, 'g');

module.exports = function escapeHTML(str) {

  return makeString(str).replace(regex, function(m) {
    return '&' + escapeChars[m] + ';';
  });
};
}, {"1185":1185,"1197":1197}];
