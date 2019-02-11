window.modules["349"] = [function(require,module,exports){'use strict';

const isUriStringCheck = require(356);

/**
 * Remove the url-patterned prefix for the site's slug.
 *
 * @param  {String} uri
 * @param  {Object} site
 * @return {String}
 */
module.exports = function (uri, site) {
  var { host, path, slug, prefix } = site,
    hasSlash = uri.indexOf('/_') !== -1;

  if (!prefix) {
    prefix = path && path.length > 1 ? `${host}${path}` : host;
  }

  isUriStringCheck.strCheck(uri);
  return uri.replace(`${prefix}${hasSlash ? '/' : ''}`, `${slug}${hasSlash ? '/' : ''}`);
};
}, {"356":356}];
