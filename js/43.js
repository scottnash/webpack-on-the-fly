window.modules["43"] = [function(require,module,exports){(function (process){
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _isArray = require(129),
    _isObject = require(74),
    _isEmpty = require(75),
    _isString = require(164),
    _isNull = require(902),
    _isUndefined = require(903),
    _get = require(32),
    _parse = require(38),
    _reduce = require(124),
    publishedVersionSuffix = '@published',
    kilnUrlParam = '&currentUrl=',
    _require = require(39),
    removeNonAlphanumericCharacters = _require.removeNonAlphanumericCharacters;
/**
 * determine if a field is empty
 * @param  {*}  val
 * @return {Boolean}
 */


function isFieldEmpty(val) {
  if (_isArray(val) || _isObject(val)) {
    return _isEmpty(val);
  } else if (_isString(val)) {
    return val.length === 0; // emptystring is empty
  } else if (_isNull(val) || _isUndefined(val)) {
    return true; // null and undefined are empty
  } else {
    // numbers, booleans, etc are never empty
    return false;
  }
}
/**
 * convenience function to determine if a field exists and has a value
 * @param  {*}  val
 * @return {Boolean}
 */


function has(val) {
  return !isFieldEmpty(val);
}
/**
 * replace version in uri
 * e.g. when fetching @published data, or previous component data
 * @param  {string} uri
 * @param  {string} [version] defaults to latest
 * @return {string}
 */


function replaceVersion(uri, version) {
  if (!_isString(uri)) {
    throw new TypeError('Uri must be a string, not ' + _typeof(uri));
  }

  if (version) {
    uri = uri.split('@')[0] + '@' + version;
  } else {
    // no version is still a kind of version
    uri = uri.split('@')[0];
  }

  return uri;
}
/**
 * generate a url from a uri (and some site data)
 * @param  {string} uri
 * @param  {object} locals
 * @return {string}
 */


function uriToUrl(uri, locals) {
  var protocol = _get(locals, 'site.protocol') || 'http',
      port = _get(locals, 'site.port'),
      parsed = _parse("".concat(protocol, "://").concat(uri));

  if (port !== 80 && port !== 443) {
    parsed.set('port', port);
  }

  return parsed.href;
}
/**
 * generate a uri from a url
 * @param  {string} url
 * @return {string}
 */


function urlToUri(url) {
  var parsed = _parse(url);

  return "".concat(parsed.hostname).concat(parsed.pathname);
}
/**
 * Make sure start is defined and within a justifiable range
 *
 * @param {int} n
 * @returns {int}
 */


function formatStart(n) {
  var min = 0,
      max = 100000000;

  if (typeof n === 'undefined' || Number.isNaN(n) || n < min || n > max) {
    return 0;
  } else {
    return n;
  }
}
/*
 *
 * @param {object} locals
 * @param {string} [locals.site.protocol]
 * @param {string} locals.site.host
 * @param {string} [locals.site.port]
 * @param {string} [locals.site.path]
 * @returns {string} e.g. `http://nymag.com/scienceofus` or `http://localhost.dev.nymag.biz:3001/scienceofus`
 */


function getSiteBaseUrl(locals) {
  var site = locals.site || {},
      protocol = site.protocol || 'http',
      host = site.host,
      port = (site.port || '80').toString(),
      path = site.path || '';
  var sitePort = '';

  if (port !== '80' && port !== '443') {
    sitePort = ":".concat(port);
  }

  return "".concat(protocol, "://").concat(host).concat(sitePort).concat(path);
}
/*
 * strip subdomains and get root/base hostname. assumes extension like .net, .com
 * @param {object} locals
 * @param {string} locals.site.host
 * @returns {string} e.g. `nymag.com`, `thecut.com`, `vulture.com`, `grubstreet.com`
 */


function getSiteRootHost(locals) {
  var host = _get(locals, 'site.host', 'nymag.com'),
      hostSplit = host.split('.'),
      rootHost = hostSplit[hostSplit.length - 2] + '.' + hostSplit[hostSplit.length - 1];

  return rootHost;
}
/**
 *
 * @param {string} uri
 * @returns {boolean}
 */


function isPublishedVersion(uri) {
  return uri.indexOf(publishedVersionSuffix) === uri.length - 10;
}
/**
 * takes a uri and always returns the published version of that uri
 * @param {string} uri
 * @returns {string}
 */


function ensurePublishedVersion(uri) {
  return isPublishedVersion(uri) ? uri : uri.split('@')[0] + publishedVersionSuffix;
}
/**
 * checks if uri is an instance of a component
 * @param {string} uri
 * @returns {boolean}
 */


function isInstance(uri) {
  return uri.indexOf('/instances/') > -1;
}
/**
 * checks if uri is a page instance
 * @param {string} uri
 * @returns {boolean}
 */


function isPage(uri) {
  return uri.indexOf('/_pages/') > -1;
}
/**
 * kiln sometimes stores the url in a query param
 * @param {string} url
 * @returns {string}
 */


function kilnUrlToPageUrl(url) {
  return url.indexOf(kilnUrlParam) > -1 ? decodeURIComponent(url.split(kilnUrlParam).pop()) : url;
}
/**
 * removes query params and hashes
 * e.g. `http://canonicalurl?utm-source=facebook#heading` becomes `http://canonicalurl`
 * @param {string} url
 * @returns {string}
 */


function urlToCanonicalUrl(url) {
  return kilnUrlToPageUrl(url).split('?')[0].split('#')[0];
}
/**
 * Given a URI for a component retrieve it's instance id.
 * e.g. `uri.com/_components/article/instances/1234` retrieves `1234`
 *
 * @param {string} uri
 * @returns {string|null}
 */


function getInstanceId(uri) {
  if (!uri) {
    return null;
  }

  if (!isInstance(uri)) {
    return null;
  }

  var uriElements = uri.split('/'),
      uriTail = uriElements[uriElements.length - 1];
  return uriTail.replace(publishedVersionSuffix, '');
}
/**
 * prefixes a given elastic index depending on the current environment
 * e.g. `published-articles` becomes `local_published-articles`
 * @param {string} indexString
 * @returns {string}
 */


function prefixElasticIndex(indexString) {
  var prefix = window.process.env.ELASTIC_PREFIX;
  return prefix ? indexString.split(',').map(function (index) {
    return "".concat(prefix, "_").concat(index).trim();
  }).join(',') : indexString;
}
/**
 * Removes all non alphanumeric characters from the tags
 * @param {array} items
 * @returns {array}
*/


function normalizeTags() {
  var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return items.map(function (_ref) {
    var text = _ref.text;
    return removeNonAlphanumericCharacters(text);
  }).filter(Boolean);
}
/**
 * Returns the origin site of a crossposted article only if
 * the article is from a different site and isnt a syndicated copy
 * this may also return undefined if no conditions are met
 * @param {Object} article
 * @param {string} slug
 * @returns {string|undefined}
 */


function crosspostedFromSite(article, slug) {
  var crossSite,
      // the article must be from one of these sites as we only have crossposting indicators for these
  currentSites = ['di', 'vulture', 'selectall', 'wwwthecut', 'grubstreet', 'strategist', 'intelligencer'];

  if (article.site !== slug && currentSites.includes(article.site)) {
    crossSite = true;
  }

  if (article.syndicationStatus === 'copy') {
    crossSite = false;
  }

  if (crossSite) {
    return article.site;
  }
}
/**
 * Returns the origin site of a crossposted article only if
 * the article is from a different site and isnt a syndicated copy
 * this may also return undefined if no conditions are met
 * @param {Object} article
 * @returns {boolean}
 */


function isSponsored(article) {
  return article.featureTypes && article.featureTypes['Sponsor Story'];
}
/**
 * Formats an object and returns an array with the keys as strings
 *
 * @param {Object} obj
 * @returns {Array<string>} An array containing the object parameter keys as strings
 */


function keyObjectToArray(obj) {
  return _reduce(obj, function (result, value, key) {
    if (!result[key] && value) {
      result.push(key);
    }

    return result;
  }, []);
}
/**
 * Turns values into `select` `options`, using the object keys as values and the names as the label.
 * @param {Oject} obj
 * @returns {string} Option elements
 * (e.g. <option value="DO">Dominican Republic</option><option...)
 */


function valuesToOptions(obj) {
  return Object.keys(obj).map(function (key) {
    return "<option value=\"".concat(key, "\">").concat(obj[key], "</option>");
  }).sort().join('');
}
/**
 * Handlebars utility that negates whatever was passed into it
 * useful for logic that needs more control/specificity than handlebars' block-level logic functions
 *
 * @param {Any} arg
 * @returns {Boolean}
 */


function not(arg) {
  return !arg;
}

module.exports.isFieldEmpty = isFieldEmpty;
module.exports.has = has;
module.exports.replaceVersion = replaceVersion;
module.exports.uriToUrl = uriToUrl;
module.exports.urlToUri = urlToUri;
module.exports.formatStart = formatStart;
module.exports.getSiteBaseUrl = getSiteBaseUrl;
module.exports.getSiteRootHost = getSiteRootHost;
module.exports.isPublishedVersion = isPublishedVersion;
module.exports.ensurePublishedVersion = ensurePublishedVersion;
module.exports.isInstance = isInstance;
module.exports.isPage = isPage;
module.exports.urlToCanonicalUrl = urlToCanonicalUrl;
module.exports.getInstanceId = getInstanceId;
module.exports.prefixElasticIndex = prefixElasticIndex;
module.exports.normalizeTags = normalizeTags;
module.exports.crosspostedFromSite = crosspostedFromSite;
module.exports.isSponsored = isSponsored;
module.exports.keyObjectToArray = keyObjectToArray;
module.exports.valuesToOptions = valuesToOptions;
module.exports.not = not;

}).call(this,require(1280))}, {"32":32,"38":38,"39":39,"74":74,"75":75,"124":124,"129":129,"164":164,"902":902,"903":903,"1280":1280}];
