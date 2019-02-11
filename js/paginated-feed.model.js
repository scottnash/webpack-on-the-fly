window.modules["paginated-feed.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var queryService = require(49),
    formatStart = require(43).formatStart,
    INDEX = 'published-articles',
    _get = require(32),
    _map = require(37),
    _require = require(56),
    isPage = _require.isPage,
    _take = require(113),
    _require2 = require(110),
    sendError = _require2.sendError,
    _require3 = require(39),
    removeNonAlphanumericCharacters = _require3.removeNonAlphanumericCharacters,
    normalizeName = _require3.normalizeName,
    logger = require(81),
    log = logger.setup({
  file: __filename
}),
    fields = ['canonicalUrl', 'feedLayout', 'date', 'rubric', 'primaryHeadline', 'teaser', 'authors', 'secondaryAttribution', 'byline', 'feedImgUrl', 'tags', 'featureTypes', 'pageUri', 'syndicationStatus', 'crosspost', 'site'],
    siteFilterResolver = {
  current: queryService.withinThisSiteAndCrossposts,
  domain: queryService.onlyWithinThisDomain
};

function formatSize(locals, data) {
  return parseInt(locals.size, 10) || parseInt(data.size, 10) || 10;
}

function validateDataOffset(data) {
  return Math.max(data.offset || 0, 0);
}

function filterIncludeTags(query, data) {
  if (data.includeTags && data.includeTags.length) {
    data.includeTags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, data.matchAllTags ? data.includeTags.length : 1);
  }
}

function filterExcludeTags(query, data) {
  if (data.excludeTags && data.excludeTags.length) {
    data.excludeTags.forEach(function (tag) {
      queryService.addMustNot(query, {
        match: {
          tags: tag.text
        }
      });
    });
  }
}

function filterNormalizeTags(query, data, locals) {
  if (data.populationBehavior === 'route' && data.routeParam && locals) {
    var routeParamValue;

    if (isPage(locals.url)) {
      routeParamValue = locals[data.routeParam] || '';
    } else {
      routeParamValue = locals.params ? locals.params[data.routeParam] : '';
    }

    queryService.addMust(query, {
      match: {
        normalizedTags: removeNonAlphanumericCharacters(routeParamValue).toLowerCase()
      }
    });
  }
}

function buildSearchQuery(data, locals, isCuneiform) {
  var offset = validateDataOffset(data),
      from = locals ? formatStart(parseInt(locals.start, 10)) + offset : 0,
      size = locals ? formatSize(locals, data) : 10,
      query = isCuneiform ? queryService.newCuneiformQuery(INDEX) : queryService(INDEX, locals); // This is a hack to determine if the "Show More" button should appear.
  // Cuneiform does not return the total count of results that match the
  // query. If Cuneiform is able to return 1 more than the required # (size) of
  // results, then there is more to show.

  if (isCuneiform) {
    size++;
  }

  queryService.addSize(query, size);
  queryService.addFrom(query, from);

  if (locals && locals.site && siteFilterResolver[data.site]) {
    siteFilterResolver[data.site](query, locals.site);
  }

  if (data.authorName) {
    queryService.addShould(query, {
      match_phrase: {
        'secondaryAttribution.normalized': normalizeName(data.authorName)
      }
    });
    queryService.addShould(query, {
      match_phrase: {
        'authors.normalized': normalizeName(data.authorName)
      }
    });
    queryService.addMinimumShould(query, 1);
  }

  filterNormalizeTags(query, data, locals);
  filterIncludeTags(query, data);
  filterExcludeTags(query, data);
  queryService.onlyWithTheseFields(query, fields);
  queryService.addSort(query, {
    date: 'desc'
  });

  if (!data.nonFeedArticles) {
    queryService.addMust(query, {
      term: {
        'feeds.newsfeed': true
      }
    });
  }

  return query;
}

function getScopes(scopes) {
  if (scopes && scopes.length) {
    return _map(scopes, function (scope) {
      return scope.text;
    });
  }

  return [];
}

module.exports.render = function (uri, data, locals) {
  var offset = validateDataOffset(data),
      query,
      from = formatStart(parseInt(locals.start, 10)),
      isFirstPage = from === 0;
  var size = locals ? formatSize(locals, data) : 10;

  if (isFirstPage) {
    from += offset;
  } // if the `start` property is 0 and the populated behavior is not dynamic, use Cuneiform if not use Elastic. If `from`
  // is not zero, it means that a url parameter was set. Cuneiform doesn't
  // handle url params, which is why we're falling back to Elastic for paginated
  // results. Dynamic behavior will use an Elastic query. Static behavior will use a Cuneiform for the results


  if (!isFirstPage || data.populationBehavior !== 'static') {
    // query Elastic
    query = buildSearchQuery(data, locals);
    queryService.addSize(query, size);
    queryService.addFrom(query, from);
    return queryService.searchByQueryWithRawResult(query).then(function (results) {
      if (data.populationBehavior === 'route' && !results.hits.total && !locals.edit && locals.params) {
        return Promise.reject({
          routeNoResult: true
        });
      }

      data.total = _get(results, 'hits.total');
      data.articles = _map(_get(results, 'hits.hits'), '_source');
      data.from = from;
      data.start = from + size;
      data.showMoreArticles = data.total > data.start;
      return data;
    }).catch(function (error) {
      if (error.routeNoResult) {
        sendError("No results for tag: ".concat(locals.params[data.routeParam]), 404);
      }

      log('error', error, {
        action: 'render',
        uri: uri
      });
      return data;
    });
  } else {
    // use Cuneiform results
    if (_get(data, 'cuneiformResults', []).length) {
      data.articles = _take(data.cuneiformResults, size); // If Cuneiform is able to return more results than the required #, then
      // there are more articles to show.

      data.showMoreArticles = data.cuneiformResults.length > size;
    } else {
      data.articles = [];
      data.showMoreArticles = false;
      log('warn', "No articles from Cuneiform for ".concat(uri), {
        action: 'render',
        uri: uri
      });
    }

    data.start = from + size;
    return data;
  }
};

module.exports.save = function (ref, data, locals) {
  if (data.size && !isNaN(data.size)) {
    data.size = data.size;
  }

  if (data.adFrequency) {
    data.adFrequency = data.adFrequency;
  }

  if (data.populationBehavior === 'static') {
    data.cuneiformScopes = getScopes(data.scopes);
    data.cuneiformQuery = buildSearchQuery(data, locals, true);
  } else if (data.cuneiformScopes || data.cuneiformQuery) {
    delete data.cuneiformScopes;
    delete data.cuneiformQuery;
  }

  return data;
};

}).call(this,"/components/paginated-feed/model.js")}, {"32":32,"37":37,"39":39,"43":43,"49":49,"56":56,"81":81,"110":110,"113":113}];
