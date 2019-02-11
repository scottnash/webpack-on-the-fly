window.modules["153"] = [function(require,module,exports){(function (process,__filename){
'use strict';

var decamelize = require(504),
    escapeUnicode = require(559),
    _map = require(37),
    _pick = require(174),
    _reduce = require(124),
    _isArray = require(129),
    _isEmpty = require(75),
    _remove = require(216),
    _set = require(87),
    _isPlainObject = require(803),
    log = require(81).setup({
  file: __filename
}),
    _process$env = process.env,
    SWIFTYPE_API_KEY = _process$env.SWIFTYPE_API_KEY,
    SWIFTYPE_HOST = _process$env.SWIFTYPE_HOST; // global


require(182); // Escapes all non-ascii characters in string to their equivalent unicode escape sequence


function escapeUnicodeForSwiftype(str) {
  var result = '';

  for (var index = 0; index < str.length; index++) {
    // only convert to unicode escape sequence if the character is not ASCII
    if (str[index].charCodeAt(0) > 127) {
      result += escapeUnicode(str[index]);
    } else {
      result += str[index];
    }
  }

  return result;
}

;
/**
 * Sends page data to swiftype
 *
 * @param {Array<Object>} documents
 * @param {string} swiftypeEngine
 * @returns {Promise}
 */

function sendToSwiftype(documents, swiftypeEngine) {
  if (!SWIFTYPE_API_KEY) {
    log('error', 'Unable to push published page to Swiftype: Please make sure to set a SWIFTYPE_API_KEY');
    return Promise.resolve();
  }

  var requestHeaders = {
    'Content-Type': 'application/json',
    Authorization: "Bearer ".concat(SWIFTYPE_API_KEY)
  },
      requestEndpoint = "".concat(SWIFTYPE_HOST, "/api/as/v1/engines/").concat(swiftypeEngine, "/documents");

  if (!_isArray(documents)) {
    documents = [documents];
  }

  log('debug', "Pushing ".concat(documents.length, " documents to Swiftype engine ").concat(swiftypeEngine, " at ").concat(SWIFTYPE_HOST));
  return fetch(requestEndpoint, {
    method: 'POST',
    headers: requestHeaders,
    body: escapeUnicodeForSwiftype(JSON.stringify(documents), null, 2)
  });
}
/**
 * Deletes page data from swiftype
 *
 * @param {string} documentId
 * @param {string} swiftypeEngine
 * @returns {Promise}
 */


function deleteFromSwiftype(documentId, swiftypeEngine) {
  if (!SWIFTYPE_API_KEY) {
    log('error', 'Unable to push published page to Swiftype: Please make sure to set a SWIFTYPE_API_KEY');
    return Promise.resolve();
  }

  var requestHeaders = {
    'Content-Type': 'application/json',
    Authorization: "Bearer ".concat(SWIFTYPE_API_KEY)
  },
      requestEndpoint = "".concat(SWIFTYPE_HOST, "/api/as/v1/engines/").concat(swiftypeEngine, "/documents");
  log('debug', "Deleting ".concat(documentId, " from Swiftype engine ").concat(swiftypeEngine, " at ").concat(SWIFTYPE_HOST));
  return fetch(requestEndpoint, {
    method: 'DELETE',
    headers: requestHeaders,
    body: JSON.stringify([documentId])
  });
}
/**
 * Matches a property value with swiftype type
 *
 * Context: In order to query documents from swiftype and filter them properly we can't
 * send objects or array of objects because it cast them to strings, so for that reason
 * this helper handles those two cases and cast the objects to its equivalent value as string.
 *
 * @param {Any} propertyValue
 * @returns {Any}
 */


function matchSwiftypeTypes(propertyValue) {
  if (_isPlainObject(propertyValue)) {
    return _map(propertyValue, function (value, key) {
      return value ? key : '';
    }).filter(Boolean);
  } else if (_isArray(propertyValue) && _isPlainObject(propertyValue[0]) && Object.keys(propertyValue[0])[0] === 'text') {
    return _map(propertyValue, function (Obj) {
      return Obj.text;
    });
  } else {
    return propertyValue;
  }
}
/**
 * Creates a query to be sent to Swiftype. Just an object with `query`, which is
 *  required.
 *
 * @param {string} textQuery
 * @return {object}
 */


function buildQuery() {
  var textQuery = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var queryObj = {
    query: textQuery
  };
  return queryObj;
}
/**
 * Sets search_fields property of a Swiftype query object. The key of `fields`
 * is the name of the field and the value is an empty object.
 * E.g. { cuisine: {}}
 *
 * Reference: https://swiftype.com/documentation/site-search/searching#default_search_behavior
 *
 * @param {object} query - a query object to be sent to Swiftype
 * @param {object} fields - only match `query` to these fields.
 * @return {object} - modified query object.
 */


function setSearchFields(query, fields) {
  query.search_fields = fields;
  return query;
}
/**
 * Sets results_fields property of a Swiftype query object.
 *
 * @param {object} query
 * @param {object} fields - Swiftype will return only these properties in its
 * results
 * @return {object}
 */


function setResultsFields(query, fields) {
  query.result_fields = fields;
  return query;
}
/**
 * Adds facets property to a Swiftype query object. When set, Swiftype returns
 * counts for each facet. E.g. If `cuisines` is set, the Swiftype will return
 * information about how many results match American cuisine, match Chinese
 * cuisine... etc
 *
 * Reference: https://swiftype.com/documentation/app-search/guides/facets
 *
 * @param {object} query
 * @param {array} facets - an array of field names we'd like counts on
 * @return {object}
 */


function addFacets(query, facets) {
  if (!query.facets) {
    query.facets = {};
  }

  facets.forEach(function (facet) {
    query.facets[facet] = [{
      type: 'value',
      size: 250
    }];
  });
  return query;
}

;
/**
 * Only return results that match any of the defined filters. E.g. if the
 * filterType is `cusine` and the filters are `Mexican` and `Chinese`, results
 * that have Mexican, Mexican and Chinese, Chinese cuisines will be returned.
 *
 * Reference: https://swiftype.com/documentation/site-search/searching#filters
 *
 * @param {object} query
 * @param {string} filterType - fields we want to match against
 * @param {array} filters - values of the fields we want to match against
 * @return {object}
 */

function addFilter(query, filterType, filters) {
  var filter = {};

  if (!query.filters) {
    query.filters = {
      all: []
    };
  }

  filter[filterType] = filters;
  query.filters.all.push(filter);
  return query;
}

function removeFilter(query, filterType) {
  if (!query.filters) {
    return query;
  } else {
    _remove(query.filters.all, function (filter) {
      return filter.hasOwnProperty(filterType);
    });
  }

  return query;
}

;
/**
 * @param {object} query
 * @param {integer} size
 * @return {object}
 */

function setSize(query, size) {
  return _set(query, 'page.size', size);
}
/**
 * @param {object} query
 * @param {integer} page
 * @return {object}
 */


function setPage(query, page) {
  // Swiftype doesn't like current to be set to 0
  var currentPage = page === 0 ? 1 : page;

  if (page > 98) {
    console.warn('Swiftype does not allow the current parameter to be more than 100!'); // See: https://community.swiftype.com/t/page-contains-invalid-option-current-must-be-less-than-or-equal-to-100/869
    // The current workaround is to set the size to a high enough #
    // so that pages don't exceed 100. This workaround will work until we have
    // more than 2000 results.
  }

  return _set(query, 'page.current', currentPage);
}
/**
 * Query Swiftype
 *
 * @param {object} query
 * @param {string} config.host
 * @param {string} config.token - used for authorization
 * @param {string} config.engine - name of the Swiftype engine, eg. 'prd-listings'
 * @param {endpoint} config.endpoint - defaults to the search endpoint
 * @return {Promise}
 */


function query(query, _ref) {
  var host = _ref.host,
      token = _ref.token,
      engine = _ref.engine,
      _ref$endpoint = _ref.endpoint,
      endpoint = _ref$endpoint === void 0 ? 'search' : _ref$endpoint;
  var url = "".concat(host, "/api/as/v1/engines/").concat(engine, "/").concat(endpoint);
  var headers = {
    'Content-Type': 'application/json',
    Authorization: "Bearer ".concat(token)
  };
  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(query)
  }).then(function (res) {
    return res.json();
  }).catch(function (error) {
    log('error', 'Error retrieving search results from Swiftype:', error);
    return {};
  });
}
/**
* Converts listing data to swiftype doc structure
*
* @param {Object} data
* @param {Array<string>} fields
* @returns {Object} swiftype document
*/


function convertClayDataToSwiftypeDoc(data, fields) {
  if (_isEmpty(data.pageUri)) {
    return {};
  }

  var clonedData = _reduce(_pick(data, fields), function (result, value, key) {
    result[decamelize(key)] = matchSwiftypeTypes(value);
    return result;
  }, {});

  clonedData.id = clonedData.page_uri;
  return clonedData;
}

module.exports = {
  buildQuery: buildQuery,
  addFacets: addFacets,
  addFilter: addFilter,
  removeFilter: removeFilter,
  setResultsFields: setResultsFields,
  setSearchFields: setSearchFields,
  setSize: setSize,
  setPage: setPage,
  query: query,
  sendToSwiftype: sendToSwiftype,
  convertClayDataToSwiftypeDoc: convertClayDataToSwiftypeDoc,
  deleteFromSwiftype: deleteFromSwiftype
};

}).call(this,require(22),"/services/universal/swiftype.js")}, {"22":22,"37":37,"75":75,"81":81,"87":87,"124":124,"129":129,"174":174,"182":182,"216":216,"504":504,"559":559,"803":803}];
