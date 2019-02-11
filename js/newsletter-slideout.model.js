window.modules["newsletter-slideout.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (uri, data) {
  if (!!data.source && !data.source.includes('slideout')) {
    data.source = data.source + ' slideout';
  }

  return data;
};
}, {}];
