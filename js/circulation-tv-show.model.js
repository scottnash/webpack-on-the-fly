window.modules["circulation-tv-show.model"] = [function(require,module,exports){'use strict';

var _flowRight = require(72),
    striptags = require(42),
    _require = require(55),
    getPrevData = _require.getPrevData,
    getPublishedData = _require.getPublishedData,
    setSlugAndLock = _require.setSlugAndLock,
    stripHeadlineTags = _require.stripHeadlineTags,
    promises = require(46),
    sanitize = require(39),
    _require2 = require(43),
    has = _require2.has,
    isFieldEmpty = _require2.isFieldEmpty;
/**
 * Sets pageTitle property if there is an available headline.
 * @param {object} data
 * @param {object} locals
 */


function setPageTitle(data) {
  var availableHeadline = data.seoHeadline || data.primaryHeadline;

  if (availableHeadline) {
    // published to pageTitle
    data.pageTitle = sanitize.toPlainText(availableHeadline);
  }
}
/**
 * Overrides the primary headline from the overrideHeadline
 * if the primary headline is empty and the overrideHeadline is less than 80 characters.
 * @param {object} data
 */


function overridePrimaryHeadline(data) {
  if (isFieldEmpty(data.primaryHeadline) && has(data.overrideHeadline) && data.overrideHeadline.length < 80) {
    // note: this happens AFTER overrideHeadline is sanitized
    data.primaryHeadline = data.overrideHeadline;
  }
}
/**
 * Publishes plaintextPrimaryHeadline prop if there is a primary headline.
 * @param {object} data
 */


function setPlainTextPrimaryHeadline(data) {
  if (has(data.primaryHeadline)) {
    // published to ogTitle and pageListTitle
    data.plaintextPrimaryHeadline = sanitize.toPlainText(data.primaryHeadline);
  }
}
/**
 * Generates plaintext twitterTitle on every save.
 * @param {object} data
 */


function setPlaintextShortHeadline(data) {
  if (has(data.shortHeadline)) {
    // published to twitterTitle
    data.plaintextShortHeadline = sanitize.toPlainText(data.shortHeadline);
  }
}
/**
 * Sanitizes headlines.
 * @param {object} data
 */


function sanitizeHeadlines(data) {
  var smartHeadlineSanitizer = _flowRight(sanitize.toSmartHeadline, stripHeadlineTags),
      headlinesSanitizeResolver = {
    primaryHeadline: smartHeadlineSanitizer,
    shortHeadline: smartHeadlineSanitizer,
    overrideHeadline: smartHeadlineSanitizer,
    seoHeadline: _flowRight(sanitize.toSmartHeadline, striptags),
    teaser: _flowRight(sanitize.toSmartText, stripHeadlineTags),
    seoDescription: _flowRight(sanitize.toSmartText, striptags)
  };

  Object.keys(headlinesSanitizeResolver).filter(function (prop) {
    return has(data[prop]);
  }).forEach(function (prop) {
    data[prop] = headlinesSanitizeResolver[prop](data[prop]);
  });
}

module.exports.save = function (uri, data, locals) {
  sanitizeHeadlines(data);
  setPlainTextPrimaryHeadline(data);
  setPlaintextShortHeadline(data);
  overridePrimaryHeadline(data);
  setPageTitle(data, locals);
  return promises.props({
    prevData: getPrevData(uri, data, locals),
    publishedData: getPublishedData(uri, data, locals)
  }).then(function (resolved) {
    setSlugAndLock(data, resolved.prevData, resolved.publishedData);
    return data;
  });
}; // Exposed for testing


module.exports.sanitizeHeadlines = sanitizeHeadlines;
module.exports.overridePrimaryHeadline = overridePrimaryHeadline;
module.exports.setPlaintextShortHeadline = setPlaintextShortHeadline;
}, {"39":39,"42":42,"43":43,"46":46,"55":55,"72":72}];
