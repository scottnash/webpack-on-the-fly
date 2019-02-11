window.modules["head-link-newsfeed-next-prev.model"] = [function(require,module,exports){'use strict';

var _clone = require(58),
    _omit = require(121),
    urlParse = require(38),
    queryService = require(49),
    index = 'published-articles';
/**
 * @param {object} locals
 * @returns {object}
 */


function getNormalizedUrlParts(locals) {
  var site = locals.site,
      urlParts = urlParse(locals.url, true);

  if (site.protocol) {
    urlParts.protocol = site.protocol;
  }

  if (site.port && (site.port.toString() === '80' || site.port.toString() === '443')) {
    delete urlParts.port;
  } else if (site.port) {
    urlParts.port = site.port;
  }

  delete urlParts.search;
  return urlParts;
}
/**
 * @param {object} urlParts
 * @param {number} start
 * @returns {object}
 */


function getNormalizedUrlQueryByStart(urlParts, start) {
  var newParts = _clone(urlParts);

  if (start === 0) {
    // business logic: if at home page start, always use default size
    newParts.query = _omit(newParts.query, ['start', 'size']);
  } else {
    newParts.query.start = start;
  }

  return newParts.toString();
}
/**
 * @param {object} site
 * @param {object} locals
 * @returns {Promise}
 */


function getNewsfeedCount(site, locals) {
  var query = queryService(index, locals);
  queryService.onlyWithinThisSite(query, site);
  queryService.addFilter(query, {
    term: {
      'feeds.newsfeed': true
    }
  });
  return queryService.getCount(query).catch(function () {
    return 0;
  });
}
/**
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @param {string} locals.url
 * @param {string} locals.start
 * @param {string} locals.size
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  var urlParts = getNormalizedUrlParts(locals),
      sizeDefault = 50,
      start = parseInt(locals.start, 10) || 0,
      size = parseInt(locals.size, 10) || sizeDefault,
      nextStart = Math.max(start - size, 0),
      // lower number
  prevStart = Math.max(start + size, 0); // higher number
  // if start is 0 or less, there is no next a

  if (nextStart > -1 && start !== 0) {
    data.nextUrl = getNormalizedUrlQueryByStart(urlParts, nextStart);
  }

  return getNewsfeedCount(locals.site).then(function (count) {
    if (prevStart > -1 && prevStart < count) {
      data.prevUrl = getNormalizedUrlQueryByStart(urlParts, prevStart);
    }

    return data;
  });
};
}, {"38":38,"49":49,"58":58,"121":121}];
