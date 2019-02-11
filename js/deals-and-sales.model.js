window.modules["deals-and-sales.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    db = require(69),
    _has = require(105),
    _get = require(32),
    tagToExclude = 'expired sale',
    siteToInclude = 'strategist';

function getDealsAndSalesArticle(tagToFind) {
  var query = queryService.newQueryWithCount('published-content', 1);
  queryService.addMust(query, {
    term: {
      tags: tagToFind
    }
  });
  queryService.addMust(query, {
    term: {
      site: siteToInclude
    }
  });
  queryService.addMustNot(query, {
    term: {
      tags: tagToExclude
    }
  });
  queryService.addSort(query, {
    publishDate: 'desc'
  });
  return queryService.searchByQuery(query);
}

function populateDealsAndSalesProduct(article, data, uri) {
  var expirationDate = new Date(),
      components = _get(article, 'content', []);

  var product = components.reduce(function (accumulator, data) {
    var isClayProduct = data.ref && data.ref.indexOf('/product/') > -1;

    if (isClayProduct) {
      var productData = JSON.parse(data.data),
          buyUrl = productData.buyUrl,
          price = productData.priceLow,
          imageUrl = productData.imageUrl || article.feedImgUrl;

      if (buyUrl && imageUrl && price) {
        accumulator.push(JSON.parse(data.data));
      }
    }

    return accumulator;
  }, []);
  expirationDate.setHours(3, 0, 0);
  expirationDate.setDate(expirationDate.getDate() + 1);

  if (product.length) {
    data.products = product.slice(0, 4);
    data.shortHeadline = article.shortHeadline;
    data.feedImgUrl = article.feedImgUrl;
    data.productExpiration = expirationDate;
    data.publishDate = article.publishDate;
    data.canonicalUrl = article.canonicalUrl;
    data.showDeal = true;
    return db.put(uri, data);
  } else {
    return Promise.resolve(data);
  }
}

module.exports.render = function (uri, data) {
  var currDate = new Date(),
      previousExpirationDate = new Date(),
      variation = data.componentVariation || 'deals-and-sales',
      tagToFind = variation.includes('micro-sales') ? 'micro sales' : 'deal of the day',
      variationChanged = data.rubric !== tagToFind;
  previousExpirationDate.setHours(3, 0, 0);
  return getDealsAndSalesArticle(tagToFind).then(function (result) {
    var article = result[0];

    if (_has(data, 'productExpiration')) {
      var newPubDate = new Date(article.publishDate),
          oldPubDate = new Date(data.publishDate) || new Date(article.date),
          productExpiration = new Date(data.productExpiration); // if article.publishDate is newer than publishDate on component and it is newer than 3am today, update and render component

      if (newPubDate > oldPubDate && newPubDate > previousExpirationDate || variationChanged) {
        // replace product with new product
        data.rubric = tagToFind;
        return populateDealsAndSalesProduct(article, data, uri);
      } else if (currDate > productExpiration || newPubDate < oldPubDate) {
        // hide deal
        data.showDeal = false;
        return data;
      } else {
        return data;
      }
    } else {
      return populateDealsAndSalesProduct(article, data, uri);
    }
  }).catch(function (e) {
    return queryService.logCatch(e, "".concat(uri, ": ").concat(e.message)) || data;
  }); // log es error, but still render component
};

module.exports.populateDealsAndSalesProduct = populateDealsAndSalesProduct;
}, {"32":32,"49":49,"69":69,"105":105}];
