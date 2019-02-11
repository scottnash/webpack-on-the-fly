window.modules["dynamic-meta-keywords.model"] = [function(require,module,exports){'use strict';

var _require = require(109),
    hypensToSpaces = _require.hypensToSpaces;

module.exports.render = function (ref, data, locals) {
  var param = locals && locals.params ? hypensToSpaces(locals.params[data.routeParam]) : '',
      variations = data.keywordVariations.map(function (variation) {
    return "".concat(param, " ").concat(variation.text);
  }),
      additionalKeywords = data.additionalKeywords.map(function (keyword) {
    return keyword.text;
  });
  data.keywords = variations.concat(param, additionalKeywords).join(', ');
  return data;
};
}, {"109":109}];
