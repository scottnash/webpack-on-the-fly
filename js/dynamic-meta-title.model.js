window.modules["dynamic-meta-title.model"] = [function(require,module,exports){'use strict';

var _startCase = require(111);

module.exports.render = function (ref, data, locals) {
  if (data.routeParam && locals && locals.params) {
    data.paramValue = _startCase(locals.params[data.routeParam]);
  }

  return data;
};
}, {"111":111}];
