window.modules["120"] = [function(require,module,exports){'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var dateFormat = require(52),
    _pickBy = require(59),
    _compact = require(165),
    _capitalize = require(145);
/**
 *
 * @param {object} data
 * @param {string} prop
 */


function arrayToString(data, prop) {
  if (Array.isArray(data[prop])) {
    data[prop] = data[prop].map(function (item) {
      return _typeof(item) === 'object' ? item.text : item;
    }).join(', ');
  }
}
/**
 * tests if string is YYYY-MM-DD
 * @param {string|*} str
 * @returns {boolean}
 */


function isDateString(str) {
  return !!(typeof str === 'string' && str.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/));
}
/**
 *
 * @param {object} data
 * @param {string} prop
 */


function formatDate(data, prop) {
  var val = data[prop];

  if (isDateString(val)) {
    return;
  }

  if (val) {
    data[prop] = dateFormat(val, 'YYYY-MM-DD');
  }
}
/**
 *
 * @param {object} data
 * @param {string} prop
 */


function convertKeysUsedAsValues(data, prop) {
  if (_typeof(data[prop]) === 'object') {
    data[prop] = Object.keys( // keys are the values we want
    _pickBy(data[prop], function (val) {
      return val;
    })) // only include if value is truthy
    .map(_capitalize).join(', ');
  }
}
/**
 *
 * @param {object} data
 */


function addOnSitePromotion(data) {
  var syndicationStatusMap = {
    copy: 'syndicated copy',
    syndicated: 'syndicated original'
  },
      syndicated = syndicationStatusMap[data.syndicationStatus],
      crossPosted;
  convertKeysUsedAsValues(data, 'crosspost');
  crossPosted = data.crosspost && 'cross-posted';
  data.onSitePromotion = _compact([crossPosted, syndicated]).join(', ');
}
/**
 * most of the data in the gtm-page component is from subscriptions to other component data
 * this function converts data from the other components to what the gtm-page component needs
 * @param {object} data - gtm-page component data
 * @returns {object}
 */


function transformPageData(data) {
  arrayToString(data, 'authors');
  formatDate(data, 'publishDate');
  arrayToString(data, 'tags');
  convertKeysUsedAsValues(data, 'featureTypes');
  formatDate(data, 'magazineIssueDate');
  convertKeysUsedAsValues(data, 'contentChannel');
  addOnSitePromotion(data);
  return data;
}

module.exports.transformPageData = transformPageData;
}, {"52":52,"59":59,"145":145,"165":165}];
