window.modules["cut-section-feed.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _throttle = require(23);

DS.controller('cut-section-feed', ['$window', function ($window) {
  function Constructor(el) {
    this.el = el;
    this.hidden = dom.findAll(el, 'div[hidden]');
    this.articleGroup = dom.find(el, '.article-group');
    this.iterator = 0;
    this.btn = dom.find(el, '.pagination');
    this.largeScreen = $window.matchMedia('screen and (min-width: 1024px)').matches;
    window.addEventListener('scroll', _throttle(this.onScroll.bind(this), 200));
  }

  Constructor.prototype = {
    events: {
      '.pagination click': 'showHidden'
    },
    showHidden: function showHidden(e) {
      var iterator = this.iterator,
          // iterator keeps track of the hidden section that's next in line to be un-hidden
      click = e && e.type === 'click',
          newGroup = this.hidden[iterator];

      if (iterator < this.hidden.length) {
        click && e.preventDefault();

        while (newGroup.childNodes.length > 0) {
          this.articleGroup.appendChild(newGroup.childNodes[0]);
        }

        this.iterator++; // if we're un-hiding the contents of hidden[iterator], increment the iterator so we know whats next
      } // TODO: use $visibility service here


      if (this.iterator >= this.hidden.length) {
        this.btn.classList.remove('more-hidden');
      }
    },
    onScroll: function onScroll() {
      var rect = this.el.getBoundingClientRect(),
          html = document.documentElement || document.body,
          height = window.innerHeight || html.clientHeight,
          largeScreen = $window.matchMedia('screen and (min-width: 1024px)').matches; // on desktop, check to see if we're near the bottom of the newsfeed

      if (rect.bottom < height + 200 && largeScreen) {
        // 200px is around the height of a single newsfeed item
        // only automatically show new stuff on larger screens.
        // on smaller screens, pressing the button shows the next few items
        this.showHidden();
      }
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23}];
