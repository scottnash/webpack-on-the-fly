window.modules["homepage-excerpt.model"] = [function(require,module,exports){'use strict';

var cuneiformCmpt = require(95);

module.exports.render = cuneiformCmpt.render;

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals);
  data.article = data.cuneiformResults ? data.cuneiformResults[0] : data.article;
  return data;
};
}, {"95":95}];
