window.modules["181"] = [function(require,module,exports){/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Google Maps Service module.
 * @module @google/maps
 */

/**
 * Creates a Google Maps client. The client object contains all the API methods.
 *
 * @param {Object} options
 * @param {string} options.key API key (required, unless clientID and
 *     clientSecret provided).
 * @param {string=} options.clientId Maps API for Work client ID.
 * @param {string=} options.clientSecret Maps API for Work client secret (a.k.a.
 *     private key).
 * @param {string=} options.channel Maps API for Work channel.
 * @param {number=} options.timeout Timeout in milliseconds.
 *     (Default: 60 * 1000 ms)
 * @param {string=} options.language Default language for all queries.
        See https://developers.google.com/maps/faq#languagesupport
 * @param {number=} options.rate.limit Controls rate-limiting of requests.
 *     Maximum number of requests per period. (Default: 50)
 * @param {number=} options.rate.period Period for rate limit, in milliseconds.
 *     (Default: 1000 ms)
 * @param {number=} options.retryOptions.interval If a transient server error
 *     occurs, how long to wait before retrying the request, in milliseconds.
 *     (Default: 500 ms)
 * @param {Function=} options.Promise - Promise constructor (optional).
 * @return {GoogleMapsClient} The client object containing all API methods.
 */
 exports.createClient = function(options) {

  options = options || {};
  var makeApiCall = require(231).inject(options);
  var deprecate = require(230).deprecate;

  var makeApiMethod = function(apiConfig) {
    return function(query, callback, customParams) {
      query = apiConfig.validator(query);
      query.supportsClientId = apiConfig.supportsClientId !== false;
      query.options = apiConfig.options;
      if (options.language && !query.language) {
        query.language = options.language;
      }
      // Merge query and customParams.
      var finalQuery = {};
      customParams = customParams || {};
      [customParams, query].map(function(obj) {
        Object.keys(obj).sort().map(function(key) {
          finalQuery[key] = obj[key];
        });
      });
      return makeApiCall(apiConfig.url, finalQuery, callback);
    };
  };

  var geocode = require(223);
  var geolocation = require(224);
  var timezone = require(227);
  var directions = require(218);
  var distanceMatrix = require(221);
  var elevation = require(222);
  var roads = require(226);
  var places = require(225);

  return {
    directions: makeApiMethod(directions.directions),
    distanceMatrix: makeApiMethod(distanceMatrix.distanceMatrix),
    elevation: makeApiMethod(elevation.elevation),
    elevationAlongPath: makeApiMethod(elevation.elevationAlongPath),
    geocode: makeApiMethod(geocode.geocode),
    geolocate: makeApiMethod(geolocation.geolocate),
    reverseGeocode: makeApiMethod(geocode.reverseGeocode),
    findPlace: makeApiMethod(places.findPlace),
    places: makeApiMethod(places.places),
    placesNearby: makeApiMethod(places.placesNearby),
    placesRadar: deprecate(makeApiMethod(places.placesRadar), 'placesRadar is deprecated, see http://goo.gl/BGiumE'),
    place: makeApiMethod(places.place),
    placesPhoto: makeApiMethod(places.placesPhoto),
    placesAutoComplete: makeApiMethod(places.placesAutoComplete),
    placesQueryAutoComplete: makeApiMethod(places.placesQueryAutoComplete),
    snapToRoads: makeApiMethod(roads.snapToRoads),
    nearestRoads: makeApiMethod(roads.nearestRoads),
    speedLimits: makeApiMethod(roads.speedLimits),
    snappedSpeedLimits: makeApiMethod(roads.snappedSpeedLimits),
    timezone: makeApiMethod(timezone.timezone)
  };

};

exports.cli = require(228);
exports.util = require(229);
}, {"218":218,"221":221,"222":222,"223":223,"224":224,"225":225,"226":226,"227":227,"228":228,"229":229,"230":230,"231":231}];
