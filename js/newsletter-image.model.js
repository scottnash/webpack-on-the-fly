window.modules["newsletter-image.model"] = [function(require,module,exports){(function (__filename){
'use strict';

var striptags = require(42),
    utils = require(43),
    sanitize = require(39),
    mediaplay = require(53),
    styles = require(44),
    logger = require(81),
    log = logger.setup({
  file: __filename
}),
    allowedTags = ['strong', 'em', 'a']; // tags allowed in caption, credit, creditOverride

/**
 * Compiles styles if they're not empty
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
  }

  data.css = null;
  return data;
}
/**
 * Gets image type and credit from mediaplay
 * @param  {object} data
 * @return {Promise|object}
 */


function resolveMetadata(data) {
  if (!utils.isFieldEmpty(data.url)) {
    return mediaplay.getMediaplayMetadata(data.url).then(function (metadata) {
      // get image type, e.g. 'Photo'
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
  }
}
/**
 * Sets mediaplay rendition, fetch and sanitize metadata, render custom styles
 * @param  {string} uri
 * @param  {object} data
 * @return {Promise}
 */


module.exports.save = function (uri, data) {
  // default to horizontal rendition
  if (utils.isFieldEmpty(data.rendition)) {
    data.rendition = 'horizontal';
  } // sanitize url and get proper rendition


  if (!utils.isFieldEmpty(data.url)) {
    data.url = mediaplay.getRendition(sanitize.toPlainText(data.url), data.rendition);
  } // sanitize caption


  if (!utils.isFieldEmpty(data.caption)) {
    data.caption = sanitize.toSmartText(striptags(data.caption, allowedTags));
  } // sanitize credit override


  if (!utils.isFieldEmpty(data.creditOverride)) {
    data.creditOverride = sanitize.toSmartText(striptags(data.creditOverride, allowedTags));
  } // resolve promises for styles, and mediaplay metadata


  return Promise.all([resolveStyles(uri, data), resolveMetadata(data)]).then(function () {
    return data;
  }).catch(log);
};

}).call(this,"/components/newsletter-image/model.js")}, {"39":39,"42":42,"43":43,"44":44,"53":53,"81":81}];
