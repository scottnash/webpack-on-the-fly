window.modules["spiderman-map.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    $visibility = require(26);

DS.controller('spiderman-map', [function () {
  function Constructor(el) {
    this.el = el;
    this.contentWrapper = dom.findAll(this.el, '.spiderman-map-item-first-column-content');
    this.imageItem = dom.findAll(this.el, '.spiderman-map-item-first-column');
    this.hotspotIcon = dom.findAll(this.el, '.spiderman-map-info-icon');
    this.hotspotIndex = dom.findAll(this.el, '.marker-index');
    this.movie = dom.findAll(this.el, '.spiderman-map-item');
    this.filters = dom.find(this.el, '.filters');
    this.filterButton = dom.findAll(this.el, '.filter-button');
    this.filtersDropdown = dom.find(this.el, '.filters-dropdown-text');
    this.mobileHeader = dom.find(this.el, '.filters-dropdown-text .mobile-header');
    this.close = dom.findAll(this.el, '.close');
    this.all = dom.find(this.el, '.all');
    this.caret = dom.find(this.el, '.caret');
    this.dropDownExpanded = false;
    this.selectedIndex = 0;
    this.init();
  }

  Constructor.prototype = {
    events: {
      '.spiderman-map-info-icon click': 'handleClick',
      '.filter-button click': 'filterMovie',
      '.all click': 'showAllMovies',
      '.close click': 'closeModal',
      '.filters-dropdown-text click': 'toggleDropdown'
    },
    // init functions
    init: function init() {
      this.eventHandlers(); // mobile movie default

      this.mobileMovieFormat();
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
          this.contentWrapper[i].classList.add('on');
          this.imageItem[i].classList.add('show');
          this.hotspotIndex[i].classList.add('active');
        } else {
          this.contentWrapper[i].classList.remove('on');
          this.imageItem[i].classList.remove('show');
          this.hotspotIndex[i].classList.remove('active');
        }
      }
    },
    closeModal: function closeModal() {
      var i;

      for (i = 0; i < this.contentWrapper.length; i++) {
        this.contentWrapper[i].classList.remove('on');
        this.hotspotIndex[i].classList.remove('active');
      }
    },
    filterMovie: function filterMovie(e) {
      var thisButton = dom.closest(e.target, '.filter-button'),
          thisMovie = thisButton.getAttribute('id'),
          i,
          j; // toggle filters

      for (i = 0; i < this.filterButton.length; i++) {
        this.filterButton[i].classList.add('filter-off');
        this.filterButton[i].classList.remove('filter-on');
        thisButton.classList.remove('filter-off');
        thisButton.classList.add('filter-on');
      } // hide or show points on mao based on selecred item


      for (j = 0; j < this.movie.length; j++) {
        if (this.movie[j].getAttribute('data-id') !== thisMovie) {
          if (!this.movie[j].classList.contains('off')) {
            this.movie[j].classList.add('off');
          }
        } else {
          this.movie[j].classList.remove('off');
        }
      }

      if (!thisButton.classList.contains('all')) {
        this.updateDropdownHeader(e);
      }
    },
    // on mobile, expand dropdown when header is clicked
    expandDropdown: function expandDropdown() {
      this.dropDownExpanded = true;
      this.filters.classList.add('expanded');
      this.caret.classList.add('up');
      this.caret.classList.remove('down');
    },
    // on mobile, collapse the dropdown when the header or link is clicked
    // when the nav is expanded
    collapseDropdown: function collapseDropdown() {
      this.dropDownExpanded = false;
      this.filters.classList.remove('expanded');
      this.caret.classList.add('down');
      this.caret.classList.remove('up');
    },
    // toggle dropdown expanded/collapsed states
    toggleDropdown: function toggleDropdown() {
      // if dropdown is expanded, collapse
      if (this.dropDownExpanded) {
        this.collapseDropdown();
      } else {
        // if dropdown is collapsed, expand
        this.expandDropdown();
      }
    },
    updateDropdownHeader: function updateDropdownHeader(e) {
      var thisButton = dom.closest(e.target, '.filter-button'),
          thisButtonID = thisButton.getAttribute('id'),
          thisMovie = thisButton.childNodes[2].nextSibling.innerHTML; // clear the class list of everything except for the original class

      this.filtersDropdown.classList = 'filters-dropdown-text'; // add the needed button class

      this.filtersDropdown.classList.add(thisButtonID);
      this.mobileHeader.innerHTML = thisMovie;
      this.collapseDropdown();
    },
    mobileHeaderDefault: function mobileHeaderDefault() {
      var defaultMovieClass = this.filterButton[1].getAttribute('id');
      this.mobileHeader.innerHTML = this.filterButton[1].childNodes[2].nextSibling.innerHTML; // clear class list and add only original

      this.filtersDropdown.classList = 'filters-dropdown-text'; // add the needed button class

      this.filtersDropdown.classList.add(defaultMovieClass);
    },
    showAllMovies: function showAllMovies() {
      var i, j;

      for (i = 0; i < this.filterButton.length; i++) {
        this.filterButton[i].classList.remove('filter-off');
        this.filterButton[i].classList.add('filter-on');
      }

      for (j = 0; j < this.movie.length; j++) {
        this.movie[j].classList.remove('off');
      } // reset mobile dropdwon header when all reset even though it's not visible


      this.mobileHeaderDefault();
    },
    mobileMovieFormat: function mobileMovieFormat() {
      var i, j;

      if (this.all.classList.contains('filter-on')) {
        if ($visibility.getViewportWidth() < 1024) {
          for (i = 0; i < this.filterButton.length; i++) {
            this.filterButton[0].classList.remove('filter-off');
            this.filterButton[1].classList.remove('filter-off');
            this.filterButton[0].classList.add('filter-on');
            this.filterButton[1].classList.add('filter-on');
            this.filterButton[i].classList.remove('filter-on');
            this.filterButton[i].classList.add('filter-off');
          }

          for (j = 0; j < this.movie.length; j++) {
            if (this.movie[j].getAttribute('data-id') !== this.filterButton[1].getAttribute('id')) {
              this.movie[j].classList.add('off');
            }
          }
        } else {
          this.showAllMovies();
          this.collapseDropdown();
        }
      }
    },
    // handle scroll and resize events
    eventHandlers: function eventHandlers() {
      window.addEventListener('resize', this.mobileMovieFormat.bind(this));
    }
  };
  return Constructor;
}]);
}, {"1":1,"26":26}];
