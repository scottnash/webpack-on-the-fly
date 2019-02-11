window.modules["clay-paragraph.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    amp = require(76),
    sanitize = require(39),
    productsService = require(77),
    utils = require(43);

module.exports.render = function (ref, data, locals) {
  var renderer = _get(locals, 'params.ext', null);

  if (renderer && renderer === 'amp') {
    data.ampText = amp.sanitizeHtmlForAmp(data.text || '');
  }

  return data;
};

module.exports.save = function (ref, data, locals) {
  data.text = sanitize.validateTagContent(sanitize.toSmartText(data.text || ''));
  data.ampText = amp.sanitizeHtmlForAmp(data.text || ''); // only add the inline product link attributes on publish
  // this ensures that kiln never sees the data-attributes
  // also improves the editing experience by only checking for links on publish, not on save

  if (utils.isPublishedVersion(ref)) {
    return productsService.addAmazonLinkTrackingAttributes(data, locals);
  } else {
    return data;
  }
};
}, {"32":32,"39":39,"43":43,"76":76,"77":77}];
