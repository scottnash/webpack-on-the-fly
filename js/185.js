window.modules["185"] = [function(require,module,exports){'use strict';

var _isString = require(164),
    chain = require(189),
    logicParams = ['tags', 'startDate', 'endDate', 'queryParams'];
/**
 * Walk through each item in the chain for each item in the article body, converting each
 * into a new format.
 *
 * NOTE: Chain of Command pattern
 *
 * @param {object} componentData
 * @param {string} localUrl
 * @param {array} queryParams
 * @param {object} locals
 * @returns {object}
 */


function checkLogic(componentData, localUrl, queryParams, locals) {
  return chain([require(186), require(187), require(188)], componentData, localUrl, queryParams, locals) // A catch for when no logic has a match. This
  // is necessary because there are times during the edit
  // process where a Logic can bypass the `noLogicCheck`,
  // and when it does it breaks the whole layout
  .catch(function () {
    if (!noLogicCheck(componentData)) {
      componentData.displaySelf = true;
    }

    return componentData;
  });
}
/**
 * returns true if at least one logic param is defined,
 * otherwise return false
 * @param  {[type]} componentData [description]
 * @return {[type]}               [description]
 */


function noLogicCheck(componentData) {
  // Check if one of the logic properties
  // contains data
  return logicParams.some(function (tag) {
    return _isString(componentData[tag]) ? componentData[tag].length > 0 : false;
  });
}

module.exports = checkLogic;
module.exports.noLogicCheck = noLogicCheck;
}, {"164":164,"186":186,"187":187,"188":188,"189":189}];
