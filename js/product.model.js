window.modules["product.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var striptags = require(42),
    _includes = require(33),
    _isString = require(164),
    _get = require(32),
    _head = require(25),
    _intersection = require(173),
    _map = require(37),
    _filter = require(51),
    _assign = require(57),
    _pickBy = require(59),
    _has = require(105),
    mediaPlay = require(53),
    productsService = require(77),
    rest = require(5),
    sanitize = require(39),
    utils = require(43),
    queryService = require(49),
    log = require(81).setup({
  file: __filename,
  action: 'product'
});
/**
 * removes html tags froms strings
 * @param {string} text
 * @param {array} allowTags
 * @returns {string}
 */


function cleanText(text, allowTags) {
  var allowedTags = ['strong', 'em', 'a', 'i'];
  return sanitize.toSmartText(striptags(text, allowTags ? allowedTags : []));
}
/**
 * removes empty paragraphs
 * @param  {object} description
 * @param {string} uri
 * @param {string} variation
 * @returns {Promise}
 */


function removeEmptyParagraphs(description, uri, variation) {
  if (variation !== 'product_mini') return description;
  return rest.get(utils.uriToUrl(uri + '.json')).then(function (resp) {
    var validComponents = _map(resp.description, function (data) {
      var ref = data._ref,
          isClayParagraph = ref && ref.indexOf('/clay-paragraph/') > -1;
      if (isClayParagraph ? !!data.text : true) return ref;
    });

    return _filter(description, function (data) {
      return validComponents.indexOf(data._ref) > -1;
    });
  }).catch(function () {
    return description;
  });
}

;
/**
 * sanitizes text labels and pads prices
 * @param {object} data
 */

function updateText(data) {
  // all text labels (except for image captions) are stripped of html tags
  _assign(data, _pickBy({
    name: cleanText(data.name, true),
    vendor: cleanText(data.vendor, false),
    imageCaption: cleanText(data.imageCaption, true),
    imageCreditOverride: cleanText(data.imageCreditOverride, true)
  }, Boolean));
}
/**
 * sets product image rendition
 * @param {object} data
 */


function updateImage(data) {
  if (!utils.isFieldEmpty(data.imageUrl)) {
    if (utils.isFieldEmpty(data.imageRendition)) {
      data.imageRendition = 'horizontal';
    }

    data.imageUrl = mediaPlay.getRendition(data.imageUrl, data.imageRendition);
  }
}
/**
 * sets product images credit and caption
 * @param {object} data
 * @returns {Promise}
 */


function updateImageMetadata(data) {
  return mediaPlay.getMediaplayMetadata(data.imageUrl).then(function (metadata) {
    try {
      var renditionDimensions = mediaPlay.getCalculatedRenditionDimensionsFromMetadata(data.imageRendition, metadata);
      data.imageRenditionWidth = renditionDimensions.width;
      data.imageRenditionHeight = renditionDimensions.height;
    } catch (err) {
      log('error', 'Failed to Calculate Rendition Width/Height for Product Image', {
        message: err.message,
        uri: data.uri,
        rendition: data.imageRendition
      });
      data.imageRenditionWidth = null;
      data.imageRenditionHeight = null;
    }

    data.imageType = metadata.imageType;

    if (_isString(data.imageCreditOverride) && !utils.isFieldEmpty(data.imageCreditOverride)) {
      data.imageCredit = data.imageCreditOverride;
    } else {
      data.imageCredit = metadata.credit;
    }

    return data;
  });
}
/**
 * Appends newly added unique buy urls to the buyUrlHistory property
 * We look to the published version for the buyUrlHistory,
 * because there is no reason to store all of the url's entered in edit mode
 * @param  {object} data
 * @param  {object} prevPublishedData
 * @return {{buyUrlHistory: Array}}
 */


function updateBuyUrlHistory(data, prevPublishedData) {
  var buyUrl = data.buyUrl;
  data.buyUrlHistory = prevPublishedData.buyUrlHistory || [];

  if (buyUrl && !_includes(data.buyUrlHistory, buyUrl)) {
    data.buyUrlHistory.push(buyUrl);
  }

  return data;
}
/**
 * adds a product id on publish if it does not already exist
 * @param  {object} data
 * @param  {object} prevPublishedData
 * @param  {object} locals
 * @return {Promise.<object>}
 */


function updateProductId(data, prevPublishedData, locals) {
  var previousBuyUrl = _get(prevPublishedData, 'buyUrl'),
      newBuyUrl = _get(data, 'buyUrl');

  if (previousBuyUrl === newBuyUrl) {
    // the buyUrl has not changed, so do not update productId
    data.productId = prevPublishedData.productId;
    return Promise.resolve(data);
  }

  if (!data.buyUrl) {
    // there is no buyUrl, so do not attempt to set the productId
    return Promise.resolve(data);
  } // get the id based on the buyUrl


  return productsService.getProductIdFromUrl(data.buyUrl, locals).then(function (idFromUrl) {
    return idFromUrl || productsService.generateId(locals);
  }).then(function (productId) {
    data.productId = productId;
    return data;
  });
}
/**
 * creationDate should be set the first time a product id is created
 * creationDate should be reset the first time it is published
 * once creationDate is set on the published version, it should not change
 * @param {string} uri
 * @param {object} data
 * @param {object} prevPublishedData
 * @returns {object}
 */


function setCreationDate(uri, data, prevPublishedData) {
  var isNewEditableProductId = data.productId && !data.creationDate,
      buyUrlChanged = prevPublishedData.buyUrl && data.buyUrl !== prevPublishedData.buyUrl; // do not change the published creation date if buyUrl has not been changed

  if (prevPublishedData.creationDate && !buyUrlChanged) {
    data.creationDate = prevPublishedData.creationDate;
  } else if (isNewEditableProductId || utils.isPublishedVersion(uri) || buyUrlChanged) {
    data.creationDate = Date.now(); // UTC
  }

  return data;
}
/**
 * set the canonical url from the locals
 * @param {object} data
 * @param {object} locals
 */


function setCanonicalUrl(data, locals) {
  if (_get(locals, 'publishUrl')) {
    data.canonicalUrl = locals.publishUrl;
  }
}
/**
 * set sale percentage (discount off original price)
 * @param {object} data
 */


function setSalePercentage(data) {
  var salePercentage;

  if (!data.salePrice || !parseInt(data.salePrice)) {
    data.salePercentage = '';
    return;
  }

  salePercentage = Math.round(100 - 100 * Math.round(parseFloat(data.salePrice)) / Math.round(parseFloat(data.priceLow)));

  if (salePercentage > 0 && salePercentage < 100) {
    data.salePercentage = salePercentage;
  } else {
    data.salePrice = '';
    data.salePercentage = '';
  }
}
/**
 * clear the value of the priceOverride property with the original or sale price
 * @param {object} data
 * @param {object} prevPublishedData
 */


function removePriceOverride(data, prevPublishedData) {
  if (!!data.priceOverride && data.priceLow) {
    if (data.priceLow !== prevPublishedData.priceLow || data.salePrice !== prevPublishedData.salePrice) {
      data.priceOverride = '';
    }
  }
}

function updateProductData(uri, data, locals) {
  return rest.get(utils.uriToUrl(utils.ensurePublishedVersion(uri), locals)) // it is ok if published version does not exist yet
  .catch(function () {
    return {};
  }).then(function (prevPublishedData) {
    updateBuyUrlHistory(data, prevPublishedData);
    removePriceOverride(data, prevPublishedData);
    return updateProductId(data, prevPublishedData, locals).then(function (data) {
      return setCreationDate(uri, data, prevPublishedData);
    });
  }).then(updateImageMetadata).then(function (data) {
    data.buyUrlWithSubtag = productsService.generateBuyUrlWithSubtag(data.buyUrl, data.productId, locals);

    if (data.buyUrl2) {
      data.buyUrlWithSubtag2 = productsService.generateBuyUrlWithSubtag(data.buyUrl2, data.productId, locals);
    }

    return data;
  });
}

function checkForVendorMatch(data) {
  if (_includes(data.buyUrl, 'amazon.com')) {
    data.vendor = 'Amazon';
  } else if (data.vendor === 'Amazon') {
    data.vendor = '';
  }

  return data;
}
/**
 * @param  {string} url
 * @param  {object} locals
 * @return {Promise}
 */


function getArticleTags(url, locals) {
  var query = queryService.onePublishedArticleByUrl(url, ['tags'], locals);
  return queryService.searchByQuery(query).catch(function () {
    return [];
  }).then(function (result) {
    var headResult = _head(result);

    return headResult && headResult.tags ? headResult.tags : [];
  });
}
/**
 * Only show a Narrativ buy button if the product's vendor is Amazon
 * @param {string} vendor
 * @returns {boolean}
 */


function checkVendorForNarrativBuyButton(vendor) {
  return _isString(vendor) && vendor.toLowerCase() === 'amazon';
}
/**
 * Only show a Narrativ buy button if none of our tags to exclude
 * are found within the article/page's tags
 * @param {array} tags
 * @returns {boolean}
 */


function checkPageTagsForNarrativBuyButton(tags) {
  var tagsToExclude = ['sales sales sales', 'deal of the day', 'amazon', 'printed matter', "people's choice"];
  return _intersection(tags, tagsToExclude).length === 0;
}
/**
 * Set showNarrativBuyButton property based on vendor and tags
 * @param {string} localUrl
 * @param {object} locals
 * @param {object} data
 * @returns {Promise}
 */


function setShowNarrativBuyButton(localUrl, locals, data) {
  return getArticleTags(localUrl, locals).then(function (tags) {
    // set property to show second buy button (for Narrativ)
    data.showNarrativBuyButton = checkVendorForNarrativBuyButton(data.vendor) && checkPageTagsForNarrativBuyButton(tags);
    return data;
  });
}
/**
 * Activates validation requirements for second buy button
 * @param {object} data
 */


function setSecondBuyButtonValidation(data) {
  if (data.priceLow2 || data.vendor2 || data.buyUrl2) {
    data.setSecondBuyButton = true;
  } else {
    data.setSecondBuyButton = false;
  }
}
/**
 * updates disableAmazonSync property based on dealOfTheDay and sets the expiration date
 * @param {object} data
 */


function updateSyncAndSetExpiration(data) {
  var expirationDate;

  if (data.dealOfTheDay) {
    expirationDate = new Date(); // if deal of the day is true, set amazon sync to true

    data.disableAmazonSync = true; // set the expiration date to 3am the next day per amazon deal of the day specifications

    expirationDate.setHours(0, 0, 0, 0);
    expirationDate.setDate(expirationDate.getDate() + 1);
    expirationDate.setHours(expirationDate.getHours() + 3);
    data.dealOfTheDayExpiration = expirationDate;
  } else if (data.dealOfTheDayExpiration) {
    delete data.dealOfTheDayExpiration;
  }
}
/**
 * Checks for dealOfTheDay and if current date is beyond the expiration date, set AmazonSync and dealOfTheDay to false
 * @param {object} data
 */


function checkDealOfTheDayExpiration(data) {
  var currDate, dealOfTheDayExpirationDate;

  if (_has(data, 'dealOfTheDayExpiration')) {
    currDate = new Date(), dealOfTheDayExpirationDate = new Date(data.dealOfTheDayExpiration);

    if (currDate > dealOfTheDayExpirationDate) {
      data.disableAmazonSync = false;
      data.dealOfTheDay = false;
    }
  }
}

module.exports.render = function (uri, data, locals) {
  var localUrl = locals.url,
      isPublishedInstance = utils.isPublishedVersion(uri),
      isBeingPublished = !!_get(locals, 'publishUrl');
  checkDealOfTheDayExpiration(data); // `isBeingPublished` and `isPublishedInstance` are both true when
  // component render is called during the page publishing chain

  if (!localUrl || isBeingPublished || !isPublishedInstance) {
    return data;
  }

  localUrl = utils.urlToCanonicalUrl(localUrl);
  return Promise.all([setShowNarrativBuyButton(localUrl, locals, data), productsService.syncDataFromEntity(data, locals)]).then(function () {
    return data;
  }).catch(function () {
    return data;
  });
};

module.exports.save = function (uri, data, locals) {
  var isBeingPublished = !!_get(locals, 'publishUrl');
  setSecondBuyButtonValidation(data); // only do this stuff for component instances not for component base

  if (utils.isInstance(uri)) {
    updateText(data);
    setSalePercentage(data);
    updateImage(data);
    setCanonicalUrl(data, locals);
    updateSyncAndSetExpiration(data);
    checkForVendorMatch(data);

    if (isBeingPublished) {
      return updateProductData(uri, data, locals);
    } else {
      return Promise.all([updateProductData(uri, data, locals), removeEmptyParagraphs(data.description, uri, data.componentVariation)]).then(function (res) {
        if (res[0].description) res[0].description = res[1];
        return res[0];
      });
    }
  }

  return data;
}; // For testing


module.exports.checkVendorForNarrativBuyButton = checkVendorForNarrativBuyButton;
module.exports.checkForVendorMatch = checkForVendorMatch;
module.exports.checkPageTagsForNarrativBuyButton = checkPageTagsForNarrativBuyButton;
module.exports.removeEmptyParagraphs = removeEmptyParagraphs;
module.exports.checkDealOfTheDayExpiration = checkDealOfTheDayExpiration;

}).call(this,"/components/product/model.js")}, {"5":5,"25":25,"32":32,"33":33,"37":37,"39":39,"42":42,"43":43,"49":49,"51":51,"53":53,"57":57,"59":59,"77":77,"81":81,"105":105,"164":164,"173":173}];
