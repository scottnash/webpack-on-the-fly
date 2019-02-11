window.modules["content-feed.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data) {
  data.content = data.content || []; // data.content's component list should only contain as many components as the longest articleVariationsByContentLength array
  // If more, its okay just to drop them.

  data.content = data.content.slice(0, 6);
  return data;
};
}, {}];
