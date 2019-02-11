window.modules["flip-card-shoppable.model"] = [function(require,module,exports){'use strict';

var productsService = require(77),
    mediaPlay = require(53);

module.exports.save = function (uri, data, locals) {
  var product = {
    url: data.shopNowURL,
    text: data.productName
  };

  if (data.mobileFrontImage) {
    data.mobileFrontImage = mediaPlay.getRenditionUrl(data.mobileFrontImage, {
      w: 137,
      h: 213,
      r: '2x'
    }, false);
  }

  if (data.frontImage) {
    data.frontImage = mediaPlay.getRenditionUrl(data.frontImage, {
      w: 200,
      h: 200,
      r: '2x'
    }, false);
  }

  if (data.backImage) {
    data.backImage = mediaPlay.getRenditionUrl(data.backImage, {
      w: 96,
      h: 96,
      r: '2x'
    }, true);
  }

  if (data.shopNowURL) {
    return productsService.addProductIdToProduct(product, locals).then(function (product) {
      data.productId = product.productId;
      return data;
    }).then(function (data) {
      data.buyUrlWithSubtag = productsService.generateBuyUrlWithSubtag(data.shopNowURL, data.productId, locals);
      return data;
    });
  }

  return data;
};
}, {"53":53,"77":77}];
