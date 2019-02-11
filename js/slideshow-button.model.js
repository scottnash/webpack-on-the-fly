window.modules["slideshow-button.model"] = [function(require,module,exports){'use strict';

var slideshow = require(147);

module.exports.save = function (ref, data, locals) {
  if (data.slideshowLocation === 'CQ') {
    return slideshow.addSlideshowLink(locals)(data);
  }

  return data;
};
}, {"147":147}];
