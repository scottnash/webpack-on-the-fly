window.modules["ooyala-recirc.model"] = [function(require,module,exports){(function (process){
'use strict';

var _get = require(32),
    // _isEmpty = require('lodash/isEmpty'),
_lowerCase = require(172),
    _map = require(37),
    _set = require(87),
    toPlainText = require(39).toPlainText,
    querystring = require(171),
    queryService = require(49),
    rest = require(5),
    recircCmpt = require(103),
    videoServiceUrl = "".concat(window.process.env.VIDEO_FEED, "/popular"),
    index = 'original-videos-all',
    ELASTIC_FIELDS = ['pageUri'];
/**
 * translate UI labels from radio button options to related site values found in indexes and document stores
 * some labels, like `vulture`, do not require translation
 * @param {object} data
 * @returns {object}
 */


function setSiteFromSiteLabel(data) {
  var siteLabelsToSites = {
    'daily intelligencer': 'di',
    'grub street': 'grubstreet',
    'science of us': 'scienceofus',
    'select all': 'selectall',
    'the cut': 'wwwthecut'
  };
  data.site = siteLabelsToSites[data.siteLabel] || data.siteLabel;
  return data;
}
/**
 * calculate display count total based on number of rows and items per row
 * @param {object} data
 * @param {number} factor
 * @param {int} [minCount]
 * @returns {number}
 */


function getCount(data) {
  var linksPerRow = _get(data, 'linksPerRow', 1),
      rowCount = _get(data, 'rowCount', 1);

  return Math.ceil(linksPerRow * rowCount);
}
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
 * @returns {object}
 */


function getMostPopular(data) {
  var params = {
    count: getCount(data)
  }; // if (window.process.env.ELASTIC_PREFIX && !_isEmpty(window.process.env.ELASTIC_PREFIX)) {
  //  params.prefix = window.process.env.ELASTIC_PREFIX;
  // }

  return rest.get("".concat(videoServiceUrl, "?").concat(querystring.stringify(params)), {
    timeout: 4000
  }).then(function (items) {
    data.articles = _map(items, function (item) {
      return {
        primaryHeadline: item.primaryHeadline,
        canonicalUrl: item.canonicalUrl,
        feedImgUrl: item.feedImgUrl
      };
    });
    return data;
  }).catch(function () {
    return data;
  });
}
/**
 * gather a set of links for the the most recently published video pages for a site
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function getLatestBySite(data, locals) {
  var count = getCount(data);
  var query = queryService.newQueryWithCount(index, count, locals);
  queryService.addFilter(query, {
    term: {
      site: data.site
    }
  });
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQuery(query).then(function (results) {
    data.articles = results;
    return data;
  });
}

module.exports.save = function (ref, data) {
  data = setSiteFromSiteLabel(data);
  return Promise.resolve(data); // returning with a Promise for easier testing
};

module.exports.render = function (ref, data, locals) {
  var recircData = _lowerCase(_get(data, 'site', 'most popular')) === 'most popular' ? getMostPopular(data) : getLatestBySite(data, locals);
  return recircData.then(function () {
    var results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      articles: []
    };
    return Promise.all( // wait for all articles to process
    results.articles.map(function (articleData) {
      articleData.url = articleData.canonicalUrl; // add page URI for GA tracking

      return recircCmpt.getArticleDataAndValidate(ref, articleData, locals, ELASTIC_FIELDS).then(function (result) {
        return assignToData(articleData, result);
      });
    }));
  }).then(function (articles) {
    // update results before sending to view
    data.articles = articles;
    return data;
  });
};

}).call(this,require(22))}, {"5":5,"22":22,"32":32,"37":37,"39":39,"49":49,"87":87,"103":103,"171":171,"172":172}];
