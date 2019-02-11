window.modules["listing-media-slideshow.model"] = [function(require,module,exports){'use strict';

var slideshow = require(147);

module.exports.save = function (ref, data, locals) {
  return slideshow.addSlideshowLink(locals)(data);
};
}, {"147":147}];
