window.modules["mediaplay-image.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var _assign = require(57),
    striptags = require(42),
    slideshow = require(147),
    utils = require(43),
    sanitize = require(39),
    mediaplay = require(53),
    styles = require(44),
    log = require(81).setup({
  file: __filename,
  action: 'mediaplay-image'
}),
    allowedTags = ['strong', 'em', 'a']; // tags allowed in caption, credit, creditOverride

/**
 * compile styles if they're not empty
 * @param {string} uri
 * @param  {object} data
 * @return {Promise|object}
 */


function resolveStyles(uri, data) {
  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = null; // unset any compiled css

    return data;
  }
}
/**
 * get image type and credit from mediaplay
 * @param  {object} data
 * @return {Promise|object}
 */


function resolveMetadata(data) {
  if (!utils.isFieldEmpty(data.url)) {
    return mediaplay.getMediaplayMetadata(data.url).then(function (metadata) {
      /**
       * We do not know for how long Ratio was calculated incorrectly, so we should leave it like this
       * and decide later if it needs to be fixed.
       */
      data.ratio = null;

      try {
        var renditionDimensions = mediaplay.getCalculatedRenditionDimensionsFromMetadata(data.rendition, metadata);
        data.imageRenditionWidth = renditionDimensions.width;
        data.imageRenditionHeight = renditionDimensions.height;
      } catch (err) {
        log('error', 'Failed to Calculate Rendition Width/Height for Mediaplay Image', {
          message: err.message,
          uri: data.uri,
          rendition: data.rendition
        });
        data.imageRenditionWidth = null;
        data.imageRenditionHeight = null;
      } // get image type, e.g. 'Photo'


      data.imageType = metadata.imageType; // override the credit if user has set an override,
      // otherwise use the credit grabbed from mediaplay

      if (!utils.isFieldEmpty(data.creditOverride)) {
        data.credit = data.creditOverride; // already sanitized
      } else {
        // make sure we sanitize the data coming from mediaplay
        data.credit = sanitize.toSmartText(striptags(metadata.credit, allowedTags));
      }

      return data;
    });
  } else {
    data.imageType = null;
    data.credit = null;
    return data;
  }
}
/**
 * merge the results from our resolved values:
 * styles, ratio, and metadata
 * @param  {object} data
 * @return {function}
 */


function mergeResolvedValues(data) {
  return function (results) {
    return _assign(data, results[0], results[1]);
  };
} // /**
//  * provide zoom renditions for three breakpoints:
//  * @param  {object} data
//  * @return {function}
//  */


function getZoomImg(data) {
  if (!(data.rendition && data.url)) {
    return;
  }

  return {
    url: data.url,
    mobile: data.rendition,
    tablet: data.rendition,
    desktop: data.rendition,
    alt: data.alt
  };
}
/**
 * set mediaplay rendition, fetch and sanitize metadata, render custom styles
 * @param  {string} uri
 * @param  {object} data
 * @return {Promise}
 */


module.exports.save = function (uri, data) {
  // default to horizontal rendition
  if (utils.isFieldEmpty(data.rendition)) {
    data.rendition = 'horizontal';
  } // default to no slideshow type


  if (utils.isFieldEmpty(data.slideshowType)) {
    data.slideshowType = 'none';
  } // sanitize url and get proper rendition


  if (!utils.isFieldEmpty(data.url)) {
    data.url = mediaplay.getRendition(sanitize.toPlainText(data.url), data.rendition);
  } // sanitize caption


  if (!utils.isFieldEmpty(data.caption)) {
    data.caption = sanitize.toSmartText(striptags(data.caption, allowedTags));
  } // sanitize credit override


  if (!utils.isFieldEmpty(data.creditOverride)) {
    data.creditOverride = sanitize.toSmartText(striptags(data.creditOverride, allowedTags));
  } // resolve promises for styles, ratio, and mediaplay metadata


  return Promise.all([resolveStyles(uri, data), resolveMetadata(data)]).then(mergeResolvedValues(data));
};
/**
 * add slideshow link
 * @param  {string} uri
 * @param  {object} data
 * @param {object} locals
 * @return {object}
 */


module.exports.render = function (uri, data, locals) {
  data.zoomImg = getZoomImg(data);

  if (data.slideshowLocation && data.slideshowLocation === 'CQ') {
    return slideshow.addSlideshowLink(locals)(data);
  }

  return data;
};

}).call(this,"/components/mediaplay-image/model.js")}, {"39":39,"42":42,"43":43,"44":44,"53":53,"57":57,"81":81,"147":147}];
