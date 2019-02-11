window.modules["pubexchange.model"] = [function(require,module,exports){'use strict';

var _values = require(60),
    rest = require(5),
    utils = require(43),
    cachePromise = require(175),
    PUB_EXCHANGE_ENDPOINT = 'https://cdn2.pubexchange.com/json/',
    CACHE_TTL = 1000 * 60 * 30; // 30 minutes


var cachedGetArticles = cachePromise.init(getArticles, CACHE_TTL);
/**
 * grab articles from the PubExchange API
 * @param {string} apiPath - the path that appends the PubExchange API url
 * @returns {array}
 */

function getArticles(apiPath) {
  var requestUrl = PUB_EXCHANGE_ENDPOINT + apiPath;
  return rest.get(requestUrl).then(function (res) {
    return res.external.partners.map(getArticle);
  }).catch(function () {
    return [];
  });
}

;
/**
 * From a partner object as it appears in the PubExchange API response,
 * derive an article object to be stored in this component.
 * @param {object} partner
 * @returns {object}
 */

function getArticle(partner) {
  var article = _values(partner.articles)[0];

  article.publication_name = partner.name;
  return article;
}

module.exports.render = function (ref, data, locals) {
  if (locals && locals.edit || data.disabled) {
    data.articles = [];
    return data;
  }

  return cachedGetArticles(data.apiPath).then(function (articles) {
    // Truncate articles in excess of articleNumber
    if (utils.has(data.articleNumber)) {
      data.articles = articles.slice(0, data.articleNumber);
    } else {
      data.articles = articles;
    }

    return data;
  });
};

module.exports.save = function (ref, data) {
  return data;
}; // for testing only; allows resetting cache


module.exports.clearCache = function () {
  cachedGetArticles = cachePromise.init(getArticles, CACHE_TTL);
};
}, {"5":5,"43":43,"60":60,"175":175}];
