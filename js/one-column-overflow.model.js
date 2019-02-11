window.modules["one-column-overflow.model"] = [function(require,module,exports){'use strict';
/**
 * update one-column-overflow
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */

module.exports.save = function (ref, data) {
  if (data.widthSpecifics) {
    data.width = data.widthSpecifics;
    data.widthSpecifics = null;
  }

  return data;
};
}, {}];
