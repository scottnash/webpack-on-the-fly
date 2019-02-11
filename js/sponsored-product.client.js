window.modules["sponsored-product.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _forEach = require(27),
    productLinks = require(191);

module.exports = function (el) {
  var links = dom.findAll(el, '.product-buy-link');

  _forEach(links, productLinks.initLink);
};
}, {"1":1,"27":27,"191":191}];
