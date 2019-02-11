window.modules["1274"] = [function(require,module,exports){'use strict';

var mediaplay = require(53),
    noRes = mediaplay.getRenditionWithoutPixelDensity;
/**
 * Removes whitespace from specified string.
 * @param {string} str
 * @return {string}
 **/


function removeWhitespace(str) {
  return str.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
}
/**
 * Generate rendition urls
 * @param {Object} obj - A dynamic image object
 * @return {array}
 **/


function getRenditionUrls(obj) {
  return {
    mobile: mediaplay.getRenditionZoom(obj.url, obj.mobile, obj.zoom),
    tablet: mediaplay.getRenditionZoom(obj.url, obj.tablet, obj.zoom),
    desktop: mediaplay.getRenditionZoom(obj.url, obj.desktop, obj.zoom)
  };
}
/**
 * A handlebars helper for embedding an image whose rendition varies across
 * viewports. Unlike srcset, allows you to use images with varying aspect ratios.
 * Returns a <div> along with some style rules that give the <div> the correct
 * background and size it according to its rendition dimensions. This element
 * behaves much like a regular <img> element -- it shrinks to fit available
 * space while automatically preserving aspect ratio.
 * @param {Object} obj A dynamic image object
 * @param {string} obj.url mediaplay URL for image
 * @param {string} obj.mobile rendition name for mobile
 * @param {string} obj.tablet rendition name for tablet
 * @param {string} obj.desktop rendition name for desktop
 * @param {Boolean} obj.zoom should the zoom rendition be used
 * @param {string} opts.className class to use as img tag
 * @param {string} obj.origSrc img url to use as img src
 * @param {string} obj.origSrcSet img urls to use as img srcset
 * @param {string} obj.alt to use as img alt tag
 * @param {string} obj.origMeta all additional meta information required by image tag
 * @param {Object} context handlebars context
 * @param {Object} [context.hash] named options passed into helper from template
 * @param {Boolean} [context.hash.lazy] should images lazy-load
 * @return {string}
 **/


function dynamicImage(obj, context) {
  var opts = context && context.hash,
      tabletBreakpoint = '768px',
      desktopBreakpoint = '1180px';
  var alt,
      imgString = '',
      lazyPrefixSrc = '',
      renditions = {
    mobile: '',
    tablet: '',
    desktop: ''
  }; // only define these properties if there's a dynamic image object passed in.
  // The object would be undefined if a component that uses this helper was added
  // via the Kiln UI.

  if (obj) {
    alt = obj.alt ? obj.alt : '';
    renditions = getRenditionUrls(obj);
    lazyPrefixSrc = opts.lazy ? 'data-srcset' : 'srcset';
    imgString = "<img src=\"".concat(opts.lazy ? '' : noRes(renditions.mobile), "\" class=\"").concat(opts.className, "\" data-src=\"").concat(noRes(renditions.mobile), "\" data-content-img alt=\"").concat(alt, "\">");
  }

  return removeWhitespace("\n    <picture>\n      <source media=\"(min-resolution: 192dpi) and (min-width: ".concat(desktopBreakpoint, "), (-webkit-min-device-pixel-ratio: 2) and (min-width: ").concat(desktopBreakpoint, ")\" ").concat(lazyPrefixSrc, "=\"").concat(renditions.desktop, " 2x\"/>\n      <source media=\"(min-width: ").concat(desktopBreakpoint, ") \" ").concat(lazyPrefixSrc, "=\"").concat(noRes(renditions.desktop), "\"/>\n      <source media=\"(min-resolution: 192dpi) and (min-width: ").concat(tabletBreakpoint, "), (-webkit-min-device-pixel-ratio: 2) and (min-width: ").concat(tabletBreakpoint, ")\" ").concat(lazyPrefixSrc, "=\"").concat(renditions.tablet, " 2x\"/>\n      <source media=\"(min-width: ").concat(tabletBreakpoint, ")\" ").concat(lazyPrefixSrc, "=\"").concat(noRes(renditions.tablet), "\"/>\n      <source media=\"(min-resolution: 192dpi), (-webkit-min-device-pixel-ratio: 2)\" ").concat(lazyPrefixSrc, "=\"").concat(renditions.mobile, "\"/>\n      ").concat(imgString, "\n    </picture>\n  "));
}

module.exports = dynamicImage;
}, {"53":53}];
