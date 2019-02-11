window.modules["94"] = [function(require,module,exports){'use strict';

var $window = window,
    $visibility = require(26);
/**
 * LazyLoad class
 *
 * @param {Element} wrapper image container
 * @param {Element} img img tag
 * @param {NodeList} sources list of <source> tags (optional)
 */


var LazyLoader = function LazyLoader(wrapper, img, sources) {
  this.wrapper = wrapper;
  this.img = img;
  this.sources = sources;
  this.visibility = new $visibility.Visible(wrapper, {
    preloadThreshold: $window.innerHeight * 2
  });
};

LazyLoader.prototype = {
  /**
   * init
   *
   * listen for and handle visibility 'preload' event
   *
   */
  init: function init() {
    if (this.visibility.preload) {
      this.onPreload();
    } else {
      this.visibility.on('preload', this.onPreload.bind(this));
    }
  },
  onPreload: function onPreload() {
    this.setImgSrc();
    this.addImgLoadListener();
  },

  /**
   * setImgSrc
   *
   * sets src attribute on the img element (so source link is requested by the browser)
   * sets srcset attribute on each source element
   *
   */
  setImgSrc: function setImgSrc() {
    this.img.setAttribute('src', this.img.getAttribute('data-src'));

    if (this.sources) {
      this.sources.forEach(function (source) {
        source.setAttribute('srcset', source.getAttribute('data-srcset'));
      });
    }
  },
  addImgLoadListener: function addImgLoadListener() {
    if (this.img.complete) {
      this.onImageLoad();
    } else {
      this.img.addEventListener('load', this.onImageLoad.bind(this));
    }
  },
  onImageLoad: function onImageLoad() {
    if (this.visibility.seen) {
      this.onShown();
    } else {
      this.visibility.on('shown', this.onShown.bind(this));
    }
  },
  onShown: function onShown() {
    this.fadeIn();
    this.visibility.destroy();
  },

  /**
   * fadeIn
   *
   * Fades in the wrapper. Removes the fade class after wrapper fades in
   * to prevent the image from fading again if it's hidden and shown again
   * after it has been loaded.
   *
   */
  fadeIn: function fadeIn() {
    var wrapper = this.wrapper;
    wrapper.classList.remove('hidden');
    wrapper.classList.add('fade-in-element');
    setTimeout(function () {
      wrapper.classList.remove('fade-in-element');
    }, 2000);
  }
};
module.exports.LazyLoader = LazyLoader;
}, {"26":26}];
