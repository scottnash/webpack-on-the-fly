window.modules["lede-gallery.model"] = [function(require,module,exports){'use strict';

var _require = require(55),
    formatDate = _require.formatDate,
    setCanonicalUrl = _require.setCanonicalUrl,
    queryService = require(49),
    promises = require(46),
    _require2 = require(43),
    has = _require2.has,
    QUERY_INDEX = 'authors',
    mediaplay = require(53),
    striptags = require(42),
    sanitize = require(39),
    allowedTags = ['strong', 'em', 'a'],
    cleanText = function cleanText(text) {
  return sanitize.toSmartText(striptags(text, allowedTags));
};
/**
 * query elastic to get social media stuff for an author
 * @param {Object} query
 * @param {string} name
 * @returns {Promise}
 */


function getAuthorData(query, name) {
  queryService.addShould(query, {
    match: {
      'name.normalized': sanitize.normalizeName(name.text)
    }
  });
  queryService.addMinimumShould(query, 1);
  return queryService.searchByQuery(query).catch(function () {
    return {
      name: name.text
    };
  }).then(function (authors) {
    return authors;
  });
}
/**
 * Gets the authorsAndMeta data if there exists any authors of the article
 * note: the template expects data.authorsAndMeta, so always populate it
 * @param  {Object} query
 * @param  {Object} data
 * @return {Promise}
 */


function getAuthorSocialData(query, data) {
  var bareAuthors = has(data.authors) ? data.authors : [];

  if (bareAuthors.length === 1) {
    // if there's a single author, query for their social media handle
    return promises.timeout(getAuthorData(query, bareAuthors[0]).then(function (authorsAndMeta) {
      // set the authors & metadata property, using the metadata if it exists
      data.authorsAndMeta = authorsAndMeta && authorsAndMeta.length ? authorsAndMeta : bareAuthors;
    }), 1000).catch(function () {
      data.authorsAndMeta = bareAuthors;
    }); // fail gracefully
  } else {
    data.authorsAndMeta = bareAuthors;
  }

  return Promise.resolve();
}

function resolveLedeImage(data) {
  if (!data.ledeImageUrl) return data;
  return mediaplay.getMediaplayMetadata(data.ledeImageUrl).then(function (metadata) {
    data.ledeImageCredit = cleanText(metadata.credit);
    return data;
  });
}

module.exports.save = function (uri, data, locals) {
  var query = queryService(QUERY_INDEX, locals);
  formatDate(data, locals);
  setCanonicalUrl(data, locals);
  return Promise.all([getAuthorSocialData(query, data), resolveLedeImage(data)]).then(function () {
    return data;
  });
};
}, {"39":39,"42":42,"43":43,"46":46,"49":49,"53":53,"55":55}];
