window.modules["cut-section-feed.model"] = [function(require,module,exports){'use strict';

var _map = require(37),
    _get = require(32),
    _without = require(104),
    _includes = require(33),
    _head = require(25),
    queryService = require(49),
    INDEX = 'published-articles',
    FIELDS = ['primaryHeadline', 'authors', 'rubric', 'teaser', 'feedImgUrl', 'canonicalUrl', 'date', 'storyCharacteristics', 'tags', 'plaintextPrimaryHeadline', 'pageUri', 'byline'],
    getTopStory = function getTopStory(articles) {
  return articles.find(function (article) {
    return article.storyCharacteristics['top-story'];
  });
},
    ARTICLESPERGROUP = 10;

module.exports.save = function (ref, data) {
  if (!data.tags) {
    data.tags = _map(data.tagList, function (tag) {
      return {
        text: tag
      };
    });
  }

  return data;
};

module.exports.render = function (uri, data, locals) {
  var query = queryService(INDEX, locals),
      from = formatStart(parseInt(locals.start, 10));
  query.body = {
    size: data.size || 50,
    from: from
  };
  queryService.withinThisSiteAndCrossposts(query, locals.site);
  queryService.onlyWithTheseFields(query, FIELDS);
  queryService.addSort(query, {
    date: 'desc'
  });
  queryService.addMust(query, {
    term: {
      'feeds.newsfeed': true
    }
  });

  if (data.tags && data.tags.length) {
    data.tags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, 1);
  } // exclude results that have specified tags


  if (data.excludeTags && data.excludeTags.length) {
    data.excludeTags.forEach(function (tag) {
      queryService.addMustNot(query, {
        match: {
          tags: tag.text
        }
      });
    });
  }

  return getOverrideLede(data.ledeOverrideUrl, data.hideLede, locals.start).then(function (ledeArticle) {
    if (ledeArticle) {
      queryService.addMustNot(query, {
        match: {
          canonicalUrl: ledeArticle.canonicalUrl
        }
      });
    }

    return queryService.searchByQueryWithRawResult(query).then(function (results) {
      var articles = _map(_get(results, 'hits.hits'), '_source');

      if (!data.hideLede && !locals.start) {
        if (ledeArticle && ledeArticle !== '') {
          data.articles = articles;
          data.articles.unshift(ledeArticle);
          data.hasLede = true;
        } else {
          var topStory = getTopStory(articles);

          if (topStory) {
            data.articles = _without(articles, topStory);
            data.articles.unshift(topStory);
            data.hasLede = true;
          } else {
            data.articles = articles;
            data.hasLede = false;
          }
        }
      } else {
        data.articles = articles;
        data.hasLede = false;
      }

      data.articles = markCallouts(data.articles);
      data.total = _get(results, 'hits.total');
      data.articlesPerGroup = ARTICLESPERGROUP;
      data.from = from;
      data.start = from + (data.size || 50);
      return data;
    });
  });
};
/**
 * getOverrideLede
 *
 * @param {string} overrideLede the url of the override lede article
 * @param {boolean} ledeHidden
 * @param {number} start pagination start position (if > 0, we dont show a lede)
 * @returns {Promise} the overrideLede article data or an empty promise
 */


function getOverrideLede(overrideLede, ledeHidden, start) {
  if (overrideLede && !ledeHidden && !start) {
    var query = queryService.newQueryWithCount(INDEX);
    queryService.addFilter(query, {
      term: {
        canonicalUrl: overrideLede
      }
    });
    return queryService.searchByQuery(query).then(function (result) {
      return _head(result);
    });
  }

  return Promise.resolve('');
}
/**
 * formatStart
 *
 * @param {int} n
 * @returns {int}
 */


function formatStart(n) {
  var min = 0,
      max = 100000000;

  if (typeof n === 'undefined' || Number.isNaN(n) || n < min || n > max) {
    return 0;
  } else {
    return n;
  }
}
/**
 * markCallouts
 *
 * @param {array} articles array of articles to be displayed
 * @returns {array} articles decorated with callouts where applicable
 */


function markCallouts(articles) {
  return _map(articles, function (article) {
    if (_includes(article.tags, 'video') || _includes(article.tags, 'original video')) {
      article.callout = 'video';
    } else if (_includes(article.tags, 'gallery')) {
      article.callout = 'gallery';
    }

    return article;
  });
}
}, {"25":25,"32":32,"33":33,"37":37,"49":49,"104":104}];
