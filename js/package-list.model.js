window.modules["package-list.model"] = [function(require,module,exports){'use strict';

var queryService = require(49),
    _map = require(37),
    _take = require(113),
    callout = require(80),
    _require = require(56),
    isComponent = _require.isComponent,
    index = 'published-articles',
    fields = ['primaryHeadline', 'plaintextPrimaryHeadline', 'canonicalUrl', 'featureTypes', 'tags', 'pageUri'];
/**
 * Add video/gallery callouts to each result
 *
 * @param {Array} results
 * @returns {Array}
 */


function decorateResults(results) {
  return _map(results, function (result) {
    return Object.assign({}, result, {
      callout: callout(result)
    });
  });
}
/**
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  var query = queryService.newQueryWithCount(index, 6, locals);
  var cleanUrl;

  if (!data.tag || !locals) {
    return data;
  }

  queryService.withinThisSiteAndCrossposts(query, locals.site);
  queryService.onlyWithTheseFields(query, fields);
  queryService.addShould(query, {
    match: {
      tags: data.tag
    }
  });
  queryService.addMinimumShould(query, 1);
  queryService.addSort(query, {
    date: 'desc'
  }); // exclude the current page in results

  if (locals.url && !isComponent(locals.url)) {
    cleanUrl = locals.url.split('?')[0].replace('https://', 'http://');
    queryService.addMustNot(query, {
      match: {
        canonicalUrl: cleanUrl
      }
    });
  }

  return queryService.searchByQuery(query).then(function (results) {
    var limit = data.limit || 3;
    data.articles = decorateResults(_take(results, limit)); // show a maximum of <limit> links

    data.hasMore = results.length > limit;
    return data;
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
};
}, {"37":37,"49":49,"56":56,"80":80,"113":113}];
