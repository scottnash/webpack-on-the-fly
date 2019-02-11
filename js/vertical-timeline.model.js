window.modules["vertical-timeline.model"] = [function(require,module,exports){'use strict';

var _sortBy = require(102),
    _pick = require(174),
    utils = require(43),
    rest = require(5);
/**
 * combine the left and right component lists and sort the child objects by year, ascending
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


function render(ref, data, locals) {
  var allItems = data.left.concat(data.right);
  return Promise.all(allItems.map(function (item) {
    return rest.get(utils.uriToUrl(item._ref, locals)).then(function (retreivedData) {
      retreivedData._ref = item._ref;
      return retreivedData;
    });
  })).then(function (retreivedItems) {
    var sortedItems = _sortBy(retreivedItems, 'year');

    data.combinedItems = sortedItems.map(function (sortedItem) {
      return _pick(sortedItem, '_ref');
    });
    return data;
  });
}

module.exports.render = render; // TODO: convert to module.exports.save
}, {"5":5,"43":43,"102":102,"174":174}];
