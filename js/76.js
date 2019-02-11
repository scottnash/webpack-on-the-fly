window.modules["76"] = [function(require,module,exports){'use strict';

var _head = require(25),
    _tail = require(910),
    _isString = require(164),
    _join = require(166),
    _get = require(32),
    striptags = require(42),
    cutChannels = {
  all: '',
  animals: 'Self/SoU',
  beauty: 'Style/Beauty',
  'career money productivity': 'Power/Money',
  celebrity: 'Culture/Celebrity',
  'crime-assault': 'Power',
  'culture-media': 'Culture',
  fashion: 'Style/Fashion',
  'feminism-politics-identity': 'Power/Politics',
  'relationships-friends family': 'Self',
  'health-wellness': 'Self/Health',
  'home design': 'Style/Design_Hunting',
  'learning creativity': 'Self/SoU',
  living: 'Style',
  other: '',
  parenting: 'Self/Motherhood',
  'mental health personality social behavior': 'Self',
  'relationships-sex dating marriage': 'Self/sex_relationships',
  shopping: 'Style/Shopping',
  weddings: 'Style/Weddings'
},
    vultureChannels = {
  tv: 'tv',
  music: 'music',
  movies: 'movies',
  books: 'books',
  comedy: 'comedy',
  art: 'art',
  theater: 'theater'
},
    nymChannels = {
  all: 'all',
  'company information': 'company',
  'new york guides & things to do': 'to-do',
  other: 'other',
  'sponsored guides': 's-guides'
};

function getAdSize(sizes) {
  var firstSize, firstValues;

  if (!sizes) {
    return;
  }

  firstSize = _head(sizes.split(','));
  firstValues = firstSize.split('x');
  return "width=\"".concat(_head(firstValues), "\" height=\"").concat(_tail(firstValues), "\"");
}

function getAdChannel(contentChannel, site) {
  if (!contentChannel) {
    return '';
  }

  switch (site) {
    case 'wwwthecut':
      return '/' + cutChannels[contentChannel.toLowerCase()] || '';
      break;

    case 'vulture':
      return '/' + vultureChannels[contentChannel.toLowerCase()] || '';
      break;

    case 'nymag':
      return '/' + nymChannels[contentChannel.toLowerCase()] || '';
      break;

    default:
      return '';
      break;
  }
}
/**
 * For AMP analytics transform the authors array into
 * a comma separated list of author names.
 *
 * @param {object[]} authors
 * @returns {string[]}
 */


function joinAuthors(authors) {
  if (!authors || !authors.length) {
    return '';
  }

  if (_isString(authors)) {
    return authors;
  }

  return _join(authors.map(function (author) {
    return _get(author, 'text', '').trim();
  }).filter(function (authorName) {
    return authorName !== '';
  }), ',');
}
/**
 * When utilizing an HTML string in the AMP context there are certain unallowable
 * attributes, we will use this function as a method to strip all of those unallowed
 * elements.
 *
 * 1. Remove all tags except strong, em, b, i, and a
 *
 * @param {string} html
 * @returns {string}
 */


function sanitizeHtmlForAmp(html) {
  if (!html || !_isString(html)) {
    return '';
  }

  return striptags(html, ['strong', 'em', 'b', 'i', 'a', 'br']);
}

module.exports.getAdSize = getAdSize;
module.exports.getAdChannel = getAdChannel;
module.exports.joinAuthors = joinAuthors;
module.exports.sanitizeHtmlForAmp = sanitizeHtmlForAmp;
}, {"25":25,"32":32,"42":42,"164":164,"166":166,"910":910}];
