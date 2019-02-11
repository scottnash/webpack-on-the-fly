window.modules["152"] = [function(require,module,exports){'use strict';

var _findKey = require(206),
    FORMATTED_PRICE_SYMBOL = '$',
    PRICE_LEVEL = {
  'very expensive': 4,
  expensive: 3,
  moderate: 2,
  cheap: 1
},
    RATING_ADJECTIVES = {
  // If the number is 1 digit, it will match if it is within 1-9. If the
  // number is 2 digits, the first digit will match if it's 1-9 and the
  // second digit will match if it's 1-0.
  unfortunate: /^(1[0-9]|[1-9])$/,
  // 1-19
  'hard pass': /^([2-5][0-9])$/,
  // 20-59
  'not terrible': /^([6][0-9])$/,
  'totally fine': /^([7][0-4])$/,
  solid: /^([7][5-9])$/,
  good: /^([8][0-2])$/,
  'very good': /^([8][3-7])$/,
  impressive: /^([8][8-9])$/,
  excellent: /^([9][0-3])$/,
  'mind-blowing': /^([9][4-5])$/,
  'almost perfect': /^([9][6-9])$/,
  nirvana: /^(100)$/ // 100

};
/**
 * Formats price level
 *
 * @param {string} price - price level e.g. expensive, moderate
 * @param {string} symbol
 * @returns {string} symbol repeat it as many times as the price level specify
 */


function mapDollarSigns(price) {
  var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FORMATTED_PRICE_SYMBOL;
  var count = PRICE_LEVEL[price];
  return count ? symbol.repeat(count) : '';
}
/**
 * Sets the adjective that describes the numerical critic's rating
 *
 * @param {Integer} rating
 * @returns {string} rating adjective
 */


function setRatingAdjective(rating) {
  return _findKey(RATING_ADJECTIVES, function (re) {
    return re.test(rating);
  }) || '';
}

module.exports = {
  mapDollarSigns: mapDollarSigns,
  setRatingAdjective: setRatingAdjective
};
}, {"206":206}];
