window.modules["77"] = [function(require,module,exports){(function (process,__filename){
'use strict';

var queryService = require(49),
    escapeStringRegExp = require(558),
    rest = require(5),
    log = require(81).setup({
  file: __filename
}),
    utils = require(43),
    db = require(69),
    amazonProducts = require(1270),
    _require = require(43),
    urlToCanonicalUrl = _require.urlToCanonicalUrl,
    _require2 = require(56),
    isPage = _require2.isPage,
    _get = require(32),
    _uniqBy = require(913),
    _pick = require(174),
    _pickBy = require(59),
    _merge = require(904),
    _min = require(905),
    _set = require(87),
    _cloneDeep = require(47),
    urlParse = require(235).parse,
    randomString = require(917),
    indexName = '*-products',
    queryBody = {
  sort: [{
    // `_index` is the index name, therefore sorting alphabetically desc,
    // will give us `published-products` before `editable-products`
    _index: {
      order: 'desc'
    }
  }, {
    // unpublished/editable products may have instances where products with the same URL have different IDs
    // sorting by creationDate ensures that the same id is always returned before saving published version
    // fifo
    creationDate: {
      order: 'asc'
    }
  }]
},
    productComponentInstancesPath = '/_components/product/instances',
    idCreationTryLimit = 10,
    syncFields = ['productId', 'priceLow', 'salePrice', 'salePercentage', 'offerCode', 'upc'],
    AMAZON_PRODUCT_QUERY_LIMIT = typeof window.process.env.AMZN_PAAPI_LIMIT === 'undefined' ? 10 : window.process.env.AMZN_PAAPI_LIMIT;
/**
 * check our index for an existing product id based off of the product url
 * first check the published-products and then check the editable-products
 * editable-products is required so that we can handle products saved in a page publish batch
 * @param {string} url
 * @param {object} locals
 * @returns {Promise.<string|undefined>}
 */


function getProductIdFromUrl(url, locals) {
  var productIdPath = 'hits.hits[0]._source.productId';
  var query = queryService(indexName, locals);
  query.body = queryBody;
  query.body.query = {
    term: {
      buyUrl: url // returns all products that have matching buyUrl

    }
  };
  return queryService.searchByQueryWithRawResult(query, {
    uniqueKey: "getProductIdFromUrl:".concat(urlToCanonicalUrl(url))
  }, locals, false).then(function (results) {
    return _get(results, productIdPath);
  }).catch(function (err) {
    return log('debug', "product doesn't exist: ".concat(productIdPath), {
      error: err.message
    });
  });
}
/**
 * Zero hits returned means there were no matches
 * @param {object} results - results from elastic search
 * @returns {boolean}
 */


function matchFound(results) {
  return _get(results, 'hits.total', 0) !== 0;
}
/**
 * check to see whether or not a product id exists in the index already
 * first try the published products and then the editable products
 * @param {string} productId
 * @param {object} locals
 * @returns {Promise.<boolean>}
 */


function doesIndexContainId(productId, locals) {
  var query = queryService(indexName, locals);
  query.body = queryBody;
  query.body.query = {
    term: {
      productId: productId
    }
  };
  return queryService.searchByQueryWithRawResult(query, {
    uniqueKey: "doesIndexContainId:".concat(productId)
  }, locals, false).then(matchFound).catch(function (err) {
    return log('debug', "product id doesn't exist: ".concat(productId), {
      error: err.message
    });
  });
}
/**
 * creates a new product component instance and returns its data
 * @param {object} productLink
 * @param {string} productLink.url
 * @param {string} productLink.text
 * @param {object} locals
 * @returns {Promise.<{name: string, buyUrl: string, vendor: string, id: string}>}
 */


function createProduct(productLink, locals) {
  var productData = {
    name: productLink.text,
    buyUrl: productLink.url,
    buyUrlHistory: [productLink.url],
    vendor: 'Amazon' // productId and creationDate are handled by model.js

  };
  return rest.post(utils.getSiteBaseUrl(locals) + productComponentInstancesPath, productData, true).then(function (product) {
    var publishedUri = utils.uriToUrl(product._ref + '@published', locals);
    delete product._ref;
    return rest.put(publishedUri, product, true);
  }).catch(function (err) {
    log('error', "error creating product instance from link ".concat(productLink.url), {
      error: err.message
    });
    throw err; // do not swallow error
  });
}
/**
 * for a given product url, get or create a product id
 * @param {object} product
 * @param {object} locals
 * @returns {[Promise.<{url: string, text: string, productId: string}>]}
 */


function addProductIdToProduct(product, locals) {
  var url = product.url;

  if (url) {
    return getProductIdFromUrl(url, locals).then(function (existingProductIdFromUrl) {
      return existingProductIdFromUrl || createProduct(product, locals).then(function (productData) {
        return productData.productId;
      });
    }).then(function (productId) {
      product.productId = productId;
      return product;
    }).catch(function (e) {
      throw new Error("Error occurred while retrieving product entry from elastic: ".concat(e));
    });
  }

  return product;
}
/**
 * for all of the urls, get or create a product id
 * @param {object} urls - keys are urls and values are the link text
 * @param {object} locals
 * @returns {[Promise.<{url: string, text: string, productId: string}>]}
 */


function mapUrlsToProducts(urls, locals) {
  return Object.keys(urls).map(function (url) {
    var product = {
      url: url,
      text: urls[url],
      productId: '',
      amazonSubtag: ''
    };
    return addProductIdToProduct(product, locals).then(addAmazonSubtagToProduct.bind(null, product, locals));
  });
}
/**
 * checks if the link is pointing to amazon.com and allows for sub-domains
 * @param {string} url
 * @returns {boolean}
 */


function isAmazonUrl(url) {
  var domain = (url.split('://')[1] || '').split('/')[0].toLowerCase();
  return domain.indexOf('amazon.com') === 0 || domain.indexOf('.amazon.com') > 0;
}
/**
 * checks if the link is associated with Narrativ
 * @param {string} url
 * @returns {boolean}
 */


function isNarrativUrl(url) {
  var domain = (url.split('://')[1] || '').split('/')[0].toLowerCase();
  return domain.indexOf('shop-links.co') > -1;
}
/**
 * find all of the amazon links in the text and return link url and link text
 * @param {string} text
 * @returns {object} keys are urls and values are the link text
 */


function reduceToUniqueAmazonUrls(text) {
  // assume `href` is first attribute of anchor
  return text.split('<a href="').reduce(function (urls, anchorFragment) {
    // assume no html tags within anchor text
    // assume href surrounded by quotes, but could have other attributes
    var anchorClose = anchorFragment.indexOf('>'),
        anchor = anchorFragment.substr(0, anchorClose),
        anchorEndQuote = anchor.indexOf('" '),
        url = anchorEndQuote > -1 ? anchor.substr(0, anchorEndQuote) : anchor.substr(0, anchor.length - 1),
        linkText = anchorFragment.substr(anchorClose + 1).split('</a>')[0];

    if (isAmazonUrl(url)) {
      urls[url] = linkText;
    }

    return urls;
  }, {});
}
/**
 * remove ambrose prefix and @published suffix from uri
 * @param {string} uri
 * @returns {string}
 */


function shortenUri(uri) {
  return (uri || '').split('/').pop().replace('ambrose-', 'a-').replace('@published', '');
}
/**
 *
 * @param {object} data
 * @param {object} locals
 * @returns {Promise.<object>}
 */


function addAmazonLinkTrackingAttributes(data, locals) {
  var text = data.text || '',
      urls = reduceToUniqueAmazonUrls(text),
      products = mapUrlsToProducts(urls, locals);
  return Promise.all(products).then(function (products) {
    data.text = products.reduce(function (text, product) {
      var buyUrlWithSubtag = generateBuyUrlWithSubtag(product.url, product.productId, locals),
          productLinksWithoutAttributes = new RegExp("<a href=\"".concat(escapeStringRegExp(product.url), "\"[^>]*"), 'g'),
          productLinkWithAttributes = "<a href=\"".concat(buyUrlWithSubtag, "\" data-track-type=\"product-link\" data-track-id=\"").concat(product.productId, "\"");
      return text.replace(productLinksWithoutAttributes, productLinkWithAttributes);
    }, data.text);
    return data;
  });
}
/**
 * Adds an amazon subtag key-value pair to the product data object
 * @param {object} data
 * @param {object} locals
 * @returns {object}
 */


function addAmazonSubtagToProduct(data, locals) {
  data.amazonSubtag = generateAmazonSubtag(data.productId, locals);
  return data;
}
/**
 * Generate an amazon subtag using productId and locals
 * Note: the key-value pairs appended here are limited to what can be appended server-side,
 * and will be extended clientside by the `amazon` DS service
 * Any changes to the subtag schema should be documented in /_components/product/schema.yml description
 * @param {string} productId
 * @param {object} locals
 * @returns {string}
 */


function generateAmazonSubtag(productId, locals) {
  var siteShortKey = _get(locals, 'site.shortKey'),
      pageUri = _get(locals, 'url'); // nullify pageUri if exists on layout level
  // (instead determine client-side)


  if (pageUri && !isPage(pageUri)) {
    pageUri = null;
  }

  return (siteShortKey ? '[]' + siteShortKey : '') + (pageUri ? '[p]' + shortenUri(pageUri) : '') + (productId ? '[i]' + productId : '');
}
/**
 * Return a matching subtag key for a given product link
 * @param {string} buyUrl
 * @returns {string}
 */


function getSubtagKey(buyUrl) {
  if (isAmazonUrl(buyUrl || '')) {
    return 'ascsubtag';
  } else if (isNarrativUrl(buyUrl || '')) {
    return 'u1';
  }

  return '';
}
/**
 * Generate a buy url with amazon subtag and site tag appended
 * @param {string} buyUrl
 * @param {string} productId
 * @param {object} locals
 * @param {string} [amazonAssociateId] allows for amazon associate id other than standard site id
 * @returns {string}
 */


function generateBuyUrlWithSubtag(buyUrl, productId, locals, amazonAssociateId) {
  var amazonSubtag,
      buyUrlWithSubtag,
      hasSiteTag,
      hasSubtag,
      expr,
      subtagKey = getSubtagKey(buyUrl);

  if (subtagKey) {
    buyUrlWithSubtag = urlParse(buyUrl);
    buyUrlWithSubtag.search = buyUrlWithSubtag.search || '';
    amazonSubtag = generateAmazonSubtag(productId, locals);
    hasSubtag = buyUrlWithSubtag.search.indexOf("".concat(subtagKey, "=")) > -1;
    hasSiteTag = buyUrlWithSubtag.search.match(/[?&]tag=/);
    amazonAssociateId = amazonAssociateId || getSiteAmazonAssociateId(locals);

    if (hasSubtag) {
      // replace user-provided amazon subtag with auto-generated subtag
      expr = new RegExp("".concat(subtagKey, "=[^&]+"));
      buyUrlWithSubtag.search = buyUrlWithSubtag.search.replace(expr, "".concat(subtagKey, "=").concat(amazonSubtag));
    } else {
      // append subtag query param to buy url
      buyUrlWithSubtag.search += (buyUrlWithSubtag.search ? '&' : '?') + "".concat(subtagKey, "=").concat(amazonSubtag);
    }

    if (amazonAssociateId && !hasSiteTag) {
      // append site tag to buy url
      buyUrlWithSubtag.search += '&tag=' + amazonAssociateId;
    }

    return buyUrlWithSubtag.format();
  }

  return '';
}
/**
 * Retrieve amazon site tag from locals
 * @param {object} locals
 * @returns {string}
 */


function getSiteAmazonAssociateId(locals) {
  return _get(locals, 'site.amazon', '');
}
/**
 * Generates a random 6-character id, checks if it exists
 * @param {object} locals
 * @returns {Promise.<string>}
 * @throws throws an error if a unique id cannot be generated after 10 tries
 */


function generateId(locals) {
  var count = 0;

  function tryNewId() {
    var dictionary = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        productId = randomString(dictionary, 6);
    count += 1;

    if (count > idCreationTryLimit) {
      throw new Error("failed to generate unique product id after ".concat(idCreationTryLimit, " tries"));
    }

    return doesIndexContainId(productId, locals).then(function (indexContainsId) {
      return indexContainsId ? tryNewId() : // if true, the product id is used by another product, so try another id
      productId;
    }); // if false, the product id is NOT used by another product, so use the generated one
  }

  return tryNewId();
}
/**
 * Filters input array to contain only unique product instances
 * @param {array} productArray
 * @returns {array}
 */


function removeDuplicateProducts(productArray) {
  var amazonProductDelimiter = '\/(dp|gp\/product)\/',
      amazonDelimiterExp = new RegExp(amazonProductDelimiter),
      amazonProductExp = new RegExp(amazonProductDelimiter + '[^?\/]+'); // filter out products with the same image url

  productArray = _uniqBy(productArray, function (product) {
    return product.imageUrl;
  }); // filter out products with the same name

  productArray = _uniqBy(productArray, function (product) {
    return product.name;
  }); // filter out products with matching amazon product asin IDs
  // (/dp/[asin] or /gp/product/[asin] pattern)

  return _uniqBy(productArray, function (product) {
    var buyUrl = _get(product, 'buyUrl', ''),
        amazonMatch = _get(buyUrl.match(amazonProductExp), '[0]');

    return amazonMatch ? amazonMatch.replace(amazonDelimiterExp, '') : buyUrl;
  });
}
/**
 * Transform data parsed from Amazon Product API query
 * @param {Object} data
 * @returns {Object}
 */


function transformAmazonData(_ref) {
  var listPrice = _ref.listPrice,
      offerPrice = _ref.offerPrice,
      salePrice = _ref.salePrice,
      upc = _ref.upc;
  var saleThreshold = 0; // minimum price difference to be considered on sale

  var priceLow = _min([listPrice, offerPrice, salePrice]) || salePrice || listPrice || offerPrice,
      salePercentage; // apply sales logic

  if (listPrice - priceLow > saleThreshold) {
    salePrice = Math.round(priceLow);
    salePercentage = Math.round(100 * (listPrice - salePrice) / listPrice);
    priceLow = listPrice;
  } else if (listPrice && priceLow) {
    // unset sale price
    salePrice = '';
    salePercentage = '';
  }

  return _pickBy({
    priceLow: priceLow ? Math.round(priceLow) : undefined,
    salePrice: salePrice,
    salePercentage: salePercentage,
    upc: upc
  }, function (item) {
    return typeof item !== 'undefined';
  });
}
/**
 * merges overrideData into data on syncFields
 * @param {string} data
 * @param {string} overrideData
 * @returns {function}
 */


function mergeOnSyncFields(data, overrideData) {
  return _merge(data, _pick(overrideData, syncFields));
}
/**
 * Update product entity in redis
 * @param {string} uri
 * @param {object} originalData
 * @param {object} updateData
 * @returns {function}
 */


function updateProductEntity(uri, originalData, updateData) {
  var saveField = 'preSyncData',
      preSyncData = mergeOnSyncFields({}, originalData);

  if (!updateData.hasOwnProperty(saveField)) {
    updateData[saveField] = preSyncData;
  }

  log('debug', "updating product entity: ".concat(uri), updateData);
  return db.put(uri, JSON.stringify(updateData)).then(function () {
    return updateData;
  }).catch(function () {
    return updateData;
  });
}
/**
 * Either query amazon for most recent price data and merge that to product entity
 * or return existing product entity data from redis
 * @param {object} data
 * @returns {function}
 */


function getEntityData(data) {
  var timeLimit = 1000 * 60 * AMAZON_PRODUCT_QUERY_LIMIT,
      lastQueried = data.lastQueriedAmazon || 0,
      buyUrl = data.buyUrl,
      shouldQueryAmazon = isAmazonUrl(buyUrl) && Date.now() - lastQueried > timeLimit && !data.disableAmazonSync && amazonProducts.meetsCallThreshold();
  return function (productUri) {
    if (!productUri) {
      return Promise.resolve({});
    } // get product entity data


    return db.get(productUri).then(function (entityData) {
      return shouldQueryAmazon ? module.exports.syncDataFromAmazon(entityData, productUri) : entityData;
    }).catch(function () {
      return {};
    });
  };
}
/**
 * Retrieve data from amazon and merge into entityData,
 * and PUT modified data back to redis
 * @param {object} entityData
 * @param {string} productUri
 * @returns {Promise}
 */


function syncDataFromAmazon(entityData, productUri) {
  var buyUrl = entityData.buyUrl;
  amazonProducts.getProductDataFromAmazon(buyUrl).then(function (res) {
    log('debug', "successful amazon call: ".concat(productUri), res);
    return res;
  }).then(transformAmazonData).then(function (data) {
    return mergeOnSyncFields(_cloneDeep(entityData), data);
  }).then(function (data) {
    return _set(data, 'lastQueriedAmazon', Date.now());
  }).then(function (data) {
    return updateProductEntity(productUri, entityData, data);
  }).catch(function (err) {
    // promise is rejected but err is an empty if AMZN_PAAPI_TIMEOUT is 0
    if (err !== 'Amazon Sync Disabled') {
      log('warn', 'Error syncing data from Amazon Product API', {
        error: err.message
      });
    }

    return entityData;
  }); // to avoid stalling page render, allow the promise above to resolve in the background while	
  // returning entityData immediately

  return Promise.resolve(entityData);
}
/**
 * Check our index for a product document based on buyUrl.
 * The last-edited match on buyUrl is considered the canonic entity.
 * Returns the product URI, which is the key needed to get entity data from redis
 * @param {string} url
 * @param {object} locals
 * @returns {Promise.<object|undefined>}
 */


function getProductEntityUri(url, locals) {
  var productUriPath = 'hits.hits[0]._id'; // only match product entity from `published-products` index

  var query = queryService('published-products', locals); // retrieve most recently updated document

  queryService.addSort(query, {
    lastUpdated: 'desc'
  });
  queryService.addMust(query, {
    term: {
      buyUrl: url
    }
  });
  queryService.addSize(query, 1); // Splitting on the url to remove any query params/hash

  return queryService.searchByQueryWithRawResult(query, {
    uniqueKey: "getProductEntityUri:".concat(url)
  }, locals, false).then(function (results) {
    return _get(results, productUriPath) || '';
  }).catch(function (err) {
    log('debug', "product doesn't exist: ".concat(productUriPath), {
      error: err.message
    });
    return '';
  });
}
/**
 * Update select fields in `data` with values obtained for a matching document
 * in the product database
 * @param {object} data
 * @param {object} locals
 * @returns {Promise.<object|undefined>}
 */


function syncDataFromEntity(data, locals) {
  var url = data.buyUrl;

  if (!url) {
    return data;
  }

  return getProductEntityUri(url, locals).then(getEntityData(data)).then(function (res) {
    return _merge(data, _pick(res, syncFields));
  });
}

module.exports.addAmazonLinkTrackingAttributes = addAmazonLinkTrackingAttributes;
module.exports.generateBuyUrlWithSubtag = generateBuyUrlWithSubtag;
module.exports.generateId = generateId;
module.exports.getProductIdFromUrl = getProductIdFromUrl;
module.exports.isAmazonUrl = isAmazonUrl;
module.exports.addProductIdToProduct = addProductIdToProduct;
module.exports.removeDuplicateProducts = removeDuplicateProducts;
module.exports.getEntityData = getEntityData;
module.exports.syncDataFromEntity = syncDataFromEntity;
module.exports.getProductEntityUri = getProductEntityUri;
module.exports.syncDataFromAmazon = syncDataFromAmazon;
module.exports.transformAmazonData = transformAmazonData;
module.exports.updateProductEntity = updateProductEntity;

}).call(this,require(22),"/services/universal/products.js")}, {"5":5,"22":22,"32":32,"43":43,"47":47,"49":49,"56":56,"59":59,"69":69,"81":81,"87":87,"174":174,"235":235,"558":558,"904":904,"905":905,"913":913,"917":917,"1270":1270}];
