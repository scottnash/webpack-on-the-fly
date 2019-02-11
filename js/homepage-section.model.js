window.modules["homepage-section.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data) {
  if (data.tabletOrder && typeof data.tabletOrder === 'string') {
    data.tabletOrder = data.tabletOrder.split(',').map(function (value) {
      return parseInt(value.trim());
    });
  }

  if (data.desktopOrder && typeof data.desktopOrder === 'string') {
    data.desktopOrder = data.desktopOrder.split(',').map(function (value) {
      return parseInt(value.trim());
    });
  }

  return data;
};
}, {}];
