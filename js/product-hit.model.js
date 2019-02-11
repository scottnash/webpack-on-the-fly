window.modules["product-hit.model"] = [function(require,module,exports){'use strict';

var productsService = require(77);

module.exports.save = function (uri, data, locals) {
  var product = {
    url: data.buyUrl,
    text: data.title
  };

  if (data.buyUrl) {
    return productsService.addProductIdToProduct(product, locals).then(function (product) {
      data.productId = product.productId;
      return data;
    }).then(function (data) {
      data.buyUrlWithSubtag = productsService.generateBuyUrlWithSubtag(data.buyUrl, data.productId, locals);
      return data;
    });
  }

  ;
  return data;
};
}, {"77":77}];
