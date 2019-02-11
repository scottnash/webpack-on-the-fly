window.modules["26"] = [function(require,module,exports){'use strict';

var $window = window,
    $document = document,
    _filter = require(51),
    _map = require(37),
    _invokeMap = require(899),
    _assign = require(57),
    _throttle = require(23),
    Eventify = require(143);

var list = [],
    Visible,
    VisibleEvent,
    primaryContentEl; // need to hold on to this in case the page layout changes

/**
 * the purpose of the primaryContentEl is to calculate if other elements are above or below it
 * this helps product determine if a module is doing well in a certain position
 * there can only be one primary content element on a page
 * @param {Element} [el]
 */

function setPrimaryContent(el) {
  if (el) {
    primaryContentEl = el;
  }
}
/**
 * for position we only care if it is below the content or not
 * @param {Element} el - element to measure position relative to primary content
 * @returns {boolean}
 */


function isBelowPrimaryContent(el) {
  // calculating position lazily as this function is not called frequently and the position can change
  // alternative would be to cache primaryContentBottom and update on load and resize events
  var primaryContentRect = primaryContentEl && primaryContentEl.getBoundingClientRect(),
      elRect = el && el.getBoundingClientRect();
  return !!(primaryContentRect && elRect && primaryContentRect.bottom < elRect.top);
}
/**
 * @param {number} a
 * @param {number} b
 * @returns {*}
 * @see http://jsperf.com/math-min-vs-if-condition-vs/8
 */


function min(a, b) {
  return a < b ? a : b;
}
/**
 * @param {number} a
 * @param {number} b
 * @returns {*}
 * @see http://jsperf.com/math-min-vs-if-condition-vs/8
 */


function max(a, b) {
  return a > b ? a : b;
}
/**
 * Fast loop through watched elements
 */


function updateVisibility() {
  list.forEach(updateVisibilityForItem);
}
/**
 * updates seen property
 * @param  {Visble} item
 * @param  {{}} evt
 * @fires Visible#shown
 * @fires Visible#hidden
 */


function updateSeen(item, evt) {
  var px = evt.visiblePx,
      percent = evt.visiblePercent; // if some pixels are visible and we're greater/equal to threshold

  if (px && percent >= item.shownThreshold && !item.seen) {
    item.seen = true;
    setTimeout(function () {
      item.trigger('shown', new VisibleEvent('shown', evt));
    }, 15); // if no pixels or percent is less than threshold
  } else if ((!px || percent < item.hiddenThreshold) && item.seen) {
    item.seen = false;
    setTimeout(function () {
      item.trigger('hidden', new VisibleEvent('hidden', evt));
    }, 15);
  }
}
/**
 * sets preload property
 * @param  {Visible} item
 * @param  {{}} evt
 * @param  {Number} innerHeight
 * @fires Visible#preload
 */


function updatePreload(item, evt, innerHeight) {
  if (!item.preload && item.preloadThreshold && shouldBePreloaded(evt.target, evt.rect, item.preloadThreshold, innerHeight)) {
    item.preload = true;
    setTimeout(function () {
      item.trigger('preload', new VisibleEvent('preload', evt));
    }, 15);
  }
}
/**
 * Trigger events
 * @param {Visible} item
 */


function updateVisibilityForItem(item) {
  var rect = item.el.getBoundingClientRect(),
      innerHeight = $window.innerHeight || $document.documentElement.clientHeight,
      px = getVerticallyVisiblePixels(rect, innerHeight),
      percent = px / (rect.height || innerHeight),
      evt = {
    target: item.el,
    rect: rect,
    visiblePx: px,
    visiblePercent: percent
  };
  updateSeen(item, evt);
  updatePreload(item, evt, innerHeight);
}
/**
 * Return normalized viewport height
 * @return {number}
 */


function getViewportHeight() {
  return $window.innerHeight || $document.documentElement.clientHeight || $document.body.clientHeight;
}
/**
 * Return normalized viewport width
 * @return {number}
 */


function getViewportWidth() {
  return $window.innerWidth || $document.documentElement.clientWidth || $document.body.clientWidth;
}
/**
 * make sure an element isn't hidden by styles or etc
 * @param  {Element}  el
 * @return {Boolean}
 */


function isElementNotHidden(el) {
  return el && el.offsetParent !== null && !el.getAttribute('hidden') && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden';
}
/**
 * Apparently the fastest way...
 * @param {Element} el
 * @returns {boolean}
 * @example if (!$visibility.isElementInViewport(el)) { ... }
 */


function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= ($window.innerHeight || $document.documentElement.clientHeight) && rect.right <= ($window.innerWidth || $document.documentElement.clientWidth);
}
/**
 * Simple 2D box collision detection
 * @param {Element} element
 * @param {Element} possibleContainingElement
 * @returns {boolean}
 * @example if ($visibility.isElementVisibleInsideAnother(el, el.parent)) { ... }
 */


function isElementInsideAnother(element, possibleContainingElement) {
  var elementRect = element.getBoundingClientRect(),
      possibleContainingElementRect = possibleContainingElement.getBoundingClientRect();
  return elementRect.top >= possibleContainingElementRect.top && elementRect.left >= possibleContainingElementRect.left && elementRect.bottom <= possibleContainingElementRect.bottom && elementRect.right <= possibleContainingElementRect.right;
}
/**
 * @param {Element} el
 * @param  {ClientRect} rect
 * @param {Number} preloadThreshold
 * @param {Number} innerHeight
 * @return {Boolean}
 */


function shouldBePreloaded(el, rect, preloadThreshold, innerHeight) {
  return rect.bottom > preloadThreshold * -1 && rect.top <= innerHeight + preloadThreshold && isElementNotHidden(el);
}
/**
 * Create a one-dimensional spacial hash of x
 * @param {number} x
 * @param {number} stepSize
 * @param {number} optimalK
 * @param {number} base
 * @return {number}
 */


function getLinearSpacialHash(x, stepSize, optimalK, base) {
  var index = Math.floor(x / (stepSize || 1)),
      remainder = x % stepSize,
      result = index.toString(base);

  if (optimalK > 1) {
    result += getLinearSpacialHash(remainder, Math.floor(stepSize / base), optimalK - 1, base);
  }

  return result;
}
/**
 * @param {ClientRect} rect
 * @param {number} innerHeight
 * @returns {number}
 */


function getVerticallyVisiblePixels(rect, innerHeight) {
  return min(innerHeight, max(rect.bottom, 0)) - min(max(rect.top, 0), innerHeight);
}
/**
 * Get offset of element relative to entire page
 *
 * @param {Element} el
 * @returns {{left: number, top: number}}
 * @see http://jsperf.com/offset-vs-getboundingclientrect/7
 */


function getPageOffset(el) {
  var offsetLeft = el.offsetLeft,
      offsetTop = el.offsetTop;

  while (el = el.offsetParent) {
    offsetLeft += el.offsetLeft;
    offsetTop += el.offsetTop;
  }

  return {
    left: offsetLeft,
    top: offsetTop
  };
}
/**
 * Execute function when any of the selectors become visible
 *
 * Safely stops watching all selectors after first 'shown' event.
 *
 * @param {string} selector
 * @param {function} fn
 * @returns {[Visible]}  Array of elements that we're watching for visibility
 */


function watchForAny(selector, fn) {
  var el, visibleList;
  selector = selector.split(',');
  visibleList = _filter(_map(selector, function (selector) {
    el = $document.querySelector(selector);
    return el && new Visible(el).on('shown', function () {
      // stop watching for visibility
      _invokeMap(visibleList, 'destroy'); // let them proceed


      fn();
    });
  }));
  return visibleList;
}
/**
 * Create a new Visible class to observe when elements enter and leave the viewport
 *
 * Call destroy function to stop listening (this is until we have better support for watching for Node Removal)
 * @param {Element} el
 * @param {Object} [options]
 * @param {number} [options.preloadThreshold]
 * @param {number} [options.shownThreshold] Percentage of element that must be visible to trigger a "shown" event
 * @param {number} [options.hiddenThreshold] Percentage of element that must be visible to trigger a "hidden" event
 * @class
 * @example  this.visible = new $visibility.Visible(el);
 */


Visible = function Visible(el, options) {
  options = options || {};
  this.el = el;
  this.seen = false;
  this.preload = false;
  this.preloadThreshold = options && options.preloadThreshold || 0;
  this.shownThreshold = options && options.shownThreshold || 0;
  this.hiddenThreshold = options && min(options.shownThreshold, options.hiddenThreshold) || 0; // protect against adding undefined elements which cause the entire service to error on scroll if theyre added to the list

  if (this.el) {
    list.push(this);
    updateVisibilityForItem(this); // set immediately to visible or not
  }
};

Visible.prototype = {
  /**
   * Stop triggering.
   */
  destroy: function destroy() {
    // remove from list
    var index = list.indexOf(this);

    if (index > -1) {
      list.splice(index, 1);
    }
  }
  /**
   * @name Visible#on
   * @function
   * @param {'shown'|'hidden'} e  EventName
   * @param {function} cb  Callback
   */

  /**
   * @name Visible#trigger
   * @function
   * @param {'shown'|'hidden'} e
   * @param {{}}
   */

};
Eventify.enable(Visible.prototype);

VisibleEvent = function VisibleEvent(type, options) {
  this.type = type;

  _assign(this, options);
}; // listen for scroll events (throttled)


$document.addEventListener('scroll', _throttle(updateVisibility, 200)); // public

module.exports.getPageOffset = getPageOffset;
module.exports.getLinearSpacialHash = getLinearSpacialHash;
module.exports.getVerticallyVisiblePixels = getVerticallyVisiblePixels;
module.exports.getViewportHeight = getViewportHeight;
module.exports.getViewportWidth = getViewportWidth;
module.exports.isElementNotHidden = isElementNotHidden;
module.exports.isElementInViewport = isElementInViewport;
module.exports.isElementInsideAnother = isElementInsideAnother;
module.exports.watchForAny = watchForAny;
module.exports.Visible = Visible;
module.exports.setPrimaryContent = setPrimaryContent;
module.exports.isBelowPrimaryContent = isBelowPrimaryContent;
module.exports.updateVisibility = updateVisibility;
}, {"23":23,"37":37,"51":51,"57":57,"143":143,"899":899}];
