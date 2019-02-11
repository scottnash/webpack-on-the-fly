window.modules["space-logic.model"] = [function(require,module,exports){'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _get = require(32),
    _uniq = require(163),
    utils = require(43),
    has = utils.has,
    // `venience
logicChecker = require(185),
    timeLogic = require(186),
    dateFormat = require(52),
    dateParse = require(54);
/**
 * NOTE: There's some craziness in here. Whenever we want to reload
 * just one Logic component (or all) and not the whole page we
 * need access to the url that the user is currently on. Kiln passes
 * this in as a encoded parameter of the `locals.url` property,
 * so if it's there then we decode it and use that as the context.
 *
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


function get(ref, data, locals) {
  var localUrl = locals.url,
      queryParamKeys = _typeof(locals.query) === 'object' ? Object.keys(locals.query) : [],
      renderer = _get(locals, 'params.ext', null);

  if (!localUrl) {
    return data;
  }

  localUrl = utils.urlToCanonicalUrl(localUrl);

  if (localUrl && renderer === 'amp') {
    /**
     * AMP Urls will contain this special 'amp' string
     * in the URL so we should parse it out before proceeding
     * otherwise we will not get the appropriate URL to
     * check space logic against.
     */
    localUrl = localUrl.replace('/amp/', '/');
  } // Initialize displaySelf to false
  // (logic modules are responsible for setting true when applicable)


  data.displaySelf = false; // Check for no logic at all, this sometimes gets bypassed
  // at different stages in edit mode, but it's great in view
  // mode because it quickly identifies 'blank' logic components
  // and returns quickly.

  if (!logicChecker.noLogicCheck(data)) {
    data.displaySelf = true;
    return data;
  } // Run through the logic checker, which returns component data,
  // with displaySelf set to true if applicable


  return logicChecker(data, localUrl, queryParamKeys, locals);
}
/**
 * no duplicates, uppercase, or trailing spaces
 * @param {string} tagString
 * @returns {string}
 */


function cleanTags(tagString) {
  return _uniq(tagString.split(',').map(function (tag) {
    return tag && tag.trim().toLowerCase();
  })).join(',');
}
/**
 * set the start and end date
 * and format it correctly
 * @param  {object} data
 * @returns {Object}
 */


function formatDate(data) {
  if (has(data.startDay) || has(data.endDay)) {
    // make sure both date and time are set. if the user only set one, set the other to today / right now
    data.startDay = has(data.startDay) ? data.startDay : dateFormat(new Date(), 'YYYY-MM-DD');
    data.endDay = has(data.endDay) ? data.endDay : dateFormat(new Date(), 'YYYY-MM-DD');
    data.startTime = has(data.startTime) ? data.startTime : dateFormat(new Date(), 'HH:mm');
    data.endTime = has(data.endTime) ? data.endTime : dateFormat(new Date(), 'HH:mm'); // generate the `date` data from these two fields

    data.startDate = dateFormat(dateParse(data.startDay + ' ' + data.startTime)); // ISO 8601 date string

    data.endDate = dateFormat(dateParse(data.endDay + ' ' + data.endTime)); // ISO 8601 date string
  }

  return data;
}
/**
 * update space logic
 * @param {string} ref
 * @param {object} data
 * @returns {Promise}
 */


function updateSelf(ref, data) {
  if (data) {
    // Check if the times are formatted properly
    data = formatDate(data);
    data = timeLogic.onUpdate(data);

    if (data.tags) {
      data.tags = cleanTags(data.tags); // clean tags on PUT for efficiency
    }
  }

  return data;
}

module.exports.render = get;
module.exports.save = updateSelf;
}, {"32":32,"43":43,"52":52,"54":54,"163":163,"185":185,"186":186}];
