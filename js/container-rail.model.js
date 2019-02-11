window.modules["container-rail.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  var mainCount = data.main && data.main.length || 1; // Constrain rail width to whole integers within the page size (0 - 1180)

  if (data.railWidth) {
    data.railWidth = parseInt(data.railWidth, 10);

    if (isNaN(data.railWidth)) {
      delete data.railWidth;
    } else {
      data.railWidth = Math.min(Math.max(Math.round(data.railWidth), 0), 1180);
    }
  } // Constrain partial rail indices to a range from 1 to the number of components in main


  if (data.partialRail) {
    data.partialStartIndex = Math.min(Math.max(data.partialStartIndex, 1), mainCount);
    data.partialEndIndex = Math.max(Math.min(data.partialEndIndex, mainCount), data.partialStartIndex);
  } else {
    data.partialStartIndex = 1;
    data.partialEndIndex = 1;
  } // Compile styles


  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = '';
  }

  return data;
};
}, {"43":43,"44":44}];
