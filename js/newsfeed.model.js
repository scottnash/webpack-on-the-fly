window.modules["newsfeed.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var queryService = require(49),
    formatStart = require(43).formatStart,
    _pickBy = require(59),
    _clone = require(58),
    _assign = require(57),
    _get = require(32),
    _map = require(37),
    clayUtils = require(56),
    log = require(81).setup({
  file: __filename,
  component: 'newsfeed'
}),
    index = 'published-articles';
/**
 *
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  var from = formatStart(parseInt(locals.start, 10)),
      // can be undefined or NaN,
  size = parseInt(locals.size, 10) || data.size || 10,
      body = _pickBy({
    from: from,
    size: size
  }),
      query = queryService(index, locals);

  query.body = _clone(body); // lose the reference

  queryService.withinThisSiteAndCrossposts(query, locals.site);

  if (data.newsfeedArticlesOnly) {
    queryService.addMust(query, {
      term: {
        'feeds.newsfeed': true
      }
    });
  }

  queryService.addSort(query, {
    date: 'desc'
  });

  if (data.tags && data.tags.length > 0) {
    data.tags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, 1);
  } // Log the query


  log('debug', 'query for newsfeed cmpt', {
    query: query,
    ref: ref
  });
  return queryService.searchByQueryWithRawResult(query).then(function (results) {
    _assign(data, body);

    data.total = _get(results, 'hits.total');
    data.articles = _map(_get(results, 'hits.hits'), '_source');
    data.from = from;
    data.start = from + size;

    var _ref = locals.query || {},
        bypass = _ref.bypass,
        edit = _ref.edit,
        publishUrl = _ref.publishUrl,
        shouldThrow404 = !data.articles.length && !edit && !bypass && !publishUrl && !clayUtils.isComponent(locals.url);

    if (shouldThrow404) {
      var err = new Error('No results!');
      err.status = 404;
      throw err;
    }

    return data;
  });
};

module.exports.save = function (ref, data) {
  // make sure all of the numbers we need to save aren't strings
  if (data.size) {
    data.size = parseInt(data.size, 10);
  }

  if (data.promoFrequency) {
    data.promoFrequency = parseInt(data.promoFrequency, 10);
  }

  if (data.adFrequency) {
    data.adFrequency = parseInt(data.adFrequency, 10);
  }

  if (data.spotlightAdFrequency) {
    data.spotlightAdFrequency = parseInt(data.spotlightAdFrequency, 10);
  }

  return data;
};

}).call(this,"/components/newsfeed/model.js")}, {"32":32,"37":37,"43":43,"49":49,"56":56,"57":57,"58":58,"59":59,"81":81}];
