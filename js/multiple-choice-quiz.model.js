window.modules["multiple-choice-quiz.model"] = [function(require,module,exports){'use strict';

var _require = require(56),
    isComponent = _require.isComponent;

module.exports.render = function (uri, data, locals) {
  if (locals.url && !isComponent(locals.url)) {
    data.canonicalUrl = locals.url.replace('/amp', '').replace('.amp', '.html');
  }

  return data;
};
}, {"56":56}];
