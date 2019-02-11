window.modules["read-more.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

DS.controller('read-more', [function () {
  function Constructor(el) {
    this.el = el;
    this.readMoreBtn = dom.find(el, '.read-more-trigger');
    this.componentList = dom.find(el, '.read-more-content');
    this.innerContent = dom.find(el, '.read-more-inner-wrap');
    this.readLess = el.getAttribute('data-readless');
    this.readMore = el.getAttribute('data-readmore');
    this.isExpanded = false;
  }

  Constructor.prototype = {
    events: {
      '.read-more-trigger click': 'readMoreToggle'
    },
    readMoreToggle: function readMoreToggle() {
      this.isExpanded ? this.showLess() : this.showMore();
    },
    showMore: function showMore() {
      // Get the height, and use it to calculate the transition speed (within the bounds of 200ms-1.3s)
      var contentHeight = this.innerContent.getBoundingClientRect().height,
          transitionDuration = Math.min(Math.max(0.5 * contentHeight, 200), 1300); // Expand

      this.componentList.style.transition = 'max-height ' + transitionDuration + 'ms ease';
      this.componentList.style.maxHeight = contentHeight + 'px';
      this.el.classList.add('expanded');
      this.innerContent.setAttribute('aria-hidden', false);
      this.innerContent.setAttribute('aria-expanded', true);
      this.readMoreBtn.setAttribute('aria-label', this.readLess);
      this.readMoreBtn.innerHTML = this.readLess;
      this.isExpanded = true; // Once the animation has run, set max-height to initial to guard against viewport changes.
      // Also remove the transition - safari will animate if it's still there.

      setTimeout(function () {
        this.componentList.style.transition = 'none';
        this.componentList.style.maxHeight = 'initial';
      }.bind(this), transitionDuration);
    },
    showLess: function showLess() {
      // Get the height, and use it to calculate the transition speed (within the bounds of 200ms-1.3s)
      var contentHeight = 0,
          transitionDuration = Math.min(Math.max(0.5 * contentHeight, 200), 1300); // Collapse

      this.componentList.style.transition = 'max-height ' + transitionDuration + 'ms ease';
      this.componentList.style.maxHeight = contentHeight;
      this.el.classList.remove('expanded');
      this.innerContent.setAttribute('aria-hidden', true);
      this.innerContent.setAttribute('aria-expanded', false);
      this.readMoreBtn.setAttribute('aria-label', this.readMore);
      this.readMoreBtn.innerHTML = this.readMore;
      this.isExpanded = false;
    }
  };
  return Constructor;
}]);
}, {"1":1}];
