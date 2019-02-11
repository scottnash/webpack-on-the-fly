window.modules["amp-relay.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    parse = require(38);
/**
 * Get the path, including the query string, from a URL
 * @param  {string} canonicalUrl
 * @return {string}
 */


function getPathFromUrl(canonicalUrl) {
  var parsedUrl;

  if (!canonicalUrl) {
    return '';
  }

  parsedUrl = parse(canonicalUrl);
  return parsedUrl.pathname + (parsedUrl.query || '');
}
/**
 * set component canonical url if it's passed in through the locals
 * @param {object} data
 * @param {object} [locals]
 */


function setUrl(data, locals) {
  if (locals && locals.publishUrl) {
    data.canonicalUrl = locals.publishUrl;
    data.articlePath = getPathFromUrl(locals.publishUrl);
  }
}

module.exports.render = function (ref, data, locals) {
  var siteHost = _get(locals, 'site.host', null),
      sitePath = _get(locals, 'site.path', '');

  if (data.canonicalUrl && siteHost) {
    data.internalAmpUrl = data.canonicalUrl.replace("".concat(siteHost).concat(sitePath), "".concat(siteHost).concat(sitePath, "/amp"));
  }

  return data;
};

module.exports.save = function (ref, data, locals) {
  setUrl(data, locals);
  return data;
};

module.exports.getPathFromUrl = getPathFromUrl; // exported for tests

module.exports.setUrl = setUrl; // exported for tests
}, {"32":32,"38":38}];
