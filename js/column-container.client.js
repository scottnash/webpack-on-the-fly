window.modules["column-container.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    $gtm = require(41);

DS.controller('column-container', [function () {
  function Constructor(el) {
    this.el = el;
    this.moreBtn = dom.find(el, '.more-button');
    this.columnRow = dom.find(el, '.column');
    this.innerContent = dom.find(el, '.column-item');
    this.removeOverflow = dom.find(el, '.overflow-hidden');
    this.less = el.getAttribute('data-less');
    this.more = el.getAttribute('data-more');
    this.collapsedHeight = this.columnRow.getBoundingClientRect().height;
    this.isExpanded = false;
    this.init();
  }

  Constructor.prototype = {
    events: {
      '.more-button click': 'moreLessToggle'
    },
    init: function init() {
      var transitionDuration = Math.min(Math.max(0.5 * this.collapsedHeight, 100), 1000); // when the read more button is selected initialize the row

      if (this.columnRow.classList.contains('hide-content')) {
        this.columnRow.style.transition = 'max-height ' + transitionDuration + 'ms ease';
        this.columnRow.style.maxHeight = this.collapsedHeight + 'px';
      }
    },
    moreLessToggle: function moreLessToggle() {
      this.isExpanded ? this.showLess() : this.showMore();
    },
    showMore: function showMore() {
      // Get the height, and use it to calculate the transition speed (within the bounds of 200ms-1.3s)
      var contentHeight = this.innerContent.getBoundingClientRect().height,
          transitionDuration = Math.min(Math.max(0.5 * contentHeight, 100), 1000); // Expand

      this.columnRow.style.transition = 'max-height ' + transitionDuration + 'ms ease';
      this.columnRow.style.maxHeight = contentHeight + 'px';
      this.innerContent.setAttribute('aria-expanded', true);
      this.columnRow.classList.remove('hide-content');
      this.moreBtn.setAttribute('aria-label', this.less);
      this.moreBtn.innerHTML = this.less;
      this.isExpanded = true; // Once the animation has run, set max-height to initial to guard against viewport changes.
      // Also remove the transition - safari will animate if it's still there.

      setTimeout(function () {
        this.columnRow.style.transition = 'none';
        this.columnRow.style.maxHeight = 'initial';
      }.bind(this), transitionDuration); // GA tracking for read more

      $gtm.reportCustomEvent({
        category: 'interactive',
        label: 'column container',
        action: 'read more'
      });
    },
    showLess: function showLess() {
      // Get the height, and use it to calculate the transition speed (within the bounds of 200ms-1.3s)
      var contentHeight = this.collapsedHeight,
          transitionDuration = Math.min(Math.max(0.5 * this.contentHeight, 500), 1600); // Collapse

      this.columnRow.style.transition = 'max-height ' + transitionDuration + 'ms ease';
      this.columnRow.style.maxHeight = contentHeight + 'px';
      this.innerContent.setAttribute('aria-expanded', false);
      this.columnRow.classList.add('hide-content');
      this.moreBtn.setAttribute('aria-label', this.more);
      this.moreBtn.innerHTML = this.more;
      this.isExpanded = false; // GA tracking for read less

      $gtm.reportCustomEvent({
        category: 'interactive',
        label: 'column container',
        action: 'read less'
      });
    }
  };
  return Constructor;
}]);
}, {"1":1,"41":41}];
