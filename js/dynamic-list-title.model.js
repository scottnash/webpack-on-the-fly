window.modules["dynamic-list-title.model"] = [function(require,module,exports){'use strict';

var _require = require(109),
    hypensToSpaces = _require.hypensToSpaces,
    titleCase = _require.titleCase;

module.exports.render = function (ref, data, locals) {
  var param = locals && locals.params ? hypensToSpaces(locals.params[data.routeParam]) : '';
  data.title = data.dynamicTitle.replace('${routeParamValue}', titleCase(param));
  return data;
};
}, {"109":109}];
