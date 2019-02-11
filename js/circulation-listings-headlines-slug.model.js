window.modules["circulation-listings-headlines-slug.model"] = [function(require,module,exports){'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _flowRight = require(72),
    _get = require(32),
    striptags = require(42),
    _require = require(55),
    getPrevData = _require.getPrevData,
    getPublishedData = _require.getPublishedData,
    setSlugAndLock = _require.setSlugAndLock,
    stripHeadlineTags = _require.stripHeadlineTags,
    sanitize = require(39),
    _require2 = require(43),
    has = _require2.has,
    _require3 = require(73),
    encode = _require3.encode,
    rest = require(5);
/**
 * Checks if the slug is already being used.
 * @param {Object} data
 * @param {Object} locals
 * @returns {Promise}
 */


function isSlugAvailable(data, locals) {
  data.slugMessage = data.slug;

  if (has(data.listingType) && has(data.slug)) {
    var host = _get(locals, 'site.host'),
        uri = "http://".concat(host, "/_uris/").concat(encode("".concat(host, "/listings/").concat(data.listingType, "/").concat(data.slug, ".html")));

    return rest.getHTML(uri).then(function () {
      // if it finds it, then the slug is already in use.
      data.isSlugAvailable = false;
      data.slugMessage = "The slug \"".concat(data.slug, "\" is not available."); // this is used to show a descriptive error.

      data.slugError = undefined; // This will prevent the editor from publishing the page.

      return data;
    }).catch(function () {
      // if it can't find it, then the slug is available.
      data.isSlugAvailable = true;
      data.slugMessage = data.slug;
      data.slugError = true;
      return data;
    });
  }

  return Promise.resolve(data);
}
/**
 * Publishes plaintextPrimaryHeadline prop if there is a primary headline.
 * @param {Object} data
 */


function setPlainTextPrimaryHeadline(data) {
  if (has(data.primaryHeadline)) {
    // published to ogTitle and pageListTitle
    data.plaintextPrimaryHeadline = sanitize.toPlainText(data.primaryHeadline);
  }
}
/**
 * Generates plaintext twitterTitle on every save.
 * @param {Object} data
 */


function setPlaintextShortHeadline(data) {
  if (has(data.shortHeadline)) {
    // published to twitterTitle
    data.plaintextShortHeadline = sanitize.toPlainText(data.shortHeadline);
  }
}
/**
 * Sanitizes headlines.
 * @param {Object} data
 */


function sanitizeHeadlines(data) {
  var smartHeadlineSanitizer = _flowRight(sanitize.toSmartHeadline, stripHeadlineTags),
      headlinesSanitizeResolver = {
    primaryHeadline: smartHeadlineSanitizer,
    shortHeadline: smartHeadlineSanitizer,
    teaser: _flowRight(sanitize.toSmartText, stripHeadlineTags),
    seoHeadline: _flowRight(sanitize.toSmartHeadline, striptags),
    seoDescription: _flowRight(sanitize.toSmartText, striptags),
    slug: sanitize.cleanSlug
  };

  Object.keys(headlinesSanitizeResolver).filter(function (prop) {
    return has(data[prop]);
  }).forEach(function (prop) {
    data[prop] = headlinesSanitizeResolver[prop](data[prop]);
  });
}
/**
 * Helper that uses the defaultValue to set undefined properties of the data object
 * @param {Object} data
 * @param {Object} configProperties
 * @param {Any} defaultValue
 */


function setDefaultValueToProperties(data, configProperties, defaultValue) {
  if (has(defaultValue)) {
    configProperties.filter(function (property) {
      return !data[property];
    }).forEach(function (setProperty) {
      data[setProperty] = defaultValue;
    });
  }
}
/**
 * Sets headlines based on the defaultHeadline that comes from the main listings component.
 * @param {Object} data
 */


function setHeadlines(data) {
  var headlines = ['primaryHeadline', 'shortHeadline', 'seoHeadline'];
  setDefaultValueToProperties(data, headlines, data.defaultHeadline);
}
/**
 * Sets teaser and seoDescription based on the defaultTeaser that comes from the main listings component.
 * @param {object} data
 */


function setTeasers(data) {
  var descriptions = ['teaser', 'seoDescription'];
  setDefaultValueToProperties(data, descriptions, data.defaultTeaser);
}
/**
 * Sets pageTitle property.
 * @param {Object} data
 */


function setPageTitle(data) {
  if (data.pageTitle) {
    var plainTextTitle = sanitize.toPlainText(data.pageTitle),
        prefix = plainTextTitle.startsWith('Listing: ') ? '' : 'Listing: '; // published to pageTitle

    data.pageTitle = "".concat(prefix).concat(plainTextTitle);
  }
}

module.exports.save = function (uri, data, locals) {
  setPageTitle(data);
  setHeadlines(data);
  setTeasers(data);
  sanitizeHeadlines(data);
  setPlainTextPrimaryHeadline(data);
  setPlaintextShortHeadline(data);
  return Promise.all([getPrevData(uri, data, locals), getPublishedData(uri, data, locals)]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        prevData = _ref2[0],
        publishedData = _ref2[1];

    setSlugAndLock(data, prevData, publishedData);
    return isSlugAvailable(data, locals);
  });
}; // Exposed for testing


module.exports.sanitizeHeadlines = sanitizeHeadlines;
module.exports.setDefaultValueToProperties = setDefaultValueToProperties;
module.exports.setPageTitle = setPageTitle;
}, {"5":5,"32":32,"39":39,"42":42,"43":43,"55":55,"72":72,"73":73}];
