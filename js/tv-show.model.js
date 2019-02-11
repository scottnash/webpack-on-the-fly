window.modules["tv-show.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var queryService = require(49),
    INDEX = 'tv-recaps',
    _require = require(39),
    normalizeName = _require.normalizeName,
    _get = require(32),
    _maxBy = require(61),
    logger = require(81),
    log = logger.setup({
  file: __filename
}),
    productsService = require(77),
    fields = ['articleImageURL', 'episodeNumber', 'episodeName', 'articleHeadline', 'articleTeaser', 'articleURL', 'seasonNumber', 'isDoubleEpisode'];

function setImageFeedUrl(data) {
  var latestSeasonEpisodes = data.episodesSplitBySeason[data.latestSeason],
      latestEpisode = _maxBy(latestSeasonEpisodes, function (episode) {
    return episode.episodeNumber;
  }); // returns the latest season episode based on the episode number


  if (data.showImageURL !== latestEpisode.articleImageURL) {
    data.showImageURL = latestEpisode.articleImageURL;
  }
}

function getDynamicFeedImg(allEpisodes) {
  allEpisodes.forEach(function (episode) {
    if (!episode.articleImageURL) {
      return;
    }

    episode.dinamycImage = {
      url: episode.articleImageURL,
      mobile: 'tv-show-small',
      tablet: 'tv-show-medium',
      desktop: 'tv-show-large'
    };
  });
  return allEpisodes;
}
/**
 * takes in an array, removes duplicates and returns a reversed version
 * @param {Array} data
 * @returns {Array}
 */


function grabSeasons(data) {
  var result = data.map(function (a) {
    return parseInt(a.seasonNumber);
  });
  return Array.from(new Set(result)).reverse();
}
/**
 * set the show url from the locals (even if it's already set)
 * @param {object} data
 * @param {object} locals
 */


function setShowUrl(data, locals) {
  if (_get(locals, 'publishUrl')) {
    data.showUrl = locals.publishUrl;
  }
}
/**
 * groups items together which share a similar property, the seasonNumber
 * @param {Array} everyEpisode
 * @returns {object}
 */


function groupBySeasons(everyEpisode) {
  return everyEpisode.reduce(function (groupSeasons, episode) {
    groupSeasons[episode['seasonNumber']] = groupSeasons[episode['seasonNumber']] || [];
    groupSeasons[episode['seasonNumber']].push(episode);
    return groupSeasons;
  }, {});
}

function getEpisodeCount(data, locals) {
  var query = buildSearchQuery(data, locals, false);
  return queryService.getCount(query).catch(function () {
    return 0;
  });
}

function buildSearchQuery(data, locals, isSearchByQuery) {
  var query = queryService(INDEX, locals);
  queryService.addFilter(query, {
    term: {
      'showName.normalized': data.normalizeShowName
    }
  }); // getCount doesn't accept these fields in its query but searchByQuery does

  if (isSearchByQuery) {
    queryService.addSort(query, {
      seasonNumber: 'desc'
    });
    queryService.addSort(query, {
      episodeNumber: 'desc'
    });
    queryService.onlyWithTheseFields(query, fields);
  }

  return query;
}

function setCirculationData(data) {
  data.formattedShowName = "".concat(data.showName, " \u2014 TV Episode Recaps & News");
  data.formattedTeaser = "The latest tv recaps and news from ".concat(data.showName, ".");
}
/**
 * adds amazon subtag and associate id to query param of each buy link
 * this component allows for a custom amazon associate ID; therefore this is required
 * if not an amazon link, then the link is copied to buyUrlWithAmazonQuery
 * @param {object} locals
 * @param {object} data
 */


function addAmazonQueryParams(locals, data) {
  data.streamingServices.forEach(function (streamingService) {
    if (streamingService.streamingService === 'primeVideo') {
      streamingService.url = productsService.generateBuyUrlWithSubtag(streamingService.url, null, locals);
    }
  });
}

module.exports.save = function (ref, data, locals) {
  if (data.showName) {
    data.normalizeShowName = normalizeName(data.showName);
    setCirculationData(data);
  }

  setShowUrl(data, locals);
  return data;
};

module.exports.render = function (uri, data, locals) {
  if (data.showName) {
    var query = buildSearchQuery(data, locals, true);
    return getEpisodeCount(data, locals).then(function (count) {
      queryService.addSize(query, count);
      return queryService.searchByQuery(query).then(function (results) {
        data.allEpisodes = results;
        getDynamicFeedImg(data.allEpisodes);
        data.seasonNumbers = grabSeasons(data.allEpisodes);
        data.latestSeason = Math.max.apply(null, data.seasonNumbers);
        data.episodesSplitBySeason = groupBySeasons(data.allEpisodes);
        addAmazonQueryParams(locals, data);
        setImageFeedUrl(data);
        return data;
      }).catch(function (err) {
        log(err);
        return data;
      });
    });
  }

  return data;
};

}).call(this,"/components/tv-show/model.js")}, {"32":32,"39":39,"49":49,"61":61,"77":77,"81":81}];
