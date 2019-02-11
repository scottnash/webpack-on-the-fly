window.modules["tv-recap-feed.model"] = [function(require,module,exports){'use strict';

var _map = require(37),
    queryService = require(49),
    sanitize = require(39),
    _require = require(39),
    normalizeName = _require.normalizeName,
    index = 'tv-recaps',
    fields = ['articleURL', 'articleImageURL', 'showName', 'seasonNumber', 'episodeNumber', 'pageUri', 'date', 'articleHeadline', 'articleTeaser', 'showCoverageURL'];

function getScopes(scopes) {
  if (scopes && scopes.length) {
    return _map(scopes, function (scope) {
      return scope.text;
    });
  } else {
    return [];
  }
}

module.exports.save = function (ref, data, locals) {
  var size = data.numberOfArticles,
      query = queryService.newCuneiformQuery(index);
  data.title = sanitize.toSmartText(data.title || '');
  data.cuneiformScopes = getScopes(data.scopes);

  if (locals) {
    // for vulture we want to query for itself and recaps that are crossposted
    // for other sites using this component, we want to pull directly from vultue
    if (locals.site === 'vulture') {
      queryService.withinThisSiteAndCrossposts(query, locals.site);
    } else {
      queryService.onlyWithinThisSite(query, {
        slug: 'vulture'
      });
    }
  }

  queryService.addSize(query, size);
  queryService.onlyWithTheseFields(query, fields);
  queryService.addSort(query, {
    date: 'desc'
  });

  if (data.showName) {
    var normalizeShowName = normalizeName(data.showName);
    queryService.addFilter(query, {
      term: {
        'showName.normalized': normalizeShowName
      }
    });
  }

  data.cuneiformQuery = query; // Strip show name and recap text from article headline

  for (var i = 0; i < data.cuneiformResults.length; i++) {
    if (data.cuneiformResults[i].articleHeadline) {
      data.cuneiformResults[i].articleHeadline = data.cuneiformResults[i].articleHeadline.replace(/(.*?\Recap:\s)/, '');
    }
  }

  return data;
};
}, {"37":37,"39":39,"49":49}];
