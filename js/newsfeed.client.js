window.modules["newsfeed.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _isString = require(164),
    _throttle = require(23),
    _forEach = require(27),
    _map = require(37),
    _max = require(29);

DS.controller('newsfeed', ['$window', function ($window) {
  function Constructor(el) {
    this.el = el;
    this.hidden = dom.findAll(el, 'div[hidden]');
    this.iterator = 0;
    this.btn = dom.find(el, '.pagination');
    this.largeScreen = $window.matchMedia('screen and (min-width: 1180px)').matches;
    this.shrinkHeadlines = _isString(this.el.getAttribute('data-shrink-headlines')) && this.el.getAttribute('data-shrink-headlines') === 'true';

    if (this.shrinkHeadlines) {
      this.shrinkWrapHeadlines(this.el);
    }

    window.addEventListener('scroll', _throttle(this.onScroll.bind(this), 200));
  }

  Constructor.prototype = {
    events: {
      '.pagination click': 'showHidden'
    },
    showHidden: function showHidden(e) {
      var iterator = this.iterator,
          click = e && e.type === 'click',
          nextNewsfeedArticle;

      if (iterator < this.hidden.length) {
        click && e.preventDefault();
        this.hidden[iterator].removeAttribute('hidden');
        nextNewsfeedArticle = dom.find(this.hidden[iterator], '.newsfeed-article');
        nextNewsfeedArticle.focus();

        if (this.shrinkHeadlines) {
          this.shrinkWrapHeadlines(this.hidden[iterator]);
        }

        this.iterator++;
      }

      if (this.iterator >= this.hidden.length) {
        this.btn.classList.remove('more-hidden');
      }
    },
    onScroll: function onScroll() {
      var rect = this.el.getBoundingClientRect(),
          html = document.documentElement || document.body,
          height = window.innerHeight || html.clientHeight; // on desktop, check to see if we're near the bottom of the newsfeed

      if (rect.bottom < height + 200 && this.largeScreen) {
        // 200px is around the height of a single newsfeed item
        // only automatically show new stuff on larger screens.
        // on smaller screens, pressing the button shows the next few items
        this.showHidden();
      }
    },
    shrinkWrapHeadlines: function shrinkWrapHeadlines(elem) {
      var headlines = elem.querySelectorAll('.headline'),
          contentWidths,
          maxLineWidth; // For every headline in the feed, find the maximum line length of the content and shrink the wrapper to fit

      _forEach(headlines, function (headline) {
        contentWidths = _map(headline.getClientRects(), 'width');

        if (contentWidths.length) {
          maxLineWidth = Math.ceil(_max(contentWidths)) + 1;
          headline.style.maxWidth = maxLineWidth + 'px';
          headline.parentNode.classList.add('shrunk');
        }
      });
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23,"27":27,"29":29,"37":37,"164":164}];
