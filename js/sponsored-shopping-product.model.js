window.modules["sponsored-shopping-product.model"] = [function(require,module,exports){'use strict';

var _isString = require(164),
    _padEnd = require(193),
    _trimEnd = require(192);
/**
 * pad a number out to two decimal points
 * note: you must pass this a string, not a number
 * @param {string} price
 * @returns {string}
 */


function padPrice(price) {
  if (_isString(price)) {
    var priceParts = price.split('.');

    if (priceParts.length === 2) {
      priceParts[1] = _padEnd(_trimEnd(priceParts[1], '0'), 2, '0');
      return priceParts.join('.');
    }
  }

  return price;
}

function updateText(data) {
  data.priceLow = padPrice(data.priceLow);
  data.priceHigh = padPrice(data.priceHigh);
  return data;
}
/**
 * Things to do every time this component updates.
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  return updateText(data);
};
}, {"164":164,"192":192,"193":193}];
