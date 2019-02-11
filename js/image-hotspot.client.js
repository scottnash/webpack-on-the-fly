window.modules["image-hotspot.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

DS.controller('image-hotspot', [function () {
  function Constructor(el) {
    this.el = el;
    this.imageItem = dom.findAll(this.el, '.image-hotspot-item-first-column');
    this.hotspotIcon = dom.findAll(this.el, '.image-hotspot-info-icon');
    this.hotspotIndex = dom.findAll(this.el, '.hotspot-index');
    this.selectedIndex = 0;
    this.init();
  }

  Constructor.prototype = {
    events: {
      '.image-hotspot-info-icon click': 'handleClick'
    },
    init: function init() {
      // set the first icon's active and aria-expanded
      this.hotspotIndex[this.selectedIndex].classList.add('active');
      this.hotspotIcon[this.selectedIndex].setAttribute('aria-expanded', true);
    },

    /* update the current sections aria-expanded
     * @param {number} newIndex - index for the next selected section
     */
    selectedHotspot: function selectedHotspot(newIndex) {
      if (newIndex >= 0 && newIndex < this.hotspotIcon.length) {
        this.hotspotIcon[this.selectedIndex].setAttribute('aria-expanded', false);
        this.hotspotIcon[newIndex].setAttribute('aria-expanded', true);
        this.selectedIndex = newIndex;
      }
    },
    handleClick: function handleClick(e) {
      var i,
          parentDiv = dom.closest(e.target, 'button'),
          position = parentDiv.parentElement.getAttribute('data-index'); // update the aria-expanded state

      this.selectedHotspot(position);

      for (i = 0; i < this.imageItem.length; i++) {
        if (i == position) {
          this.imageItem[i].classList.add('show');
          this.hotspotIndex[i].classList.add('active');
        } else {
          this.imageItem[i].classList.remove('show');
          this.hotspotIndex[i].classList.remove('active');
        }
      }
    }
  };
  return Constructor;
}]);
}, {"1":1}];
