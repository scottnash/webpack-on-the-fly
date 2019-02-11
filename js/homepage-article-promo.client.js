window.modules["homepage-article-promo.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    lazyLoad = require(94);

DS.controller('homepage-article-promo', [function () {
  function Constructor(el) {
    var sources = dom.findAll(el, 'source[data-srcset]'),
        img = dom.find(el, 'img[data-src]'),
        wrapper = dom.find(el, '.dynamic-image-wrapper'),
        promoLazyLoader;

    if (!(img && sources && wrapper)) {
      return;
    }

    promoLazyLoader = new lazyLoad.LazyLoader(wrapper, img, sources);
    promoLazyLoader.init();
  }

  ;
  return Constructor;
}]);
}, {"1":1,"94":94}];
