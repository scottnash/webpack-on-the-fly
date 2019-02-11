window.modules["search-results.model"] = [function(require,module,exports){(function (process,__filename){
'use strict';

var _require = require(43),
    formatStart = _require.formatStart,
    swiftypeService = require(153),
    _isEmpty = require(75),
    _reduce = require(124),
    _get = require(32),
    camelCase = require(183),
    log = require(81).setup({
  file: __filename,
  component: 'search-results'
}),
    swiftypeEngine = window.process.env.SWIFTYPE_PUBLISHED_ARTICLES_ENGINE || 'qa-published-articles',
    swiftypeHost = window.process.env.SWIFTYPE_HOST,
    swiftypeSearchKey = window.process.env.SWIFTYPE_SEARCH_KEY;

require(182);

function buildSwiftypeQuery(data, locals) {
  var query = _get(locals, 'query.q'),
      pageSize = parseInt(_get(locals, 'query.size'), 10) || data.size || 10,
      queryBody = swiftypeService.buildQuery(query);

  var currentPage = formatStart(parseInt(_get(locals, 'query.page'), 10)); // can be undefined or NaN

  queryBody.sort = {
    _score: 'desc'
  };
  swiftypeService.setPage(queryBody, currentPage);
  swiftypeService.setSize(queryBody, pageSize);

  if (data.onlyThisSite) {
    swiftypeService.addFilter(queryBody, 'site', _get(locals, 'site.slug'));
  }

  if (!_isEmpty(data.excludeTags)) {
    queryBody.filters.none = [];

    for (var excludeTagsIndex = 0; excludeTagsIndex < data.excludeTags.length; excludeTagsIndex++) {
      queryBody.filters.none.push({
        tags: data.excludeTags[excludeTagsIndex].text
      });
    }
  }

  return queryBody;
}

function convertRawArticleData(article) {
  return _reduce(article, function (accumulator, value, key) {
    // Change to camelCase
    var camelCaseKey = camelCase(key);

    if (!_isEmpty(value) && !_isEmpty(value.raw)) {
      try {
        // Swiftype returns objects as JSON strings
        accumulator[camelCaseKey] = JSON.parse(value.raw);
      } catch (e) {
        // Arrays, strings, and dates are returned normally
        accumulator[camelCaseKey] = value.raw;
      }
    }

    return accumulator;
  }, {});
}

module.exports.render = function (ref, data, locals) {
  var q = _get(locals, 'query.q');

  var skipQuery = false,
      swiftypeQueryBody;

  if (_isEmpty(locals)) {
    log('debug', 'No locals provided, skipping search query');
    skipQuery = true;
  }

  if (_isEmpty(q)) {
    log('debug', 'No `q` query parameter provided, skipping search query');
    skipQuery = true;
  }

  if (_isEmpty(swiftypeEngine)) {
    log('error', 'No swiftypeEngine set in environment, skipping search query');
    skipQuery = true;
  }

  if (_isEmpty(swiftypeHost)) {
    log('error', 'No SWIFTYPE_HOST environment variable set, skipping search query');
    skipQuery = true;
  }

  if (_isEmpty(swiftypeSearchKey)) {
    log('error', 'No SWIFTYPE_SEARCH_KEY environment variable set, skipping search query');
    skipQuery = true;
  }

  if (skipQuery) {
    data.articles = [];
    return data;
  }

  swiftypeQueryBody = buildSwiftypeQuery(data, locals); // Log the query

  log('debug', 'swiftype query for search-results cmpt', {
    query: swiftypeQueryBody,
    ref: ref
  });
  return swiftypeService.query(swiftypeQueryBody, {
    host: swiftypeHost,
    token: swiftypeSearchKey,
    engine: swiftypeEngine
  }).then(function (response) {
    data.articles = _get(response, 'results', []).map(convertRawArticleData);
    data.totalPages = _get(response, 'meta.page.total_pages');
    data.currentPage = _get(response, 'meta.page.current');
    data.nextPage = data.currentPage + 1;
    return data;
  });
};

module.exports.save = function (ref, data) {
  // make sure all of the numbers we need to save aren't strings
  if (data.size) {
    data.size = parseInt(data.size, 10);
  }

  return data;
};

}).call(this,require(22),"/components/search-results/model.js")}, {"22":22,"32":32,"43":43,"75":75,"81":81,"124":124,"153":153,"182":182,"183":183}];
