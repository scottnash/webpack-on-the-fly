window.modules["1268"] = [function(require,module,exports){'use strict';

var _map = require(37),
    _assign = require(57),
    _compact = require(165),
    utils = require(43),
    addInArticleAds = require(1269),
    _require = require(56),
    getComponentName = _require.getComponentName;
/**
 * Insert dummy ads into an article's body for reference when editing. Directly calls the
 * addInArticleAds service, then replaces each reference to an ad component with a dummy.
 * @param {object} articleData - all data from the article, passed to the addInArticleAds service
 * @param {string} dummyInstance - the name of the dummy instance to insert where ads should be
 * @param {object} locals - site info, needed to resolve component references
 * @returns {object} article content
 */


module.exports = function (articleData, dummyInstance, locals) {
  var dummyRef = utils.urlToUri("".concat(utils.getSiteBaseUrl(locals), "/_components/ad-dummy/instances/").concat(dummyInstance)),
      contentWithAds; // insert ads

  contentWithAds = addInArticleAds(articleData); // replace ads with dummies

  return _compact(_map(contentWithAds, function (cmpt) {
    if (getComponentName(cmpt._ref) === 'ad') {
      return _assign({}, cmpt, {
        _ref: dummyRef
      });
    } else {
      return cmpt;
    }
  }));
};
}, {"37":37,"43":43,"56":56,"57":57,"165":165,"1269":1269}];
