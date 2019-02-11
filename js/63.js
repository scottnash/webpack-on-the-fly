window.modules["63"] = [function(require,module,exports){'use strict';

module.exports = {
  Scenario: Scenario
};
/**
 * Track the status of a client history against scenario data
 * @typedef {object} Scenario
 * @property {string} action - ID of action to perform if shouldShow is true
 * @property {number} count - relevant pageviews (scoped to siteScope & articleType)
 * @property {number} min - minimum page views to trigger action
 * @property {number} max - maximum page views to trigger action
 * @property {boolean} shouldShow - whether action is triggered
 * @property {string} articleType - article type 
 * @property {string} siteScope - which key on the ClientHistory object to get the count from 
 */

/**
 * Decorate a scenario object evaluating it against a user's history
 * @param {object} input
 * @param {string} input.siteScope - crossSite|singleSite
 * @param {object} input.pageviewCount
 * @param {number} input.pageviewCount.min - minumum number of page views to trigger action
 * @param {number} [input.pageviewCount.max] - maximum number of page views to trigger action
 * @param {string} input.articleType - e.g. any|magazine|feature
 * @param {string} input.action - id of tout to execute
 * @param {string} input.exclude - different cases we want to exclude from this scenario
 * @param {string} input.exclude.subscriber - exclude digital NYM subscribers from this scenario
 * @param {ClientHistory} history
 * @param {string} siteName
 * @param {boolean} isSubscriber
 * @return {Scenario}
 */

function Scenario(_ref) {
  var _ref$siteScope = _ref.siteScope,
      siteScope = _ref$siteScope === void 0 ? 'singleSite' : _ref$siteScope,
      _ref$pageviewCount = _ref.pageviewCount,
      pageviewCount = _ref$pageviewCount === void 0 ? {
    min: 0,
    max: Infinity
  } : _ref$pageviewCount,
      _ref$articleType = _ref.articleType,
      articleType = _ref$articleType === void 0 ? 'any' : _ref$articleType,
      _ref$action = _ref.action,
      action = _ref$action === void 0 ? '' : _ref$action,
      _ref$exclude = _ref.exclude,
      exclude = _ref$exclude === void 0 ? {} : _ref$exclude;
  var history = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var siteName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var isSubscriber = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var min = pageviewCount.min,
      max = pageviewCount.max || Infinity,
      count = getCount();
  /**
   * Determine wether a scenario should be activated given a history
   * @return {Boolean}
   */

  function shouldShow() {
    return !isExcluded() && isInRange();
  }
  /**
   * Get a count of relevant pageviews scoped to the site and article type
   * @return {number}
   */


  function getCount() {
    var scopedCounts = getScopedCounts();

    if (scopedCounts == null) {
      console.warn('could not find scoped counts');
      return 0;
    }

    return scopedCounts[articleType === 'any' ? 'total' : articleType] || 0;
  }
  /**
   * Return an article count object scoped to the site or globally
   * @returns {object|null}
   */


  function getScopedCounts() {
    if (!history) {
      return null;
    }

    if (siteScope === 'anySite') {
      // scenario is checking for the global history of this or any other site
      return history.global;
    } else if (siteScope === 'singleSite') {
      // scenario is checking for the history of this specific site
      return history[siteName];
    } else if (siteScope === 'crossSite' && Object.keys(history).filter(function (site) {
      return history[site].total;
    }).length >= 3) {
      // global plus 2 other sites
      // scenario is checking for the global history but ONLY if the user has visited two or more sites
      return history.global;
    }

    return null;
  }
  /**
   * Check if current history is within view range
   * @returns {Boolean}
   */


  function isInRange() {
    return count >= min && count <= max;
  }
  /**
   * handle special exclusions on exclusion object
   * @return {boolean}
   */


  function isExcluded() {
    if (!exclude) {
      return false;
    }

    if (exclude.subscribers && isSubscriber) {
      return true;
    }

    return false;
  }

  return {
    action: action,
    count: count,
    min: min,
    shouldShow: shouldShow(),
    max: max == Infinity ? null : max,
    articleType: articleType,
    siteScope: siteScope
  };
}
}, {}];
