window.modules["circulation-newsletter.model"] = [function(require,module,exports){'use strict';

var _require = require(43),
    has = _require.has,
    _require2 = require(55),
    getPrevData = _require2.getPrevData,
    getPublishedData = _require2.getPublishedData,
    setSlugAndLock = _require2.setSlugAndLock,
    promises = require(46),
    _require3 = require(39),
    toSmartText = _require3.toSmartText;
/**
 * Sanitizes curly quotes, dashes, and ellipses inputs
 * @param {object} data
 */


function sanitizeInputs(data) {
  if (has(data.previewText)) data.previewText = toSmartText(data.previewText);
  if (has(data.subject)) data.subject = toSmartText(data.subject);
}
/**
 * Sets the SEO headline from the campaign name.
 * This is mainly to better handle the slug function in the circulation service.
 * @param {object} data
 */


function setSeoHeadline(data) {
  if (has(data.campaignName)) data.seoHeadline = data.campaignName;
}

;
/**
 * Formats the page title that appears in the kiln menu.
 * @param {object} data
 */

function formatPageTitle(data) {
  if (has(data.campaignName)) data.pageTitle = "Newsletter: ".concat(data.campaignName);
}

;

module.exports.save = function (uri, data, locals) {
  sanitizeInputs(data);
  setSeoHeadline(data);
  formatPageTitle(data);
  return promises.props({
    prevData: getPrevData(uri, data, locals),
    publishedData: getPublishedData(uri, data, locals)
  }).then(function (resolved) {
    setSlugAndLock(data, resolved.prevData, resolved.publishedData);
    return data;
  });
}; // Exposed for testing


module.exports.setSeoHeadline = setSeoHeadline;
module.exports.sanitizeInputs = sanitizeInputs;
module.exports.formatPageTitle = formatPageTitle;
}, {"39":39,"43":43,"46":46,"55":55}];
