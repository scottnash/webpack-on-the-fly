window.modules["browse-issues.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

DS.controller('browse-issues', [function () {
  function Constructor(el) {
    this.el = el;
    this.dropdownContent = el.querySelector('.expanded-list');
    this.expandedListButton = el.querySelector('.expanded-list-button');
    this.openClass = 'browse-issues-open';
    document.addEventListener('click', function (e) {
      this.documentClicked(e);
    }.bind(this));
  }

  Constructor.prototype = {
    events: {
      '.expanded-list-button click': 'handleClick',
      '.expanded-list keydown': 'handleKeyPress',
      '.expanded-list mouseenter': 'handleMouseEnter',
      '.expanded-list mouseleave': 'handleMouseLeave'
    },
    handleMouseEnter: function handleMouseEnter() {
      if (!this.isOpen()) {
        this.openExpandedList();
      }
    },
    handleMouseLeave: function handleMouseLeave() {
      if (this.isOpen()) {
        this.closeExpandedList();
      }
    },
    isOpen: function isOpen() {
      return this.dropdownContent.classList.contains(this.openClass);
    },
    closeExpandedList: function closeExpandedList() {
      this.expandedListButton.setAttribute('aria-expanded', false);
      this.dropdownContent.classList.remove(this.openClass);
    },
    openExpandedList: function openExpandedList() {
      this.expandedListButton.setAttribute('aria-expanded', true);
      this.dropdownContent.classList.add(this.openClass);
    },
    documentClicked: function documentClicked(e) {
      if (!dom.closest(e.target, '.expanded-list')) {
        this.closeExpandedList();
      }
    },
    handleClick: function handleClick() {
      if (this.isOpen()) {
        this.closeExpandedList();
      } else {
        this.openExpandedList();
      }
    },
    handleKeyPress: function handleKeyPress(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeExpandedList();
      }
    }
  };
  return Constructor;
}]);
}, {"1":1}];
