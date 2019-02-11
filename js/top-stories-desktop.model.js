window.modules["top-stories-desktop.model"] = [function(require,module,exports){'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _pickBy = require(59),
    _keys = require(128),
    queryService = require(49),
    ELASTIC_INDEX = 'published-articles',
    ELASTIC_FIELDS = ['plaintextPrimaryHeadline', 'primaryHeadline', 'canonicalUrl', 'pageUri'];
/**
 * Given an Elastic query object, add a should clause matching
 * articles that have the specified tag.
 * @param {object} query
 * @param {string} tag
 * @return {object}
 */


function shouldHaveTag(query, tag) {
  queryService.addShould(query, {
    bool: {
      filter: {
        prefix: {
          tags: tag
        }
      }
    }
  });
  return query;
}
/**
 * Given an Elastic query object, add a should clause matching
 * articles that have ALL of the specified story characteristics.
 * @param {object} query
 * @param {string[]} checkedCharacteristics
 * @return {object}
 */


function shouldHaveStoryCharacteristics(query, checkedCharacteristics) {
  var clauses = checkedCharacteristics.map(function (char) {
    return {
      term: _defineProperty({}, "storyCharacteristics.".concat(char), true)
    };
  });
  queryService.addShould(query, {
    bool: {
      filter: clauses
    }
  });
  return query;
}
/**
 * @param {string} ref
 * @param {object} data
 * @param {object} locals
 * @returns {Promise}
 */


module.exports.render = function (ref, data, locals) {
  var query = queryService.newQueryWithCount(ELASTIC_INDEX, data.size, locals);

  if (data.tag) {
    shouldHaveTag(query, data.tag);
  }

  if (data.storyCharacteristics) {
    shouldHaveStoryCharacteristics(query, _keys(_pickBy(data.storyCharacteristics)));
  }

  if (data.tag || data.storyCharacteristics) {
    queryService.addMinimumShould(query, 1);
  }

  queryService.withinThisSiteAndCrossposts(query, locals.site);
  queryService.onlyWithTheseFields(query, ELASTIC_FIELDS);
  queryService.addSort(query, {
    date: 'desc'
  });
  return queryService.searchByQuery(query).then(function (results) {
    data.articles = results;
    return data;
  }).catch(function (e) {
    queryService.logCatch(e, ref);
    return data;
  });
};
}, {"49":49,"59":59,"128":128}];
