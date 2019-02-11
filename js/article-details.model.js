window.modules["article-details.model"] = [function(require,module,exports){'use strict';

module.exports.render = function (ref, data) {
  var variation;

  if (!data.componentVariation) {
    return;
  }

  variation = data.componentVariation.replace('article-details', '');
  data.hasPhoto = variation === '_author' || variation.indexOf('logo') > -1;
  return data;
};
}, {}];
