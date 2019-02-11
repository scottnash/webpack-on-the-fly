window.modules["episode-recap.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    sanitize = require(39),
    queryService = require(49),
    promises = require(46),
    dateFormat = require(52),
    utils = require(43),
    _require = require(39),
    normalizeName = _require.normalizeName,
    rest = require(5),
    index = 'tv-recaps';
/**
 * Extracts the first result with its id set
 * @param {object} result
 * @returns {object}
 */


function formatSearchResult(result) {
  var hits = _get(result, 'hits.hits') || [],
      hit = null;

  if (hits.length) {
    hit = result.hits.hits[0]._source;
    hit.id = result.hits.hits[0]._id;
  }

  return hit;
}
/**
 * Find a single episode which is from this season prior to this episode, or the last in the previous season
 * @param {string} showName
 * @param {integer} seasonNumber
 * @param {integer} episodeNumber
 * @param {object} locals
 * @returns {Promise}
 */


function findPreviousEpisode(showName, seasonNumber, episodeNumber, locals) {
  var query = queryService.newQueryWithCount(index, 1, locals),
      subQuery = queryService(index, locals); // show name

  queryService.addFilter(query, {
    term: {
      'showName.normalized': normalizeName(showName)
    }
  }); // same season, lower episode number than current
  // since this is a compound condition it is built as a separate query, then nested within the main query

  queryService.addMust(subQuery, {
    term: {
      seasonNumber: seasonNumber
    }
  });
  queryService.addMust(subQuery, {
    range: {
      episodeNumber: {
        lt: episodeNumber
      }
    }
  });
  queryService.addShould(query, _get(subQuery, 'body.query', {})); // previous season, highest episode number

  queryService.addShould(query, {
    range: {
      seasonNumber: {
        lt: seasonNumber
      }
    }
  }); // match one of the two previous conditions

  queryService.addMinimumShould(query, 1); // sort so we're always getting the most recent match

  queryService.addSort(query, {
    seasonNumber: 'desc'
  });
  queryService.addSort(query, {
    episodeNumber: 'desc'
  });
  return queryService.searchByQueryWithRawResult(query).then(formatSearchResult);
}

function updatePreviousEpisode(ref, data, locals) {
  return findPreviousEpisode(data.showName, data.seasonNumber, data.episodeNumber, locals).then(function (prevEpisode) {
    var prevEpisodeId = prevEpisode ? prevEpisode.id : '',
        unpublishedVersion = utils.isPublishedVersion(prevEpisodeId) ? prevEpisodeId.replace('@published', '') : ''; // don't keep trying on every update

    data.updatedPrev = true; // set this component's link to the previous episode

    data.previousEpisodeURL = prevEpisode ? prevEpisode.articleURL : '';
    data.previousEpisodeTitle = prevEpisode ? prevEpisode.articleHeadline : '';
    return Promise.all([setNextEpisodeData(prevEpisodeId, data, locals), // Set next episode data to the publish version
    setNextEpisodeData(unpublishedVersion, data, locals) // Set next episode data to the unpublished version
    ]).then(function () {
      return data;
    });
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
}
/**
 * Set information for the next episode to component
 * @param {string} prevEpisodeId
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


function setNextEpisodeData(prevEpisodeId, data, locals) {
  return promises.timeout(rest.get(utils.uriToUrl(prevEpisodeId, locals)).then(function (prevData) {
    prevData.nextEpisodeURL = data.articleURL;
    prevData.nextEpisodeTitle = data.articleHeadline;
    return rest.put(utils.uriToUrl(prevEpisodeId, locals), prevData, true);
  }).then(function () {
    return data;
  }), 1000).catch();
}
/**
 * set the publish date from the locals (even if it's already set),
 * and format it correctly
 * @param  {object} data
 * @param  {object} locals
 */


function formatDate(data, locals) {
  if (_get(locals, 'date')) {
    // if locals and locals.date exists, set the article date (overriding any date already set)
    data.date = dateFormat(locals.date); // ISO 8601 date string
  }
}

module.exports.save = function (ref, data, locals) {
  // sanitize text
  data.showName = sanitize.toSmartText(sanitize.toPlainText(data.showName)).trim();
  data.episodeName = sanitize.toSmartText(sanitize.toPlainText(data.episodeName));
  data.previousEpisodeTitle = sanitize.toPlainText(data.previousEpisodeTitle);
  data.nextEpisodeTitle = sanitize.toPlainText(data.nextEpisodeTitle);
  formatDate(data, locals); // set article's url if it exists

  if (locals && locals.publishUrl) {
    data.articleURL = locals.publishUrl;
  } // once we have a URL, set the previous episode's navigation details


  if (!data.updatedPrev && data.articleURL) {
    return updatePreviousEpisode(ref, data, locals);
  }

  return data;
};
}, {"5":5,"32":32,"39":39,"43":43,"46":46,"49":49,"52":52}];
