window.modules["603"] = [function(require,module,exports){var htmlToText = require(588);
var wordCount = require(604);

module.exports = function (body) {
  var text = htmlToText.fromString(body, {
    wordwrap: false,
    ignoreImage: true,
    ignoreHref: true
  });

  return wordCount(text);
};
}, {"588":588,"604":604}];
