window.modules["147"] = [function(require,module,exports){'use strict';

var _endsWith = require(895);
/* eslint complexity: ["error", 9] */

/**
 * formatUrl
 *
 * add correct path to make slideshow links generate correctly from non-article pages
 * or pages whose url ends with anything that isnt .html
 *
 * @param {string} url
 * @param {string} type
 * @returns {string} formatted url
 */


function formatUrl(url, type) {
  var formattedUrl = url.split('?')[0];

  if (type === 'fashion-runway' || _endsWith(formattedUrl, '.html')) {
    return formattedUrl;
  }

  if (_endsWith(formattedUrl, '/')) {
    return formattedUrl + 'slideshow/';
  } else {
    return formattedUrl + '/slideshow/';
  }
}
/**
 * @param  {string} localUrl
 * @return {string}
 */


function standardSlideshowLink(localUrl) {
  return localUrl.replace('.html', '/slideshow/');
}
/**
 * @param  {string} slideshowJSONPath
 * @param  {string} localUrl
 * @return {string}
 */


function premiumSlideshowLink(slideshowJSONPath, localUrl) {
  return localUrl.replace('.html', '/slideshow/') + slideshowJSONPath.replace('/slideshows/', '').replace('.slideshow.json', '/');
}
/**
 * example: /slideshows/fashion/2016/spring/paris/couture/maison-margiela/fashion-runway.slideshow.json
 * to: http://www.thecut.com/runway/2016/spring/paris/couture/maison-margiela/
 * @param  {string} slideshowJSONPath
 * @param  {string} localUrl
 * @return {string}
 */


function fashionShowSlideshowLink(slideshowJSONPath) {
  return slideshowJSONPath.replace('/slideshows/fashion/', '/runway/').replace('fashion-runway.slideshow.json', '');
}
/**
 * add slideshow link if it exists
 * @param {object} locals (to grab the current url of the page we're on)
 * @returns {Function}
 */


function addSlideshowLink(locals) {
  if (!locals) {
    return function (data) {
      return data;
    };
  }

  return function (data) {
    var type = data.slideshowType || data.type || 'none',
        url = locals.publishUrl || locals.url; // Remove query params from url so they aren't in the middle of the
    // slideshow path

    url = formatUrl(url, type); // only generate the link if there's a type other than 'none' and there's
    // a local url to generate the link from

    if (type && type !== 'none' && url) {
      switch (type) {
        case 'standard':
          data.slideshowLink = standardSlideshowLink(url);
          break;

        case 'fashion-runway':
          data.slideshowLink = fashionShowSlideshowLink(data.slideshowJSONPath, url);
          break;

        case 'fashion-lookbook':
          data.slideshowLink = premiumSlideshowLink(data.slideshowJSONPath, url);
          break;

        case 'fashion-editorial':
          data.slideshowLink = premiumSlideshowLink(data.slideshowJSONPath, url);
          break;

        default:
          data.slideshowLink = standardSlideshowLink(url);
          break;
      }
    } else {
      data.slideshowLink = null;
    }

    data.link = data.slideshowLink; // legacy support

    return data;
  };
}

module.exports.addSlideshowLink = addSlideshowLink;
}, {"895":895}];
