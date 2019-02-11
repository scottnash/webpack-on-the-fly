window.modules["ooyala-recirc-lede.model"] = [function(require,module,exports){(function (process,__filename){
'use strict';

var _get = require(32),
    // _isEmpty = require('lodash/isEmpty'),
_map = require(37),
    _set = require(87),
    querystring = require(171),
    toPlainText = require(39).toPlainText,
    rest = require(5),
    recircCmpt = require(103),
    videoServiceUrl = "".concat(window.process.env.VIDEO_FEED, "/popular"),
    queryService = require(49),
    originalVideoIndex = 'original-videos-all',
    fields = ['primaryHeadline', 'plaintextPrimaryHeadline', 'canonicalUrl', 'feedImgUrl', 'tags'],
    logger = require(81),
    log = logger.setup({
  file: __filename
}),
    ELASTIC_FIELDS = ['pageUri'];
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  if (result.pageUri) {
    data.pageUri = result.pageUri;
  }

  if (data.primaryHeadline) {
    data.plaintextPrimaryHeadline = toPlainText(data.primaryHeadline);
  }

  if (Array.isArray(data.featureTypes)) {
    data.featureTypes = data.featureTypes.reduce(function (prev, curr) {
      return _set(prev, curr, true);
    }, {});
  }

  return data;
}
/**
 * gather a set of video page links for display that are based on Ooyala's 'Most Popular'
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function getMostPopular(data, locals) {
  var params = {
    count: _get(data, 'links', 5),
    site: _get(locals, 'site.slug')
  }; // if (window.process.env.ELASTIC_PREFIX && !_isEmpty(window.process.env.ELASTIC_PREFIX)) {
  //  params.prefix = window.process.env.ELASTIC_PREFIX;
  // }

  return rest.get("".concat(videoServiceUrl, "?").concat(querystring.stringify(params)), {
    timeout: 4000
  }).then(function (items) {
    return _map(items, function (item) {
      return {
        primaryHeadline: item.primaryHeadline,
        plaintextPrimaryHeadline: toPlainText(item.primaryHeadline),
        canonicalUrl: item.canonicalUrl,
        feedImgUrl: item.feedImgUrl
      };
    });
  }).catch(function (err) {
    return log(err);
  });
}
/**
 * Get from elastic videos that match all the tags
 * requested in the tags filter
 * @param {Object} data
 * @param {Object} locals
 * @return {Promise}
 */


function getVideosByTags(data, locals) {
  var tags = data.filteredTags || [],
      query = queryService(originalVideoIndex, locals),
      order = data.orderDesc ? 'desc' : 'asc',
      site = _get(locals, 'site', {});

  queryService.addSize(query, data.links || 5);
  queryService.onlyWithinThisSite(query, site);
  queryService.onlyWithTheseFields(query, fields);
  tags.forEach(function (tag) {
    queryService.addShould(query, {
      match: {
        tags: tag.text
      }
    });
  });
  queryService.addMinimumShould(query, tags.length);
  queryService.addSort(query, {
    date: order
  });
  return queryService.searchByQuery(query).catch(function (err) {
    return log(err);
  });
}

module.exports.save = function (ref, data) {
  return Promise.resolve(data); // returning with a Promise for easier testing
};

module.exports.render = function (ref, data, locals) {
  var getVideoPromise = data.filter === 'filtered-by-tag' ? getVideosByTags : getMostPopular;
  return getVideoPromise(data, locals).then(function (results) {
    if (results && results.length) {
      return Promise.all( // wait for all articles to process
      results.map(function (articleData) {
        articleData.url = articleData.canonicalUrl; // add page URI for GA tracking

        return recircCmpt.getArticleDataAndValidate(ref, articleData, locals, ELASTIC_FIELDS).then(function (result) {
          return assignToData(articleData, result);
        });
      }));
    }

    return Promise.resolve([]);
  }).then(function (articles) {
    // update results before sending to view
    data.articles = articles;
    return data;
  });
};

}).call(this,require(22),"/components/ooyala-recirc-lede/model.js")}, {"5":5,"22":22,"32":32,"37":37,"39":39,"49":49,"81":81,"87":87,"103":103,"171":171}];
