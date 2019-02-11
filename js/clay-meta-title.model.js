window.modules["clay-meta-title.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (ref, data) {
  data = sanitize.recursivelyStripSeperators(data);

  if (!data.kilnTitle) {
    data.kilnTitle = data.ogTitle;
  } else if (!data.ogTitle && !data.title && data.kilnTitle) {
    // If the pagelist has title, but metatag is empty
    data.ogTitle = data.kilnTitle;
    data.title = data.kilnTitle;
  }

  return data;
};
}, {"39":39}];
