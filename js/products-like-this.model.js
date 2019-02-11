window.modules["products-like-this.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    utils = require(43),
    productsService = require(77),
    _get = require(32),
    _set = require(87),
    _pick = require(174),
    _map = require(37),
    _require = require(56),
    isComponent = _require.isComponent,
    index = 'published-products',
    productIdField = 'productId',
    buyUrlField = 'buyUrl',
    nameField = 'name',
    imgUrlField = 'imageUrl',
    requiredFieldsForItems = [buyUrlField, 'imageUrl', 'imageRendition'],
    fieldsForItems = requiredFieldsForItems.concat([productIdField, nameField, 'suppressSkimLinks', 'imageAlt', 'imageRendition', 'priceOverride', 'priceLow', 'priceHigh', 'vendor']),
    requiredFieldsExistQueries = requiredFieldsForItems.map(function (requiredField) {
  return {
    exists: {
      field: requiredField
    }
  };
}),
    requiredFieldsEmptyStringQueries = requiredFieldsForItems.map(function (requiredField) {
  return {
    term: _set({}, requiredField, '')
  };
}),
    COLORS = ['blue', 'red', 'yellow', 'green', 'black', 'white', 'orange', 'purple'],
    MAXIMUM_PRODUCT_COUNT = 20; // maximum number of products to be queried against in more_like_this

/**
 * adds amazon subtag and associate id to query param of each buy link
 * this component allows for a custom amazon associate ID; therefore this is required
 * if not an amazon link, then the link is copied to buyUrlWithAmazonQuery
 * @param {object} locals
 * @param {object} data
 * @returns {object}
 */


function addAmazonQueryParams(locals, data) {
  data.products = data.products.map(function (product) {
    var productUrl = product[buyUrlField];
    product.buyUrlWithAmazonQuery = productsService.generateBuyUrlWithSubtag(productUrl, product[productIdField], locals, data.amazonId) || productUrl;
    return product;
  });
  return data;
}
/**
 * query elastic search to get products like the products on this article
 * @param {number} size
 * @param {object} data
 * @param {object} locals
 * @param {Array} productsOnThisArticle
 * @returns {Promise.<Array>}
 */


function getProductsLikeThis(size, data, locals, productsOnThisArticle) {
  var query = queryService(index, locals),
      filterByAffiliates = false,
      productIds = productsOnThisArticle.map(function (product) {
    return _pick(product, '_id');
  }).slice(0, MAXIMUM_PRODUCT_COUNT);

  if (!productsOnThisArticle.length) {
    return Promise.resolve([]);
  }

  queryService.addSize(query, size);
  queryService.onlyWithTheseFields(query, fieldsForItems);
  queryService.addShould(query, {
    dis_max: {
      queries: [{
        more_like_this: {
          fields: [nameField],
          like: productIds,
          min_term_freq: 1,
          // words of interest are not expected to occur more than once in name
          max_query_terms: 5,
          // keep low to reduce noise
          min_doc_freq: 2,
          // especially helpful for testing few articles
          boost: 2,
          stop_words: COLORS
        }
      }, {
        more_like_this: {
          fields: ['es_descriptionCombined'],
          like: productIds,
          min_term_freq: 2,
          max_query_terms: 5,
          // keep low to reduce noise
          min_doc_freq: 1,
          // especially helpful for testing few articles
          boost: 1,
          stop_words: COLORS
        }
      }]
    }
  }); // exclude results that have the same productId as the current article
  // NOTE: this has limited filtering efficacy if the index
  // has duplicate entries for a given product

  queryService.addMustNot(query, productsOnThisArticle.map(function (product) {
    return {
      term: _pick(product, productIdField)
    };
  })); // exclude results that have the same buyUrl

  queryService.addMustNot(query, productsOnThisArticle.map(function (product) {
    return {
      term: _pick(product, buyUrlField)
    };
  })); // exclude results that have the same product image url

  queryService.addMustNot(query, productsOnThisArticle.map(function (product) {
    return {
      term: _pick(product, imgUrlField)
    };
  })); // ensure all results have the required fields

  queryService.addMustNot(query, requiredFieldsEmptyStringQueries);
  queryService.addMust(query, requiredFieldsExistQueries); // sometimes we want to display products provided by Amazon

  if (data.showAmazonProducts) {
    filterByAffiliates = true;
    queryService.addShould(query, [{
      wildcard: {
        buyUrl: '*amazon.com*'
      }
    }]);
  } // sometimes we want to display products provided by Narrativ


  if (data.showNarrativProducts) {
    filterByAffiliates = true;
    queryService.addShould(query, [{
      wildcard: {
        buyUrl: '*shop-links.co*'
      }
    }]);
  } // set a minumum number of should statements that should match
  // based on whether any affiliates are selected


  if (filterByAffiliates) {
    queryService.addMinimumShould(query, 2);
  } else {
    // set minimum number of should statements that should match
    // based on the more-like-this query
    queryService.addMinimumShould(query, 1);
  }

  return queryService.searchByQuery(query);
}
/**
 * clear custom field values on save if 'all' is selected
 * @param {object} data
 */


function clearCustom(data) {
  if (data.showAffiliates === 'all') {
    data.showAmazonProducts = false;
    data.showNarrativProducts = false;
  }
}
/**
 * query the product index for products that are on this article
 * NOTE: products are matched by canonicalUrl, and therefore returns
 * no products before the page has been published
 * @param {object} locals
 * @returns {Promise.<[{_id: string, productId: string, buyUrl: string, imageUrl: string, name: string}]>}
 */


function getProductsOnThisArticle(locals) {
  var query = queryService(index, locals);
  queryService.onlyWithTheseFields(query, [productIdField, buyUrlField, imgUrlField]);
  queryService.addSize(query, 100); // retrieve up to 100 products on an article

  queryService.addMust(query, {
    term: {
      canonicalUrl: utils.urlToCanonicalUrl(locals.url)
    }
  });
  return queryService.searchByQueryWithRawResult(query).then(function (productUrisResult) {
    return _get(productUrisResult, 'hits.hits', []).map(function (product) {
      return Object.assign(_pick(product, '_id'), _pick(_get(product, '_source'), [productIdField, buyUrlField, imgUrlField, nameField]));
    });
  });
}
/**
 * set all products to display horizontal image-rendition
 * @param {array} products
 * @returns {array}
 */


function setHorizontalRendition(products) {
  return _map(products, function (product) {
    return _set(product, 'imageRendition', 'horizontal');
  });
}
/**
 * gets products like the one on the article of the current page
 * note: this uses canonicalUrl from locals, so requesting any url other than the canonical url will return different results
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise|object}
 */


function render(ref, data, locals) {
  var size = 5; // return early if request is not for a page, or is edit mode

  if (isComponent(locals.url) || locals.edit) {
    return data;
  }

  return getProductsOnThisArticle(locals).then(function (productsOnThisArticle) {
    return getProductsLikeThis(size * 2, data, locals, productsOnThisArticle);
  }).then(function (productsLikeThis) {
    return productsService.removeDuplicateProducts(productsLikeThis);
  }).then(setHorizontalRendition).then(function (productsLikeThis) {
    data.products = productsLikeThis.slice(0, size);
    return addAmazonQueryParams(locals, data);
  }).catch(function (e) {
    return queryService.logCatch(e, "".concat(ref, ": {e.message}")) || data;
  }); // log es error, but still render component
}

module.exports.save = function (ref, data) {
  clearCustom(data); // if custom is selected but neither amazon or narrativ is checked
  // default showAffilates back to all

  if (data.showAffiliates === 'custom') {
    if (!data.showAmazonProducts && !data.showNarrativProducts) {
      data.showAffiliates = 'all';
    }
  }

  return data;
};

module.exports.render = render;
}, {"32":32,"37":37,"43":43,"49":49,"56":56,"77":77,"87":87,"174":174}];
