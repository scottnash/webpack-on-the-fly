window.modules["newsletter-paragraph.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    productsService = require(77),
    utils = require(43);

module.exports.save = function (ref, data, locals) {
  data.text = sanitize.validateTagContent(sanitize.toSmartText(data.text || '')); // only add the inline product link attributes on publish
  // this ensures that kiln never sees the data-attributes
  // also improves the editing experience by only checking for links on publish, not on save

  return utils.isPublishedVersion(ref) ? productsService.addAmazonLinkTrackingAttributes(data, locals) : data;
};
}, {"39":39,"43":43,"77":77}];
