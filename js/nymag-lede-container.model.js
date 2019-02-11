window.modules["nymag-lede-container.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data) {
  data.styleVariation = data.componentVariation || 'nymag-lede-container'; // // don't allow more than 3 articles on the default variation

  if (data.componentVariation === 'nymag-lede-container' && data.manualArticles.length > 3) {
    data.manualArticles = data.manualArticles.slice(0, 3);
  }

  return data;
};
}, {}];
