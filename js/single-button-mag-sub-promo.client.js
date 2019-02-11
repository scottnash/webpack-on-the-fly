window.modules["single-button-mag-sub-promo.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

DS.controller('single-button-mag-sub-promo', [function () {
  function Constructor(el) {
    this.el = el;
    this.itemsList = el.querySelector('.items');
    this.collapsibleListButton = el.querySelector('.collapsible-list-button');
    this.openClass = 'open';
    document.addEventListener('click', function (e) {
      this.documentClicked(e);
    }.bind(this));
  }

  Constructor.prototype = {
    events: {
      '.collapsible-list-button click': 'handleClick',
      '.collapsible-list-wrapper keydown': 'handleKeyPress'
    },
    isOpen: function isOpen() {
      if (this.itemsList) {
        return this.itemsList.classList.contains(this.openClass);
      }
    },
    collapseCollapsibleList: function collapseCollapsibleList() {
      if (this.itemsList) {
        this.collapsibleListButton.setAttribute('aria-expanded', false);
        this.itemsList.classList.remove(this.openClass);
      }
    },
    openCollapsibleList: function openCollapsibleList() {
      if (this.itemsList) {
        this.collapsibleListButton.setAttribute('aria-expanded', true);
        this.itemsList.classList.add(this.openClass);
      }
    },

    /**
     * Capture document clicks and close if the target is not this collapsible-list
     * @param {object} e
     */
    documentClicked: function documentClicked(e) {
      if (!dom.closest(e.target, '.collapsible-list-wrapper')) {
        this.collapseCollapsibleList();
      }
    },
    handleClick: function handleClick() {
      if (this.isOpen()) {
        this.collapseCollapsibleList();
      } else {
        this.openCollapsibleList();
      }
    },
    handleKeyPress: function handleKeyPress(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.collapseCollapsibleList();
      }
    }
  };
  return Constructor;
}]);
}, {"1":1}];
