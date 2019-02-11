window.modules["share-video.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data, locals) {
  if (locals && locals.publishUrl) {
    data.url = locals.publishUrl;
  }

  return data;
};
}, {}];
