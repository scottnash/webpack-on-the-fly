window.modules["product-generator-product.model"] = [function(require,module,exports){'use strict';

var mediaPlay = require(53);

module.exports.save = function (uri, data) {
  if (data.productImage) {
    data.productImage = mediaPlay.getRenditionUrl(data.productImage, {
      w: 220,
      h: 250,
      r: '2x'
    }, false);
  }

  return data;
};
}, {"53":53}];
