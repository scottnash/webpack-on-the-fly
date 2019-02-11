window.modules["progress-bar.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _throttle = require(23),
    _debounce = require(107);

DS.controller('progress-bar', [function () {
  function Constructor(el) {
    this.el = el;
    this.expandingBar = dom.find(this.el, '.expanding-progress-bar');
    this.article = document.querySelector('.article');
    this.firstElementAfterHeader = document.querySelector('.article > *:not(header)');

    if (this.article && this.firstElementAfterHeader) {
      window.addEventListener('load', function () {
        this.getMeasurements();
        window.addEventListener('scroll', _throttle(this.revealProgressBar.bind(this), 30));
        window.addEventListener('resize', _debounce(this.getMeasurements.bind(this), 300));
      }.bind(this));
    }
  }

  Constructor.prototype = {
    getMeasurements: function getMeasurements() {
      this.articleHeight = this.article.offsetHeight;
      this.startingPosition = this.firstElementAfterHeader.getBoundingClientRect().top + window.scrollY;
      this.endingPosition = this.article.getBoundingClientRect().bottom + window.scrollY;
      this.preBarArticleHeight = Math.abs(this.article.getBoundingClientRect().top - this.firstElementAfterHeader.getBoundingClientRect().top);
      this.articleWithBarHeight = this.articleHeight - this.preBarArticleHeight;
      this.setBarWidth();
    },
    revealProgressBar: function revealProgressBar() {
      if (window.scrollY > this.startingPosition && window.scrollY < this.endingPosition) {
        this.el.style.display = 'block';
        this.expandingBar.style.display = 'block';
        this.setBarWidth();
      } else {
        this.el.style.display = 'none';
        this.expandingBar.style.display = 'none';
      }
    },
    setBarWidth: function setBarWidth() {
      var currentPosPastStartingPos = window.scrollY - this.startingPosition,
          amountScrolled = currentPosPastStartingPos / (this.articleWithBarHeight - window.innerHeight),
          barWidth = amountScrolled * 100 + '%';
      this.expandingBar.style.width = barWidth;
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23,"107":107}];
