window.modules["gtm-page.model"] = [function(require,module,exports){'use strict';

var gtm = require(120),
    _get = require(32),
    _require = require(43),
    isPublishedVersion = _require.isPublishedVersion;
/**
 *
 * @param {string} uri
 * @param {object} data
 * @param {object} [locals]
 * @returns {object}
 */


module.exports.save = function (uri, data, locals) {
  // when first published, date is often only in locals
  data.publishDate = data.publishDate || _get(locals, 'date'); // transform logic in a service so that gtm-page plugin can also call on it

  gtm.transformPageData(data); // ensure pageUri is @published version since kiln only sees the versionless pageUri.

  if (isPublishedVersion(uri) && data.pageUri) {
    data.pageUri += '@published';
  }

  return data;
};
}, {"32":32,"43":43,"120":120}];
