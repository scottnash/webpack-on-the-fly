window.modules["dynamic-list.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _clone = require(58),
    _get = require(32),
    _map = require(37),
    queryService = require(49),
    _require = require(56),
    isPage = _require.isPage,
    isComponent = _require.isComponent,
    _require2 = require(110),
    sendError = _require2.sendError,
    elasticCatch = _require2.elasticCatch,
    _require3 = require(43),
    formatStart = _require3.formatStart,
    _require4 = require(39),
    removeNonAlphanumericCharacters = _require4.removeNonAlphanumericCharacters,
    log = require(81).setup({
  file: __filename,
  component: 'dynamic-list'
}),
    index = 'published-articles';
/**
 * Builds and executes the query.
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @param {string} routeParamValue
 * @return {object}
 */


function buildAndExecuteQuery(ref, data, locals, routeParamValue) {
  var from = formatStart(parseInt(locals.start, 10)),
      // can be undefined or NaN,
  size = parseInt(locals.size, 10) || data.size || 20,
      body = {
    from: from,
    size: size
  },
      query = queryService(index, locals),
      host = _get(locals, 'site.host', '');

  var lowerCaseRouteParamValue = '';
  query.body = _clone(body); // lose the reference
  // nymag queries from all sites

  if (host.indexOf('nymag') === -1) {
    queryService.withinThisDomainOrCrossposts(query, locals.site);
  }

  if (routeParamValue) {
    lowerCaseRouteParamValue = removeNonAlphanumericCharacters(routeParamValue).toLowerCase();
    queryService.addFilter(query, {
      match: {
        normalizedTags: lowerCaseRouteParamValue
      }
    });
  } // Log the query


  log('debug', 'tag and normalized tag ', {
    normalizedTag: lowerCaseRouteParamValue,
    tag: routeParamValue,
    ref: ref
  });
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQueryWithRawResult(query).then(function (results) {
    var _results$hits = results.hits,
        hits = _results$hits === void 0 ? {} : _results$hits;
    data.total = hits.total;
    data.entries = _map(hits.hits, '_source');
    data.from = from;
    data.start = from + size;
    data.moreEntries = data.total > data.start;
    log('debug', 'total hits', {
      hits: hits.total,
      ref: ref
    });
    return data;
  });
}

module.exports.render = function (ref, data, locals) {
  var reqUrl = locals.url;
  var routeParamValue;
  log('debug', 'request URL', {
    hits: reqUrl,
    ref: ref
  }); // If we're publishing for a dynamic page, rendering a component directly
  // or trying to render a page route we need a quick return

  if (locals.isDynamicPublishUrl || isComponent(reqUrl) || isPage(reqUrl)) {
    return data;
  }

  routeParamValue = locals && locals.params ? locals.params[data.routeParam] : '';
  return buildAndExecuteQuery(ref, data, locals, routeParamValue).then(function (data) {
    // If we're not in edit mode and we've
    // got no results, the page should 404
    if (!data.entries.length && !locals.edit) {
      sendError("No results for tag: ".concat(routeParamValue), 404);
    }

    return data;
  }).catch(elasticCatch);
};

module.exports.save = function (ref, data) {
  // make sure all of the numbers we need to save aren't strings
  if (data.size) {
    data.size = parseInt(data.size, 10);
  }

  if (!data.routeParam) {
    throw new Error('dynamic-list component requires a `routeParam` property to be defined');
  }

  return data;
};

}).call(this,"/components/dynamic-list/model.js")}, {"32":32,"37":37,"39":39,"43":43,"49":49,"56":56,"58":58,"81":81,"110":110}];
