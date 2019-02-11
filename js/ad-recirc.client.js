window.modules["ad-recirc.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _throttle = require(23);

DS.controller('ad-recirc', ['$window', function ($window) {
  /**
   * add the .relative class to an element's parent
   * this is needed to remove sticky positioning from .ad-splash
   * @param {Element} el
   * @param {boolean} setRelative
   */
  function setRelativePosition(el, setRelative) {
    var adRecircContainer = el.parentNode,
        buffer = dom.find('.ad-recirc-buffer');

    if (setRelative) {
      adRecircContainer.classList.remove('fixed');
      buffer.style.height = 0;
    }
  }
  /**
   * buffer is an empty div with a specified height
   * it takes up the space of the ad-recirc element,
   * so the page doesn't jump when ad-recirc becomes fixed/relatively positioned
   * @param {Element} el
   */


  function addBuffer(el) {
    var adRecircContainer = el.parentNode,
        adRecircContainerParent = adRecircContainer.parentNode,
        buffer = document.createElement('div');
    adRecircContainerParent.insertBefore(buffer, adRecircContainer);
    buffer.classList.add('ad-recirc-buffer');
    buffer.style.height = 0; // height is zero initially. it's set by the scroll handler
  }
  /**
   * check if the timer has been cleared, and if not call showLink()
   */


  function checkAndShow() {
    if (this.timer) {
      if (this.disableRecirc) {
        // don't show the link and unset the fixed positioning
        setRelativePosition(this.el, true);
        $window.removeEventListener('scroll', this.scrollHandler);
      } else {
        // show the link
        this.showLink();
        this.adRecirShown = true;
      }
    }
  }

  function AdRecirc(el) {
    var delay = el.getAttribute('data-delay'),
        disableRecirc = el.getAttribute('data-disable-recirc'),
        isMobile = $window.innerWidth < 768; // add other properties onScroll will need

    this.delay = parseFloat(delay) * 1000; // change delay from seconds into milliseconds

    this.disableRecirc = disableRecirc === 'true';
    this.el = el;
    this.linkEl = el.querySelector('.ad-recirc-link'); // grab the elements for the inner ad and items, so they can be shown/hidden

    this.adEl = el.querySelector('.ad-wrapper');
    this.itemEl = el.querySelector('.ad-recirc-item');
    this.headerHeight = dom.find('.page-header').clientHeight;
    this.adRecircContainer = el.parentNode;
    this.adRecircContainerHeight = this.adRecircContainer.clientHeight; // onload this flag will be set. it's set to false once the ad has stickied

    this.firstTime = true;
    this.hasAnchor = $window.location.href.indexOf('#') > -1;

    if (isMobile) {
      addBuffer(el);
      this.buffer = dom.find('.ad-recirc-buffer');
      this.scrollHandler = _throttle(this.onScroll.bind(this), 200);
      $window.addEventListener('scroll', this.scrollHandler);
    }
  }

  ;
  /**
   * show the component's link
   */

  AdRecirc.prototype.showLink = function () {
    var itemEl = this.itemEl,
        adEl = this.adEl,
        el = this.el,
        adRecircContainer = el.parentNode;
    adEl.classList.add('hide');
    itemEl.classList.add('show');
    adRecircContainer.classList.add('recirculating');
  };
  /**
   * hide the component's link
   */


  AdRecirc.prototype.hideLink = function () {
    var itemEl = this.itemEl,
        adEl = this.adEl,
        el = this.el,
        adRecircContainer = el.parentNode;
    adRecircContainer.classList.remove('recirculating');
    itemEl.classList.remove('show');
    adEl.classList.remove('hide'); // also unset the fixed positioning

    setRelativePosition(el, true);
  };

  AdRecirc.prototype.onScroll = function () {
    var scrollPos = document.body.scrollTop,
        userAtTop = scrollPos <= this.headerHeight,
        delayFixed = 0,
        setFixed = function setFixed() {
      // set ad-recirc to fixed positioning so mobile users can see it if
      // they are on the middle of the page
      var adRecircContainer = this.el.parentNode;
      adRecircContainer.classList.add('fixed'); // set the timer as a scoped property, so it can be checked inside the checkAndShow function

      this.timer = $window.setTimeout(checkAndShow.bind(this), this.delay);
    };

    if (this.adRecirShown && userAtTop) {
      // if user has scrolled to the top of the page, turn ad-recirc off
      // if we've scrolled to the untilComponent element, turn ad-recirc off
      this.hideLink(); // also kill the timer if it's still going

      $window.clearTimeout(this.timer);
      this.timer = null; // js doesn't do anything to let us know timeouts have been cleared, so make this null

      $window.removeEventListener('scroll', this.scrollHandler);
    }

    if (this.firstTime && scrollPos >= this.headerHeight) {
      // if the url uses an anchor, delay showing ad-recirc so it doesn't
      // cover the element with the anchor
      if (this.hasAnchor) {
        delayFixed = 5000;
      }

      $window.setTimeout(setFixed.bind(this), delayFixed);
      this.buffer.style.height = this.adRecircContainerHeight + 'px';
      this.firstTime = false;
    }
  };

  return AdRecirc;
}]);
}, {"1":1,"23":23}];
