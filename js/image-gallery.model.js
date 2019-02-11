window.modules["image-gallery.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (uri, data) {
  data.galleryLength = data.images ? data.images.length : 0;
  return data;
};
}, {}];
