window.modules["1263"] = [function(require,module,exports){'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _map = require(37),
    _get = require(32),
    _isArray = require(129),
    _set = require(87),
    _isObject = require(74),
    _cloneDeep = require(47),
    _uniq = require(163);
/**
 * @param {object} result
 * @returns {Array}
 */


function formatSearchResult(result) {
  return _map(result.hits.hits, '_source');
}
/**
 * Start a new query with the specified index
 * and types for the query
 * https://www.elastic.co/guide/en/elasticsearch/reference/2.4/query-dsl-bool-query.html
 *
 * @param  {String} index
 * @param  {String} type
 * @return {Object}
 */


function newQuery(index) {
  if (!index) {
    throw new Error('An `index` is required to construct a query');
  }

  return {
    index: index,
    type: '_doc',
    body: {
      query: {}
    }
  };
}
/**
 * Adds a `should` property to the query.
 * https://www.elastic.co/guide/en/elasticsearch/reference/2.4/query-dsl-bool-query.html
 *
 * @param {Object} query
 * @param {Array|Object} item
 * @return {Object}
 */


function addShould(query, item) {
  var should = _get(query, 'body.query.bool.should', undefined),
      itemIsArray = _isArray(item);

  if (should) {
    if (itemIsArray) {
      _set(query, 'body.query.bool.should', should.concat(item));
    } else {
      should.push(item);

      _set(query, 'body.query.bool.should', should);
    }
  } else {
    if (itemIsArray) {
      _set(query, 'body.query.bool.should', item);
    } else {
      _set(query, 'body.query.bool.should', [item]);
    }
  }

  return query;
}
/**
 * Adds a `must` property to the query.
 * https://www.elastic.co/guide/en/elasticsearch/reference/2.4/query-dsl-bool-query.html
 *
 * @param {Object} query
 * @param {Array|Object} item
 * @return {Object}
 */


function addMust(query, item) {
  var must = _get(query, 'body.query.bool.must', undefined),
      itemIsArray = _isArray(item);

  if (must) {
    if (itemIsArray) {
      _set(query, 'body.query.bool.must', must.concat(item));
    } else {
      must.push(item);

      _set(query, 'body.query.bool.must', must);
    }
  } else {
    if (itemIsArray) {
      _set(query, 'body.query.bool.must', item);
    } else {
      _set(query, 'body.query.bool.must', [item]);
    }
  }

  return query;
}
/**
 * Adds a `must_not` property to the query.
 *
 * @param {Object} query
 * @param {Array|Object} item
 * @return {Object}
 */


function addMustNot(query, item) {
  var mustNot = _get(query, 'body.query.bool.must_not', undefined),
      itemIsArray = _isArray(item);

  if (mustNot) {
    if (itemIsArray) {
      _set(query, 'body.query.bool.must_not', mustNot.concat(item));
    } else {
      mustNot.push(item);

      _set(query, 'body.query.bool.must_not', mustNot);
    }
  } else {
    if (itemIsArray) {
      _set(query, 'body.query.bool.must_not', item);
    } else {
      _set(query, 'body.query.bool.must_not', [item]);
    }
  }

  return query;
}
/**
 * Add a filter property to a query
 * https://www.elastic.co/guide/en/elasticsearch/reference/2.4/query-dsl-bool-query.html
 *
 * TODO: HANDLE PASSING IN ARRAY INSTEAD OF SINGLE ITEM
 *
 * @param {Object} query
 * @param {Object} item
 * @return {Object}
 */


function addFilter(query, item) {
  var filter = _get(query, 'body.query.bool.filter', undefined),
      itemIsObject = _isObject(item);

  if (!itemIsObject) {
    throw new Error('Filter query required to be an object');
  }

  if (filter) {
    if (_isArray(filter)) {
      filter.push(item);

      _set(query, 'body.query.bool.filter', filter);
    } else {
      _set(query, 'body.query.bool.filter', [_cloneDeep(filter), item]);
    }
  } else {
    _set(query, 'body.query.bool.filter', item);
  }

  return query;
}
/**
 * Set a minumum number of `should` statements that should match
 * for a query to return items from an index. This function will
 * overwrite previous values for the property if called multiple
 * times.
 * https://www.elastic.co/guide/en/elasticsearch/reference/2.4/query-dsl-minimum-should-match.html
 *
 * @param {Object} query
 * @param {Number} num
 * @return {Object}
 */


function addMinimumShould(query, num) {
  if (typeof num !== 'number') {
    throw new Error('A number is required as the second argument');
  }

  _set(query, 'body.query.bool.minimum_should_match', num);

  return query;
}
/**
 * Add a sort to the query
 * https://www.elastic.co/guide/en/elasticsearch/reference/2.4/search-request-sort.html
 *
 * @param {Object} query
 * @param {Object} sortItem
 * @return {Object}
 */


function addSort(query, sortItem) {
  var sortBy = _get(query, 'body.sort');

  if (!_isArray(sortBy)) {
    sortBy = [];

    _set(query, 'body.sort', sortBy);
  }

  sortBy.push(sortItem);
  return query;
}
/**
 * Add a size property to the query body
 * https://www.elastic.co/guide/en/elasticsearch/reference/2.4/search-request-from-size.html
 *
 * @param {Object} query
 * @param {Number|String} [size]
 * @returns {Object}
 */


function addSize(query, size) {
  if (!size && size !== 0) {
    return query;
  }

  size = parseInt(size);

  if (isNaN(size)) {
    throw new Error("Second argument must be a number: ".concat(size));
  }

  return _set(query, 'body.size', size);
}
/**
 * Add a from property to the query body
 * https://www.elastic.co/guide/en/elasticsearch/reference/2.4/search-request-from-size.html
 *
 * @param {Object} query
 * @param {Number|String} [from]
 * @returns {Object}
 */


function addFrom(query, from) {
  if (!from && from !== 0) {
    return query;
  }

  from = parseInt(from);

  if (isNaN(from)) {
    throw new Error("Second argument must be a number: ".concat(from));
  }

  return _set(query, 'body.from', from);
}
/**
 * https://www.elastic.co/guide/en/elasticsearch/reference/2.4/search-request-source-filtering.html
 *
 * @param {Object} query
 * @param {Array} fields
 * @returns {Object}
 */


function onlyWithTheseFields(query, fields) {
  if (!_isArray(fields)) {
    throw new Error('Second argument is required to be an Array');
  }

  _set(query, 'body._source.include', _uniq(fields));

  return query;
}
/**
 * @param {Object} query
 * @param {Object} site
 * @returns {Object}
 */


function onlyWithinThisSite(query, site) {
  addFilter(query, {
    term: {
      site: site.slug
    }
  });
  return query;
}
/**
 * @param {Object} query
 * @param {Object} site
 * @returns {Object}
 */


function onlyWithinThisDomain(query, site) {
  addFilter(query, {
    prefix: {
      canonicalUrl: "http://".concat(site.host)
    }
  });
  return query;
}
/**
 * @param {object} query
 * @param {object} site
 * @returns {object}
 */


function withinThisSiteAndCrossposts(query, site) {
  var crosspostFilter = {
    term: {}
  },
      shouldFilter = {
    bool: {
      should: [],
      minimum_should_match: 1
    }
  };
  crosspostFilter.term['crosspost.' + site.slug] = true;
  shouldFilter.bool.should.push({
    term: {
      site: site.slug
    }
  });
  shouldFilter.bool.should.push(crosspostFilter);
  addFilter(query, shouldFilter);
  return query;
}
/**
 * @param {object} query
 * @param {object} site
 * @returns {object}
 */


function withinThisDomainOrCrossposts(query, site) {
  var crosspostFilter = {
    term: _defineProperty({}, "crosspost.".concat(site.slug), true)
  };
  addShould(query, crosspostFilter);
  addShould(query, {
    prefix: {
      canonicalUrl: "http://".concat(site.host)
    }
  });
  addMinimumShould(query, 1);
  return query;
}
/**
 * https://www.elastic.co/guide/en/elasticsearch/reference/2.4/query-dsl-mlt-query.html
 * @param {object} query
 * @param {string} id      _id of the elasticsearch document to compare to
 * @param {object} [opts]  provides ability to overwrite any of the options
 * @returns {object}
 */


function moreLikeThis(query, id, opts) {
  var defaultOpts = {
    fields: ['tags'],
    like: {
      _index: query.index,
      // prefixed index name
      _type: '_doc',
      _id: id
    },
    include: false,
    // do not include the current doc in the results
    min_term_freq: 1,
    max_query_terms: 12,
    min_doc_freq: 1 // especially helpful for testing few articles

  };
  return {
    more_like_this: Object.assign(defaultOpts, opts)
  };
}
/**
 * Adds aggregation property to query
 * @param {Object} query - Elastic query object
 * @param {Object} options - aggregation config object
 * @returns {Object} query object
 */


function addAggregation() {
  var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 ? arguments[1] : undefined;
  var _query$body = query.body,
      body = _query$body === void 0 ? {} : _query$body;

  if (!options) {
    return query;
  }

  if (body.aggs) {
    _set(query, 'body.aggs', Object.assign(body.aggs, options));
  } else {
    _set(query, 'body.aggs', options);
  }

  return query;
}
/**
 * Formats aggregation results
 * @param {string} [aggregationName=''] - Aggregation name
 * @param {string} [field=''] - Aggregation result field
 * @param {boolean} [skipEmpty=true] - Remove from the array documents if
 * doc_count is not present or is 0
 * @return {Array<Any>} Array of resulting/expected field from the aggregation
 */


function formatAggregationResults() {
  var aggregationName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var field = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var skipEmpty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return function () {
    var results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var parsedData = _get(results, "aggregations.".concat(aggregationName, ".buckets"), []);

    if (skipEmpty) {
      parsedData = parsedData.filter(function (result) {
        return _get(result, 'doc_count', 0) !== 0;
      });
    }

    return parsedData.map(function (result) {
      return result[field] || '';
    });
  };
}
/**
 * Adds geo_shape property to query
 * @param {Object} query
 * @param {Array} item
 * @returns {Object}
 */


function addGeo(query, item) {
  if (!_isArray(item)) {
    throw new Error('Second argument is required to be an Array');
  }

  if (item.length !== 2) {
    throw new Error('Array must be length 2');
  }

  if (item.some(isNaN)) {
    throw new Error('Array must only contain numbers');
  }

  _set(query, 'body.query.geo_shape.location.shape.type', 'point');

  _set(query, 'body.query.geo_shape.location.shape.coordinates', item);

  return query;
}
/**
 * Combines two bool queries into a single function score query, with results
 * from the first query returned first.
 * Query settings (index, fields, etc) used will be those of the first query.
 * @param {object} primaryQuery
 * @param {object} secondaryQuery
 * @returns {object}
 */


function combineFunctionScoreQueries(primaryQuery, secondaryQuery) {
  var functionOne = _cloneDeep(_get(primaryQuery, 'body.query', {})),
      functionTwo = _cloneDeep(_get(secondaryQuery, 'body.query', {})),
      sortBy = _get(primaryQuery, 'body.sort'); // Set up the function scoring query


  _set(primaryQuery, 'body.query', {});

  _set(primaryQuery, 'body.query.function_score.functions', []);

  primaryQuery.body.query.function_score.functions.push({
    filter: functionOne,
    weight: 20
  });
  primaryQuery.body.query.function_score.functions.push({
    filter: functionTwo,
    weight: 10
  }); // Keep scoring to 20 or 10, and only return matching results

  primaryQuery.body.query.function_score.score_mode = 'max';
  primaryQuery.body.query.function_score.min_score = 10; // Keep any existing sort, but prioritize the score first

  if (!_isArray(sortBy)) {
    sortBy = [];

    _set(primaryQuery, 'body.sort', sortBy);
  }

  sortBy.unshift({
    _score: 'desc'
  });
  return primaryQuery;
}

module.exports = newQuery;
module.exports.addGeo = addGeo;
module.exports.addAggregation = addAggregation;
module.exports.addShould = addShould;
module.exports.addFilter = addFilter;
module.exports.addMust = addMust;
module.exports.addMustNot = addMustNot;
module.exports.addMinimumShould = addMinimumShould;
module.exports.addSort = addSort;
module.exports.addSize = addSize;
module.exports.addFrom = addFrom;
module.exports.onlyWithTheseFields = onlyWithTheseFields;
module.exports.onlyWithinThisSite = onlyWithinThisSite;
module.exports.onlyWithinThisDomain = onlyWithinThisDomain;
module.exports.withinThisSiteAndCrossposts = withinThisSiteAndCrossposts;
module.exports.withinThisDomainOrCrossposts = withinThisDomainOrCrossposts;
module.exports.formatAggregationResults = formatAggregationResults;
module.exports.formatSearchResult = formatSearchResult;
module.exports.moreLikeThis = moreLikeThis;
module.exports.combineFunctionScoreQueries = combineFunctionScoreQueries;
}, {"32":32,"37":37,"47":47,"74":74,"87":87,"129":129,"163":163}];
