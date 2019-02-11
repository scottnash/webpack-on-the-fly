window.modules["search-results.client"] = [function(require,module,exports){'use strict';

var _throttle = require(23);

module.exports = function (el) {
  var btn = el.querySelector('.pagination'),
      throttledOnScroll = _throttle(onScroll, 200);

  window.addEventListener('scroll', throttledOnScroll);
  btn.addEventListener('click', showHidden);

  function showHidden(e) {
    var click = e && e.type === 'click',
        nextHidden = el.querySelector('.article-group.hidden'),
        nextArticle;

    if (nextHidden) {
      click && e.preventDefault();
      nextHidden.classList.remove('hidden');
      nextArticle = nextHidden.querySelector('.search-results-article');

      if (nextArticle) {
        nextArticle.focus();
      }
    } else {
      btn.classList.remove('more-hidden');
      window.removeEventListener('scroll', throttledOnScroll);
    }
  }

  function onScroll() {
    var html = document.documentElement || document.body,
        height = window.innerHeight || html.clientHeight; // on desktop only, automatically show new stuff if we're
    // near the bottom of the search results
    // on smaller screens, pressing the button shows the next few items

    if (window.matchMedia('screen and (min-width: 1180px)').matches && el.getBoundingClientRect().bottom < height + 200) {
      showHidden();
    }
  }
};
}, {"23":23}];
