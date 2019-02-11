window.modules["author-feed.model"] = [function(require,module,exports){'use strict';

var _pickBy = require(59),
    _clone = require(58),
    _assign = require(57),
    _get = require(32),
    _map = require(37),
    queryService = require(49),
    utils = require(43),
    _require = require(39),
    normalizeName = _require.normalizeName,
    INDEX = 'published-articles',
    ARTICLE_COUNT = 20,
    fields = ['primaryHeadline', 'canonicalUrl', 'feedImgUrl', 'teaser', 'date'];

module.exports.render = function (ref, data, locals) {
  var from = utils.formatStart(parseInt(locals.start, 10)),
      // can be undefined or NaN,
  size = parseInt(locals.size, 10) || ARTICLE_COUNT,
      body = _pickBy({
    from: from,
    size: size
  }),
      query = queryService(INDEX, locals);

  query.body = _clone(body); // lose the reference

  if (data.name) {
    queryService.addMust(query, {
      match_phrase: {
        'authors.normalized': normalizeName(data.name)
      }
    });
    queryService.onlyWithTheseFields(query, fields); // only display articles from the host this feed is on

    queryService.addFilter(query, {
      prefix: {
        canonicalUrl: "http://".concat(locals.site.host)
      }
    });
    queryService.addSort(query, {
      date: 'desc'
    });
    return queryService.searchByQueryWithRawResult(query).then(function (results) {
      _assign(data, body);

      data.total = _get(results, 'hits.total');
      data.articles = _map(_get(results, 'hits.hits'), '_source');
      data.start = from + size;
      data.moreEntries = data.total > data.start;
      return data;
    });
  }

  return data;
};
}, {"32":32,"37":37,"39":39,"43":43,"49":49,"57":57,"58":58,"59":59}];
