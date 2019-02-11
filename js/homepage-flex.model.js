window.modules["homepage-flex.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data) {
  if (data.tabletOrder && typeof data.tabletOrder === 'string') {
    data.tabletOrder = data.tabletOrder.split(',').map(function (value) {
      return parseInt(value.trim(), 10);
    });

    if (data.tabletOrder.some(isNaN)) {
      throw new Error('Invalid value in homepage-flex for tabletOrder');
    }
  }

  if (data.desktopOrder && typeof data.desktopOrder === 'string') {
    data.desktopOrder = data.desktopOrder.split(',').map(function (value) {
      return parseInt(value.trim(), 10);
    });

    if (data.desktopOrder.some(isNaN)) {
      throw new Error('Invalid value in homepage-flex for desktopOrder');
    }
  }

  return data;
};
}, {}];
