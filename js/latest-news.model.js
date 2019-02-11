window.modules["latest-news.model"] = [function(require,module,exports){'use strict';

var _map = require(37),
    _some = require(118),
    _values = require(60),
    _get = require(32),
    queryService = require(49),
    callout = require(80),
    _require = require(56),
    isComponent = _require.isComponent,
    index = 'published-articles',
    fields = ['plaintextPrimaryHeadline', 'primaryHeadline', 'teaser', 'canonicalUrl', 'feedImgUrl', 'pageUri', 'date', 'rubric', 'feedLayout', 'storyCharacteristics', 'tags', 'authors', 'featureTypes'];

function decorateResults(results, desktopRendition, showFeatures) {
  return _map(results, function (result) {
    result.featured = showFeatures && (_some(_values(result.storyCharacteristics), function (v) {
      return !!v;
    }) || result.feedLayout === 'large');
    result.callout = callout(result);
    result.dynamicImage = {
      url: result.feedImgUrl,
      mobile: 'square',
      tablet: result.featured ? 'square' : desktopRendition,
      desktop: result.featured ? 'square' : desktopRendition
    };
    return result;
  });
}

function getArticleFeedResults(data, locals, ref) {
  var query = queryService.addSize(queryService(index, locals), data.size);

  if (data.tag) {
    fields.push('tags');
    queryService.addShould(query, {
      prefix: {
        tags: data.tag
      }
    });
    queryService.addMinimumShould(query, 1);
  }

  if (data.featureType) {
    var term = {};
    term["featureTypes.".concat(data.featureType)] = true;
    fields.push('featureType');
    queryService.addShould(query, {
      term: term
    });
    queryService.addMinimumShould(query, 1);
  }

  if (!data.allSites) {
    queryService.withinThisSiteAndCrossposts(query, locals.site);
    queryService.addMustNot(query, {
      prefix: {
        canonicalUrl: "http://".concat(locals.site.host, "/press")
      }
    });
  }

  queryService.onlyWithTheseFields(query, fields);
  queryService.addFilter(query, {
    term: {
      'feeds.newsfeed': true
    }
  });
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQuery(query, {
    ref: ref,
    uniqueKey: 'getArticleFeedResults'
  }, locals, false);
}

function normalizeCanonicalUrl(url) {
  return url.split('/amp/').join('/');
}

function getArticlesLikeThis(data, locals) {
  var articleUrl = normalizeCanonicalUrl(locals.url),
      thisArticleQuery = queryService.onePublishedArticleByUrl(articleUrl, []);

  if (isComponent(locals.url)) {
    return Promise.resolve([]);
  }

  return queryService.searchByQueryWithRawResult(thisArticleQuery).then(function (rawResult) {
    var articleUri = _get(rawResult, 'hits.hits[0]._id');

    var articlesLikeThisQuery;

    if (!articleUri) {
      return [];
    }

    articlesLikeThisQuery = queryService(index, locals);
    queryService.addSize(articlesLikeThisQuery, data.size);
    queryService.onlyWithinThisSite(articlesLikeThisQuery, locals.site);
    queryService.onlyWithTheseFields(articlesLikeThisQuery, fields);
    queryService.addShould(articlesLikeThisQuery, queryService.moreLikeThis(articlesLikeThisQuery, articleUri));
    queryService.addMinimumShould(articlesLikeThisQuery, 1);
    return queryService.searchByQuery(articlesLikeThisQuery, {
      ref: articleUri,
      // Not passing the component ref because the query changes based on the article
      uniqueKey: 'getArticlesLikeThis'
    }, locals, false);
  });
}
/**
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  var elasticCall;

  if (data.showArticlesLikeThis) {
    elasticCall = getArticlesLikeThis;
  } else {
    elasticCall = getArticleFeedResults;
  }

  return elasticCall(data, locals, ref).then(function (results) {
    data.articles = decorateResults(results, data.desktopImgRendition, data.showFeatures);
    return data;
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
};

module.exports.save = function (ref, data) {
  // show the rubric (no date) on mobile if its a tag feed
  // otherwise show the date with no rubric on mobile
  data.showMobileRubric = !!data.tag || !!data.featureType;
  return data;
};
}, {"32":32,"37":37,"49":49,"56":56,"60":60,"80":80,"118":118}];
