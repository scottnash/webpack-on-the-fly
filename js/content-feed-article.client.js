window.modules["content-feed-article.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    lazyLoad = require(94);

DS.controller('content-feed-article', [function () {
  function Constructor(el) {
    var sources = dom.findAll(el, 'source[data-srcset]'),
        img = dom.find(el, 'img[data-src]'),
        wrapper = dom.find(el, '.dynamic-image-wrapper'),
        lazyLoader;

    if (!(img && sources && wrapper)) {
      return;
    }

    lazyLoader = new lazyLoad.LazyLoader(wrapper, img, sources);
    lazyLoader.init();
  }

  ;
  return Constructor;
}]);
}, {"1":1,"94":94}];
