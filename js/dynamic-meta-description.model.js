window.modules["dynamic-meta-description.model"] = [function(require,module,exports){'use strict';

var _require = require(109),
    hypensToSpaces = _require.hypensToSpaces;

module.exports.render = function (ref, data, locals) {
  if (data.routeParam && locals && locals.params) {
    data.description = data.description.replace('${paramValue}', hypensToSpaces(locals.params[data.routeParam]));
  }

  return data;
};
}, {"109":109}];
