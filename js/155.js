window.modules["155"] = [function(require,module,exports){'use strict';

var _map = require(37),
    _isObject = require(74),
    _join = require(166),
    _get = require(32),
    _pick = require(174),
    _reduce = require(124),
    _capitalize = require(145),
    socialsByline = require(1272);
/**
 * Comma separate a list of author strings
 * or simple-list objects
 *
 * @param  {Array} authorsList
 * @return {String}
 */


function formatSimpleByline(authorsList) {
  var authors = _map(authorsList, function (author) {
    return _isObject(author) ? author.text : author;
  });

  if (authors.length === 1) {
    return '<span>' + authors[0] + '</span>';
  } else if (authors.length === 2) {
    return '<span>' + authors[0] + '</span><span class="and"> and </span><span>' + authors[1] + '</span>';
  } else {
    return _join(_map(authors, function (author, idx) {
      if (idx < authors.length - 1) {
        return '<span>' + author + ', </span>';
      } else {
        return '<span class="and">and </span><span>' + author + '</span>';
      }
    }), '');
  }
}
/**
 * complexByline
 *
 * @param {Object} opts arguments and context passed from handlebars template
 * @returns {String}
 */


function complexByline(opts) {
  var bylines = _get(opts.hash, 'bylines', []),
      options = _pick(opts.hash, ['showSocial', 'authorHost', 'linkClass', 'nameClass', 'hideLinks', 'simpleList']);

  var names;

  if (options.simpleList) {
    return options.hideLinks ? formatSimpleByline(bylines) : socialsByline.formatSocialsByline(bylines, options);
  }

  return _join(_reduce(bylines, function (acc, byline, idx) {
    names = _get(byline, 'names', []);

    if (names && names.length > 0) {
      acc.push("<span>".concat(idx === 0 ? _capitalize(byline.prefix) : byline.prefix, "</span> ").concat(options.hideLinks ? formatSimpleByline(names) : socialsByline.formatSocialsByline(names, options)));
    }

    return acc;
  }, []), ' ');
}

module.exports = complexByline;
module.exports.byline = formatSimpleByline;
}, {"32":32,"37":37,"74":74,"124":124,"145":145,"166":166,"174":174,"1272":1272}];
