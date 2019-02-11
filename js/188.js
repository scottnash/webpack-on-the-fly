window.modules["188"] = [function(require,module,exports){'use strict';

var _map = require(37),
    logicFieldName = 'queryParams';
/**
 * Return true if any element is common to both arr1 and arr2
 *
 * @param  {Array} arr1 Array of query param keys on page
 * @param  {Array} arr2 Array of query param keys on component
 * @return {boolean}
 */


function findMatch(arr1, arr2) {
  var i, j;

  for (i = 0; i < arr1.length; i++) {
    for (j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j]) {
        return true;
      }
    }
  }

  return false;
}
/**
 * display depending if a matching query param key is found
 * and whether action is set to 'excluded' or 'included'; defaults to 'include'
 * @param {object} componentData
 * @param {object} localUrl
 * @param {object} queryParams
 * @returns {object | promise}
 */


function setDisplay(componentData, localUrl, queryParams) {
  var componentQueryParams, matchFound;

  if (!componentData[logicFieldName]) {
    throw new Error('There are no ' + logicFieldName + ' for this Logic');
  }

  componentQueryParams = componentData[logicFieldName] && _map(componentData[logicFieldName].split(','), function (queryParam) {
    return queryParam.trim();
  });
  matchFound = findMatch(queryParams, componentQueryParams);
  componentData.displaySelf = componentData.queryParamsAction === 'exclude' ? !matchFound : matchFound;
  return componentData.displaySelf ? componentData : Promise.reject();
}

module.exports = setDisplay;
}, {"37":37}];
