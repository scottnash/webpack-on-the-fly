window.modules["68"] = [function(require,module,exports){'use strict';

var isProduction = require(6)(),
    _require = require(5),
    get = _require.get,
    post = _require.post,
    _require2 = require(116),
    getPageId = _require2.getPageId,
    viewsServiceBase = getViewsServiceBase();

module.exports = {
  getClientHistory: getClientHistory,
  updateClientHistory: updateClientHistory,
  updateClientHistoryWithPageData: updateClientHistoryWithPageData
};
/**
 * The recent history of a client's activity across all sites
 * @typedef {object} ClientHistory
 * @param {number} first_visit - timestamp (ms) of first visit in recorded period
 * @param {object} global
 * @param {number} global.total  - total of all recent visits across domains
 * @param {number} [global.type] - total for a given article type
 * @param {object} site
 * @param {number} site.total - total recent vists for this site
 * @param {number} [site.type] - total for a given article type on this site
 */

/**
 * Client ID (nymcid on cookie) assigned at runtime externally
 * @typedef {string} ClientID
 */

/**
 * Slug of current site
 * @typedef {string} SiteSlug
 */

/**
* Update the client history with new visit info
*
* @param {ClientID} clientId
* @returns {Promise<ClientHistory>}
*/

function getClientHistory(clientId) {
  return get("".concat(viewsServiceBase, "/views/").concat(clientId));
}
/**
 * Update the client history with new visit info.
 * Responds optimistically and will not throw for duplicate view info
 * @param {ClientID} clientId
 * @param {SiteSlug} site
 * @param {ArticleType} articleType - one of Feature|Magazine|Article
 * @param {string} pageid - unique id of page
 * @returns {Promise<ClientHistory>}
 */


function updateClientHistory() {
  var clientId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var site = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var articleType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var pageid = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var internalPrefix = isProduction ? '' : '/qa';
  return post("".concat(viewsServiceBase).concat(internalPrefix, "/views/").concat(clientId), {
    type: articleType,
    site: site,
    pageid: pageid
  });
}
/**
 * Convenience function for updateClientHistory
 * Assigns article
 * @param {ClientID} clientId
 * @param {SiteSlug} site
 * @returns {Promise<ClientHistory>}
 */


function updateClientHistoryWithPageData() {
  var clientId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var site = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return updateClientHistory(clientId, site, getArticleType(), getPageId());
} // -- Internals

/**
 * Return the base URL to use for API requests to the views service
 * @return {string}
 */


function getViewsServiceBase() {
  return isProduction ? "https://client.".concat(getSiteDomain(), ".com") : 'http://internal-client-history-stg-1310077839.us-east-1.elb.amazonaws.com';
}
/**
 * Get a simplified site domain
 * this regex will pull out the grubstreet/vulture/nymag/etc from the production site's domain
 * @return {string}
 */


function getSiteDomain() {
  var siteDomain = document.location.href.match(/\/\/([^\/]+)\.com/)[1].replace('www.', ''); // flatten nymag subdomains

  if (siteDomain.match(/.nymag$/)) {
    siteDomain = 'nymag';
  }

  return siteDomain;
}
/**
 * Get the category of article (Feature|Magazine|Article)
 * @return {string}
 */


function getArticleType() {
  var articleEl = document.querySelector('article[data-type]'),
      featureTypes = articleEl ? articleEl.dataset.type.split(',').map(function (type) {
    return type.trim();
  }) : [];

  if (featureTypes.includes('Feature')) {
    return 'Feature';
  }

  if (featureTypes.includes('New York Magazine Story')) {
    return 'Magazine';
  }

  return 'Article';
}
}, {"5":5,"6":6,"116":116}];
