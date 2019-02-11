window.modules["homepage-text-promo.model"] = [function(require,module,exports){'use strict';

var cuneiformCmpt = require(95);

module.exports.save = cuneiformCmpt.save;

module.exports.render = function (ref, data, locals) {
  cuneiformCmpt.render(ref, data, locals);
  data.article = data.cuneiformResults ? data.cuneiformResults[0] : data.article;
  return data;
};
}, {"95":95}];
