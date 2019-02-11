window.modules["homepage-article-bar.client"] = [function(require,module,exports){'use strict';

var Hammer = require(112),
    _debounce = require(107),
    BREAKPOINT = 768,
    // mobile/tablet breakpoint
ANIMATION_DURATION = 250; // in milliseconds


DS.controller('homepage-article-bar', [function () {
  function Constructor(el) {
    var articlesEl = el.querySelector('.articles'),
        articlesWrapperEl = el.querySelector('.articles-wrapper'),
        articles = el.querySelectorAll('.homepage-article-bar-article'),
        currentSlide = 0,
        animating = false,
        hammertime,
        handleSwipeLeft = function handleSwipeLeft() {
      if (animating) return;

      if (currentSlide < articles.length - 1) {
        goToSlide(currentSlide + 1);
      }
    },
        handleSwipeRight = function handleSwipeRight() {
      if (animating) return;

      if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    },
        goToSlide = function goToSlide(targetSlide) {
      var point = getSnapPoints(articles)[targetSlide];
      animating = true;
      translateX(articlesEl, point, ANIMATION_DURATION, function () {
        currentSlide = targetSlide;
        animating = false;
      });
    },
        reset = function reset() {
      hammertime.off('swipeleft').off('swiperight');
      currentSlide = 0;
      translateX(articlesEl, 0);

      if (window.innerWidth < BREAKPOINT) {
        hammertime.on('swipeleft', handleSwipeLeft).on('swiperight', handleSwipeRight);
      }
    };

    if (!articlesEl) return;
    hammertime = new Hammer(articlesWrapperEl); // prevent default dragging behavior on links and images

    disableDrag(articlesEl.querySelectorAll('a, img')); // reset whenever window resizes as we may no longer want touch-dragging

    window.addEventListener('resize', _debounce(reset));
    reset();
  }
  /**
   * Disable default dragstart behavior of the specified DOM nodes
   * @param {NodeList} nodeList
   */


  function disableDrag(nodeList) {
    var i;

    for (i = 0; i < nodeList.length; i++) {
      nodeList[i].addEventListener('dragstart', function (e) {
        e.preventDefault();
      });
    }
  }
  /**
   * Translate an HtmlElement to position x, optionally animating
   * over a specified duration.
   * @param {HtmlElement} el
   * @param {number} x Absolute destination x
   * @param {number} [duration] In milliseconds
   * @param {function} [cb]
   */


  function translateX(el, x, duration, cb) {
    var initialTime = Date.now(),
        initialX = el.getBoundingClientRect().left,
        distance = x - initialX,
        easeOutQuad = function easeOutQuad(t) {
      return t * (2 - t);
    },
        step = function step() {
      var percComplete = (Date.now() - initialTime) / duration,
          x;

      if (percComplete > 1) {
        window.cancelAnimationFrame(step);
        if (cb) cb();
      } else {
        x = initialX + easeOutQuad(percComplete) * distance;
        el.style.transform = 'translate(' + x + 'px)';
        window.requestAnimationFrame(step);
      }
    };

    if (!duration) duration = 0;
    window.requestAnimationFrame(step);
  }
  /**
   * For the provided elements, return an array of "snap points",
   * which is their offsetLeft value plus a specified offset
   * @param {NodeList} nodeList
   * @param {number} offset
   * @returns {number}
   */


  function getSnapPoints(nodeList) {
    return [].slice.call(nodeList).map(function (node) {
      return -node.offsetLeft + getSlideItemOffset(node);
    });
  }
  /**
   * Return the distance from the left side of the slide viewer the
   * given slide item node should rest when it is snapped in center.
   * @param {HtmlElement} node
   * @returns {number}
   */


  function getSlideItemOffset(node) {
    return (node.parentNode.parentNode.offsetWidth - node.offsetWidth) / 2;
  }

  return Constructor;
}]);
}, {"107":107,"112":112}];
