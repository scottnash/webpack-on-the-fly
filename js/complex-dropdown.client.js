window.modules["complex-dropdown.client"] = [function(require,module,exports){'use strict';

var dom = require(1);
/* eslint complexity: ["error", 10] */


DS.controller('complex-dropdown', [function () {
  function Constructor(el) {
    this.el = el;
    this.combo = el.querySelector('.complex-dropdown-combo');
    this.listbox = el.querySelector('.complex-dropdown-list');
    this.items = el.querySelectorAll('.complex-dropdown-item');
    this.displayItem = el.querySelector('.complex-dropdown-display'); // default to first item selected

    if (this.items.length > 0) {
      this.items[0].setAttribute('aria-selected', 'true');
      this.el.setAttribute('data-value', this.items[0].getAttribute('data-value'));
      this.displayItem.innerHTML = this.items[0].innerHTML;
    } // listen for all clicks (so we can close)


    document.addEventListener('click', function (e) {
      this.documentClicked(e);
    }.bind(this));
  }

  Constructor.prototype = {
    events: {
      '.complex-dropdown-elem click': 'handleClick',
      '.complex-dropdown-combo keydown': 'handleKeypress'
    },

    /**
     * Capture document clicks and close if the target is not this dropdown
     * @param {object} e
     */
    documentClicked: function documentClicked(e) {
      var dropdown = dom.closest(e.target, '.complex-dropdown');

      if (!dropdown || dropdown !== this.el) {
        this.closeDropdown();
      }
    },

    /**
     * When this dropdown is clicked expand/collapse/select as appropriate
     * @param {object} e
     */
    handleClick: function handleClick(e) {
      var dropdownItem = dom.closest(e.target, '.complex-dropdown-item');

      if (dropdownItem) {
        this.selectItem(dropdownItem);
      } else {
        if (this.isOpen()) {
          this.closeDropdown();
        } else {
          this.openDropdown();
        }
      }
    },

    /**
     * Implement keyboard navigation.
     * Up/down arrows navigate items, while space/enter expand and collapse, and tab/escape will close.
     * @param {object} e
     */
    handleKeypress: function handleKeypress(e) {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();

          if (this.isOpen()) {
            this.selectActiveItem();
          } else {
            this.openDropdown();
          }

          break;

        case 'ArrowDown':
          e.preventDefault();

          if (this.isOpen()) {
            this.navDown();
          } else {
            this.openDropdown();
          }

          break;

        case 'ArrowUp':
          e.preventDefault();

          if (this.isOpen()) {
            this.navUp();
          } else {
            this.openDropdown();
          }

          break;

        case 'Tab':
        case 'Escape':
          this.closeDropdown();
          break;

        default:
          break;
      }
    },

    /**
     * Open this dropdown
     */
    openDropdown: function openDropdown() {
      this.combo.setAttribute('aria-expanded', 'true');
    },

    /**
     * Close this dropdown
     */
    closeDropdown: function closeDropdown() {
      this.combo.setAttribute('aria-expanded', 'false');
    },

    /**
     * Determine whether this dropdown is currently open
     * @returns {bool}
     */
    isOpen: function isOpen() {
      return this.combo.getAttribute('aria-expanded') === 'true';
    },

    /**
     * Select the next item in the list when navigating using the keyboard
     */
    navDown: function navDown() {
      var activeIndex = this.findActiveIndex(),
          newActiveId = ''; // only take action if we're not at the bottom of the list

      if (activeIndex < this.items.length - 1) {
        // if an item is already active, remove active visuals
        if (activeIndex > -1) {
          this.items[activeIndex].classList.remove('active');
        } // add visuals to next item (class + scroll into view)


        this.items[activeIndex + 1].classList.add('active');
        this.listbox.scrollTop = this.items[activeIndex + 1].offsetTop; // set as active descendant of the list

        newActiveId = this.items[activeIndex + 1].getAttribute('id');
        this.combo.setAttribute('aria-activedescendant', newActiveId);
      }
    },

    /**
     * Select the previous item in the list when navigating using the keyboard
     */
    navUp: function navUp() {
      var activeIndex = this.findActiveIndex(),
          newActiveId = ''; // only take action if we're not at the top of the list

      if (activeIndex > 0) {
        // remove active visuals from current
        this.items[activeIndex].classList.remove('active'); // add visuals to prev item (class + scroll into view)

        this.items[activeIndex - 1].classList.add('active');
        this.listbox.scrollTop = this.items[activeIndex - 1].offsetTop; // set as active descendant of the list

        newActiveId = this.items[activeIndex - 1].getAttribute('id');
        this.combo.setAttribute('aria-activedescendant', newActiveId);
      }
    },

    /**
     * Select the currently active item when navigating using the keyboard
     */
    selectActiveItem: function selectActiveItem() {
      var activeIndex = this.findActiveIndex();

      if (activeIndex > -1) {
        this.selectItem(this.items[activeIndex]);
      } else {
        this.closeDropdown();
      }
    },

    /**
     * Select the specified item
     * @param {Element} dropdownItem
     */
    selectItem: function selectItem(dropdownItem) {
      var i, changeEvent; // deselect all

      for (i = 0; i < this.items.length; i++) {
        this.items[i].removeAttribute('aria-selected');
      } // select chosen item


      dropdownItem.setAttribute('aria-selected', 'true'); // reflect selection in display

      this.displayItem.innerHTML = dropdownItem.innerHTML; // set value on root elem

      this.el.setAttribute('data-value', dropdownItem.getAttribute('data-value')); // close the dropdown

      this.closeDropdown(); // raise a change event

      changeEvent = new Event('change', {
        bubbles: true
      });
      this.el.dispatchEvent(changeEvent);
    },

    /**
     * Find the index of the currently active item. Returns -1 if no active item found.
     * @returns {int}
     */
    findActiveIndex: function findActiveIndex() {
      var activeId = this.combo.getAttribute('aria-activedescendant'),
          i;

      for (i = 0; i < this.items.length; i++) {
        if (this.items[i].getAttribute('id') === activeId) {
          return i;
        }
      }

      return -1;
    }
  };
  return Constructor;
}]);
}, {"1":1}];
