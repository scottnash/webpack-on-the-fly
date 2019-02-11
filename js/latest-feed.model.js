window.modules["latest-feed.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var queryService = require(49),
    _map = require(37),
    sanitize = require(39),
    logger = require(81),
    log = logger.setup({
  file: __filename
}),
    striptags = require(42),
    INDEX = 'published-articles',
    QUERY_RE = /\?.*/,
    fields = ['canonicalUrl', 'feedLayout', 'date', 'rubric', 'primaryHeadline', 'shortHeadline', 'teaser', 'authors', 'feedImgUrl', 'tags', 'featureTypes', 'pageUri', 'syndicationStatus', 'crosspost', 'site'];

function defineTitleUrl(url) {
  return url.replace(QUERY_RE, '');
}

function defineClickUrl(url, dataSize) {
  if (url.includes('/?start=')) {
    return url;
  } else if (url.lastIndexOf('/')) {
    return "".concat(url, "?start=").concat(dataSize);
  }
}

function buildSearchQuery(data, locals, isCuneiform) {
  var size = Math.max(data.desktopArticleSize, data.mobileArticleSize, data.tabletArticleSize),
      query = isCuneiform ? queryService.newCuneiformQuery(INDEX) : queryService(INDEX, locals);

  if (locals) {
    queryService.withinThisSiteAndCrossposts(query, locals.site);
  }

  queryService.onlyWithTheseFields(query, fields);
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addSize(query, size);

  if (data.includeTags && data.includeTags.length) {
    data.includeTags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });

    if (data.matchAllTags) {
      queryService.addMinimumShould(query, data.includeTags.length);
    } else {
      queryService.addMinimumShould(query, 1);
    }
  }

  if (data.excludeTags && data.excludeTags.length) {
    data.excludeTags.forEach(function (tag) {
      queryService.addMustNot(query, {
        match: {
          tags: tag.text
        }
      });
    });
  }

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
  } else {
    return [];
  }
}

module.exports.render = function (uri, data, locals) {
  var query;

  if (data.populationBehavior !== 'static') {
    query = buildSearchQuery(data, locals, false);
    return queryService.searchByQuery(query).then(function (results) {
      data.articles = results;
      return data;
    }).catch(function (error) {
      log('error', error, {
        action: 'render',
        uri: uri
      });
      return data;
    });
  }

  return data;
};

module.exports.save = function (ref, data, locals) {
  data.title = sanitize.toSmartText(striptags(data.title || '', ['span']));

  if (data.readMoreUrl) {
    data.titleUrl = defineTitleUrl(data.readMoreUrl);
    data.clickUrl = defineClickUrl(data.readMoreUrl, data.desktopArticleSize);
    data.mobileUrl = defineClickUrl(data.readMoreUrl, data.mobileArticleSize);
    data.tabletUrl = defineClickUrl(data.readMoreUrl, data.tabletArticleSize);
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

}).call(this,"/components/latest-feed/model.js")}, {"37":37,"39":39,"42":42,"49":49,"81":81}];
