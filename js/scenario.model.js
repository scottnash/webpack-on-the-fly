window.modules["scenario.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (uri, data) {
  return normalizeMinMax(data);
};
/**
 * Modifies scenario model to accept pageviewCount min/max values
 * @param {object} data - scenario model
 * @returns {object} - scenario model
 */


function normalizeMinMax(data) {
  var min = 1,
      max = null;

  if (data.pageviewCountLogic === 'range') {
    min = data.pageviewCountMinimum;
    max = data.pageviewCountMaximum;
  } else if (data.pageviewCountLogic === 'minimum') {
    min = data.pageviewCountMinimum;
    max = null;
  }

  data.pageviewCount = {
    min: min,
    max: max
  };
  return data;
}
}, {}];
