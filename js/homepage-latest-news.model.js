window.modules["homepage-latest-news.model"] = [function(require,module,exports){'use strict';

var cuneiformCmpt = require(95);

module.exports.render = cuneiformCmpt.render;

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals);
  data.articles = (data.cuneiformResults ? data.cuneiformResults : data.articles) || [];
  data.callouts = data.articles.map(cuneiformCmpt.getCallout);
  return data;
};
}, {"95":95}];
