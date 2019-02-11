window.modules["homepage-article-bar.model"] = [function(require,module,exports){'use strict';

var mediaplay = require(53),
    cuneiformCmpt = require(95),
    _cloneDeep = require(47);

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals); // Warning: Never mutate objects in cuneiformResults. If you do, Cuneiform will
  // think the results are outdated and issue unnecessary PUTs

  data.articles = (data.cuneiformResults ? _cloneDeep(data.cuneiformResults) : data.articles) || [];
  data.articles.forEach(function (article) {
    if (article.feedImgUrl) {
      article.feedImgUrl = mediaplay.getRendition(article.feedImgUrl, 'homepage-article-bar');
    }
  });
  return data;
};

module.exports.render = cuneiformCmpt.render;
}, {"47":47,"53":53,"95":95}];
