window.modules["listing-feed.model"] = [function(require,module,exports){'use strict';

var _map = require(37),
    _get = require(32),
    _isEmpty = require(75),
    urlParse = require(38),
    yaml = require(115),
    queryService = require(49),
    mediaplay = require(53),
    INDEX = 'listings'; // Determine whether a listing should have the sponsored indicator.
// If the feed has only paid listings, do not show the indicator
// Otherwise, show if there is a brand teaser and there is NO editorial teaser


function getSponsoredIndicator(listing, data) {
  return !data.onlyPaidListings && _isEmpty(listing.content.teaser) && !_isEmpty(listing.content.brandTeaser);
} // If a listing is on feed that servers only paid listings, prefer the brand teaser
// Otherwise, prefer the editorial teaser over the brand teaser


function getFeedTeaser(listing, data) {
  if (data.onlyPaidListings) {
    return listing.content.brandTeaser || listing.content.teaser;
  } else {
    return listing.content.teaser || listing.content.brandTeaser;
  }
} // Sets media renditions for images in a listing specific to the listing-feed component


function setMediaRenditions(listing) {
  if (listing.media.image) {
    listing.media.image.mediaplayUrl = mediaplay.getRendition(listing.media.image.mediaplayUrl, 'listing-media');
  }

  if (listing.media.slideshow) {
    listing.media.slideshow.imageUrl = mediaplay.getRendition(listing.media.slideshow.imageUrl, 'listing-media');
  }
}

function setWebsiteLink(listing) {
  if (listing.contact && !_isEmpty(listing.contact.website)) {
    var parsedWebsite = urlParse(listing.contact.website);

    if (_isEmpty(parsedWebsite.protocol)) {
      parsedWebsite.set('protocol', 'http');
    }

    listing.contact.websiteLink = parsedWebsite.toString();
  }
}

module.exports.save = function (uri, data) {
  if (data.query) {
    // js-yaml doesn't like tabs so we replace them with 2 spaces
    data.query = data.query.replace(/\t/g, '  ');
    data.jsonQuery = JSON.stringify(yaml.safeLoad(data.query));
  }

  return data;
}; // During our render, we query ElasticSearch for listings, then munge the returned data for the template


module.exports.render = function (ref, data, locals) {
  var query = queryService(INDEX, locals);

  if (data.jsonQuery) {
    query.body = JSON.parse(data.jsonQuery);
    queryService.addSort(query, {
      'name.lower_case': 'asc'
    });
    queryService.addSize(query, 200);
    return queryService.searchByQueryWithRawResult(query).then(function (results) {
      data.listings = _map(_get(results, 'hits.hits'), '_source');
      data.listings.forEach(function (listing) {
        listing.sponsoredIndicator = getSponsoredIndicator(listing, data);
        listing.feedTeaser = getFeedTeaser(listing, data);
        setWebsiteLink(listing);
        setMediaRenditions(listing);
      });
      return data;
    });
  }

  return data;
}; // exported for tests in model.js


module.exports.getSponsoredIndicator = getSponsoredIndicator;
module.exports.getFeedTeaser = getFeedTeaser;
}, {"32":32,"37":37,"38":38,"49":49,"53":53,"75":75,"115":115}];
