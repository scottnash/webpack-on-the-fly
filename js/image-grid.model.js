window.modules["image-grid.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);

module.exports.save = function (ref, data) {
  var caption = data.caption || '';
  data.caption = sanitize.validateTagContent(sanitize.toSmartText(caption));
  return data;
};
}, {"39":39}];
