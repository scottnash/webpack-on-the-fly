window.modules["meta-authors.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _get = require(32),
    _set = require(87),
    _last = require(24),
    _require = require(39),
    normalizeName = _require.normalizeName,
    queryService = require(49),
    log = require(81).setup({
  file: __filename,
  component: 'meta-author'
}),
    INDEX = 'authors';
/**
 * Munge elastic data into a standardized format
 * @param {Array<Object>} res
 * @returns {Object}
 */


function mungeData(res) {
  return res.map(function (author) {
    var twitter = author.twitter,
        facebook = author.facebook;
    author.social = author.social || {}; // make sure this exists if (for some reason) it doesn't

    if (twitter) {
      _set(author, 'social.twitter', twitter.replace(/^@/, '')); // remove @ sign if it exists

    }

    if (facebook) {
      _set(author, 'social.facebook', _last(facebook.split('/'))); // remove any url business and grab the username

    }

    return author;
  });
}
/**
 * Query elastic to get social media stuff for an author
 * @param {Object} query
 * @param {Array} names
 * @returns {Promise}
 */


function getAuthorData(query, names) {
  names.forEach(function (name) {
    queryService.addShould(query, {
      match: {
        'name.normalized': normalizeName(name)
      }
    });
  });
  queryService.addMinimumShould(query, 1);
  return queryService.searchByQuery(query).catch(function () {
    log('error', 'Error searching the author by query', {
      authors: names
    });
    return names.map(function (name) {
      return {
        name: name
      };
    });
  }).then(mungeData);
}

module.exports.save = function (ref, data, locals) {
  var query = queryService(INDEX, locals); // Normalize "authors" value; if saved from a Kiln form, it will be of the form
  // [{text: string}].

  data.authors = data.authors.map(function (author) {
    return typeof author === 'string' ? author : _get(author, 'text', '');
  });
  return getAuthorData(query, data.authors) // get social stuff for each author, returns array of promises
  .then(function (authorSocials) {
    data.authorSocials = authorSocials;
    return data;
  });
};

module.exports.render = function (ref, data) {
  // Transforms "authors" value into form [{text: string}] so it can be edited in
  // simple-list Kiln field.
  data.authors = data.authors.map(function (author) {
    return {
      text: author
    };
  });
  return data;
};

}).call(this,"/components/meta-authors/model.js")}, {"24":24,"32":32,"39":39,"49":49,"81":81,"87":87}];
