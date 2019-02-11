window.modules["1272"] = [function(require,module,exports){'use strict';

var socialSvgs = require(1279),
    _require = require(39),
    normalizeName = _require.normalizeName,
    twitterHtml = function twitterHtml(authorData) {
  return "<a href=\"http://twitter.com/".concat(authorData.twitter, "\" target='_blank' class=\"author-socials\"><span class=\"author-socials-icon twitter\">").concat(socialSvgs.TWITTER, "</span><span>@").concat(authorData.twitter, "</span></a>");
},
    fbHtml = function fbHtml(authorData) {
  return "<a href=\"http://facebook.com/".concat(authorData.facebook, "\" target='_blank' class=\"author-socials\"><span class=\"author-socials-icon facebook\">").concat(socialSvgs.FACEBOOK, "</span><span>").concat(authorData.facebook, "</span></a>");
},
    igHtml = function igHtml(authorData) {
  return "<a href=\"http://instagram.com/".concat(authorData.instagram, "\" target='_blank' class=\"author-socials\"><span class=\"author-socials-icon instagram\">").concat(socialSvgs.INSTAGRAM, "</span><span>@").concat(authorData.instagram, "</span></a>");
};
/**
 * Add structured data for author pages for Google
 * to author HTML with socials
 * @param {Object[]} authorsAndMeta e.g. [{name: "Max Read", twitter:"max_read", facebook:"", instagram:""}]
 * @param {Object} options
 * @param {String} options.authorHost e.g. 'nymag.com'
 * @param {Boolean} options.showSocial
 * @param {String} [options.nameClass]
 * @param {String} [options.linkClass]
 * @return {String}
 */


function formatSocialsByline(authorsAndMeta, options) {
  var authorName = authorsAndMeta.length > 1 ? '' : ' class="author-name"';
  return "<span itemprop=\"author\" itemscope itemtype=\"http://schema.org/Person\"".concat(authorName, ">").concat(formatNumAuthors(authorsAndMeta, options), "</span>");
}
/**
 * Comma separate authors
 * @param {Object[]} authorsAndMeta e.g. [{name: "Max Read", twitter:"max_read", facebook:"", instagram:""}]
 * @param {Object} options
 * @param {String} options.authorHost e.g. 'nymag.com'
 * @param {Boolean} options.showSocial
 * @param {String} [options.nameClass]
 * @param {String} [options.linkClass]
 * @return {String}
 */


function formatNumAuthors(authorsAndMeta, options) {
  return authorsAndMeta.reduce(function (acc, item, index) {
    if (authorsAndMeta.length === 1) {
      // only display socials if there is one author
      if (options.showSocial) {
        return acc + createAuthorHtml(item, options) + createSocialsHtml(item);
      }

      return acc + createAuthorHtml(item, options);
    } else {
      if (index === authorsAndMeta.length - 1) {
        if (authorsAndMeta.length === 2) {
          return "".concat(acc, "<span> and </span>").concat(createAuthorHtml(item, options));
        } else {
          return "".concat(acc, "<span>, </span> <span> and </span>").concat(createAuthorHtml(item, options));
        }
      } else if (index > 0 && index < authorsAndMeta.length - 1) {
        return "".concat(acc, "<span>, </span>").concat(createAuthorHtml(item, options));
      } else {
        return acc + createAuthorHtml(item, options);
      }
    }
  }, '');
}
/**
 * Create HTML for the social media handles of the author
 * @param  {Object} authorData
 * @return {String}
 */


function createSocialsHtml(authorData) {
  var social = authorData.socialHandlePreference;
  var socialHtml = '';

  if (authorData[social]) {
    switch (social) {
      case 'twitter':
        socialHtml = twitterHtml(authorData);
        break;

      case 'facebook':
        socialHtml = fbHtml(authorData);
        break;

      case 'instagram':
        socialHtml = igHtml(authorData);
        break;

      default:
        socialHtml = '';
        break;
    }
  } else if (!social) {
    return getSocialHtmlWithoutPreference(authorData);
  }

  return socialHtml;
}
/**
 * getSocialHtmlWithoutPreference
 *
 * There is a chance that the article hasn't been saved since the author upgrade that adds social preference ran,
 * so fallback to using the old priority for social handles
 *
 * @param {Object} authorData
 * @returns {String} Social byline html
 */


function getSocialHtmlWithoutPreference(authorData) {
  if (authorData.twitter) {
    return twitterHtml(authorData);
  } else if (authorData.facebook) {
    return fbHtml(authorData);
  } else if (authorData.instagram) {
    return igHtml(authorData);
  }

  return '';
}
/**
 * Create HTML for the author, including
 * link to author page and meta-author tags
 * @param  {Object} authorData
 * @param {Object} options
 * @param {String} options.authorHost e.g. 'nymag.com'
 * @param {Boolean} options.showSocial
 * @param {String} [options.nameClass]
 * @param {String} [options.linkClass]
 * @return {String}
 */


function createAuthorHtml(authorData, options) {
  var nameOrText = authorData.name || authorData.text,
      sanitized = options.authorHost.indexOf('nymag.com') > -1 ? nameOrText : normalizeName(nameOrText.replace(/\s/g, '-')); // nymag.com author pages arent in clay yet, so use urls with spaces for those so they dont 404
  // multiline interpolation doesn't work here because whitespace will get interpreted literally

  return "<a href=\"//".concat(options.authorHost, "/author/").concat(encodeURIComponent(sanitized), "/\" rel=\"author\" class=\"").concat(options.linkClass ? options.linkClass : 'article-author', "\">") + "<span".concat(options.nameClass ? " class=\"".concat(options.nameClass, "\"") : '', ">").concat(nameOrText, "</span>") + "<meta itemprop=\"name\" content=\"".concat(nameOrText, "\"/>") + "<link itemprop=\"sameAs\" href=\"//".concat(options.authorHost, "/author/").concat(encodeURIComponent(sanitized), "\"/></a>");
}

module.exports.formatSocialsByline = formatSocialsByline; // For testing

module.exports.formatNumAuthors = formatNumAuthors;
module.exports.createSocialsHtml = createSocialsHtml;
module.exports.createAuthorHtml = createAuthorHtml;
}, {"39":39,"1279":1279}];
