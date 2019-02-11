window.modules["generic-list.model"] = [function(require,module,exports){'use strict';

var _map = require(37),
    yaml = require(115),
    queryService = require(49),
    _require = require(110),
    sendError = _require.sendError,
    elasticCatch = _require.elasticCatch,
    _require2 = require(43),
    formatStart = _require2.formatStart,
    isPublishedVersion = _require2.isPublishedVersion,
    _require3 = require(109),
    hypensToSpaces = _require3.hypensToSpaces,
    titleCase = _require3.titleCase,
    TABS_RE = /\t/g;
/**
 * Builds and executes the query.
 * @param {object} data
 * @param {object} locals
 * @return {object}
 */


function buildAndExecuteQuery(data) {
  var locals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var from = formatStart(parseInt(locals.start, 10)),
      // can be undefined or NaN,
  query = queryService(data.index, locals),
      size = data.size;
  query.body = {};

  if (data.query) {
    query.body = data.jsonQuery || {};
  }

  query.body.size = size;
  query.body.from = from;
  query.body._source = data._source;
  return queryService.searchByQueryWithRawResult(query).then(function (results) {
    var _results$hits = results.hits,
        hits = _results$hits === void 0 ? {} : _results$hits;
    data.total = hits.total;
    data.entries = _map(hits.hits, '_source');
    data.from = from;
    data.start = from + size;
    data.moreEntries = data.total > data.start;
    return data;
  });
}
/**
 * Gets the text value from a simple list
 * @param {Object[]} arr
 * @return {string[]}
 */


function getSimpleListValues() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return arr.map(function (element) {
    return element.text;
  });
}
/**
 * Gets entries and saves them in the data object.
 * @param {string} ref
 * @param {Object} data
 * @param {Object} locals
 * @returns {Object}
 */


function getEntries(ref, data) {
  var locals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return buildAndExecuteQuery(data, locals).then(function (data) {
    // If we're not in edit mode and
    // the page is published and
    // we've got no results, the page should 404
    if (!data.entries.length && !locals.edit && isPublishedVersion(ref)) {
      sendError('No results', 404);
    }

    return data;
  }).catch(function (e) {
    if (!locals.edit) {
      elasticCatch(e);
    }

    return data;
  });
}

module.exports.render = function (ref, data, locals) {
  return getEntries(ref, data, locals).then(function (data) {
    return data;
  });
};

module.exports.save = function (ref, data, locals) {
  data.index = data.index || 'published-articles';
  data._source = data.source && data.source.length ? getSimpleListValues(data.source) : [];
  data.title = data.index ? titleCase(hypensToSpaces(data.index)) : ''; // make sure all of the numbers we need to save aren't strings

  data.size = parseInt(data.size, 10) || 10;
  data.adIndex = parseInt(data.adIndex, 10) || 9;

  if (data.query) {
    // js-yaml doesn't like tabs so we replace them with 2 spaces
    data.query = data.query.replace(TABS_RE, '  ');
    data.jsonQuery = yaml.safeLoad(data.query);
  }

  return getEntries(ref, data, locals).then(function (data) {
    return data;
  });
};
}, {"37":37,"43":43,"49":49,"109":109,"110":110,"115":115}];
