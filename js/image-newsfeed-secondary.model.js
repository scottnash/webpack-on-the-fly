window.modules["image-newsfeed-secondary.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    _map = require(37),
    _clone = require(58),
    queryService = require(49),
    utils = require(43),
    index = 'published-articles',
    fields = ['primaryHeadline', 'plaintextPrimaryHeadline', 'authors', 'teaser', 'feedImgUrl', 'date', 'canonicalUrl', 'pageUri'];

module.exports.render = function (uri, data, locals) {
  var size = locals.start ? 51 : 48,
      from = utils.formatStart(parseInt(locals.start, 10) || 3),
      body = {
    from: data.overrideLede ? from - 1 : from,
    size: size
  },
      query = queryService(index, locals);
  query.body = _clone(body);
  queryService.withinThisSiteAndCrossposts(query, locals.site);

  if (data.newsfeedArticlesOnly) {
    queryService.addFilter(query, {
      term: {
        'feeds.newsfeed': true
      }
    });
  }

  if (data.tags && data.tags.length > 0) {
    data.tags.forEach(function (tag) {
      queryService.addShould(query, {
        match: {
          tags: tag.text
        }
      });
    });
    queryService.addMinimumShould(query, 1);
  }

  if (data.overrideLede) {
    queryService.addMustNot(query, {
      term: {
        canonicalUrl: data.overrideLede
      }
    });
  }

  queryService.onlyWithTheseFields(query, fields);
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQueryWithRawResult(query).then(function (results) {
    data.total = _get(results, 'hits.total');
    data.articles = _map(_get(results, 'hits.hits'), '_source');
    data.from = from;
    data.start = data.from + size;

    if (data.overrideLede) {
      data.total = data.total - 1;
    }

    return data;
  });
};
}, {"32":32,"37":37,"43":43,"49":49,"58":58}];
