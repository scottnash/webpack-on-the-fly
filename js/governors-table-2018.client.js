window.modules["governors-table-2018.client"] = [function(require,module,exports){'use strict';

var _throttle = require(23),
    dom = require(1),
    $gtm = require(41);

DS.controller('governors-table-2018', [function () {
  function Constructor(el) {
    this.el = el;
    this.incumbent = dom.findAll(this.el, '.candidate');
    this.columnFour = dom.find(this.el, '.col-four');
    this.columnFive = dom.find(this.el, '.col-five');
    this.colSpan = dom.find(this.el, '.col-span');
    this.marginVictory = dom.findAll(this.el, '.margin-victory');
    this.presWinner = dom.findAll(this.el, '.pres-winner');
    this.width = window.innerWidth;
    this.eventHandlers();
    this.init();
  }

  Constructor.prototype = {
    events: {
      '.header-row click': 'handleClick'
    },
    init: function init() {
      this.resizeIt();
      $gtm.reportCustomEvent({
        category: 'interactive',
        label: 'governors 2018 midterms',
        action: 'page view'
      });
    },
    // handle the expansion and collapsing of the .expanded-details row when the .header-row is clicked
    handleClick: function handleClick(e) {
      var thisRow = dom.closest(e.target, '.header-row'),
          thisRowSibling = thisRow.nextElementSibling,
          thisRowSiblingChild = dom.find(thisRowSibling, '.row-content');

      if (thisRowSiblingChild.classList.contains('collapsed')) {
        this.collapseIt();
        thisRowSiblingChild.classList.remove('collapsed');
        thisRow.setAttribute('aria-expanded', 'true');
        this.expandRow(thisRowSiblingChild);
        $gtm.reportCustomEvent({
          category: 'interactive',
          label: 'governors 2018 midterms',
          action: 'view item details'
        });
      } else {
        thisRowSiblingChild.classList.add('collapsed');
        thisRow.setAttribute('aria-expanded', 'false');
        this.collapseRow(thisRowSiblingChild);
      }
    },
    // add class when size gets down to mobile
    addMobile: function addMobile() {
      if (window.innerWidth <= 600) {
        this.el.classList.add('mobile');
      } else {
        this.el.classList.remove('mobile');
      }
    },
    mobileTable: function mobileTable() {
      var i;
      this.addMobile(); // hide certain columns from the table in mobile and display hidden content in the expanded detail

      if (this.el.classList.contains('mobile')) {
        this.columnFour.classList.add('hidden');
        this.columnFive.classList.add('hidden');
        this.colSpan.setAttribute('colspan', '5'); // hide the content in the header row

        for (i = 0; i < this.incumbent.length; i++) {
          this.marginVictory[i].classList.add('hidden');
          this.presWinner[i].classList.add('hidden');
        }
      } else {
        this.columnFour.classList.remove('hidden');
        this.columnFive.classList.remove('hidden');
        this.colSpan.setAttribute('colspan', '7'); // show the content in the header row

        for (i = 0; i < this.incumbent.length; i++) {
          this.marginVictory[i].classList.remove('hidden');
          this.presWinner[i].classList.remove('hidden');
        }
      }
    },
    // if a row is expanded, on resize or when another row is selected, collapse it
    collapseIt: function collapseIt() {
      var rowContent = dom.findAll(this.el, '.row-content'),
          headRow = dom.findAll(this.el, '.header-row'),
          i;

      for (i = 0; i < rowContent.length; i++) {
        if (!rowContent[i].classList.contains('collapsed')) {
          rowContent[i].classList.add('collapsed');
          headRow[i].setAttribute('aria-expanded', 'false');
          this.collapseRow(rowContent[i]);
        }
      }
    },
    // Animate slide up/down of expanded rows
    // getHeight - for elements with display:none
    getHeight: function getHeight(el) {
      var el_style = window.getComputedStyle(el),
          el_display = el_style.display,
          el_position = el_style.position,
          el_visibility = el_style.visibility,
          el_max_height = el_style.maxHeight.replace('px', '').replace('%', ''),
          wanted_height = 0; // if its not hidden we just return normal height

      if (el_display !== 'none' && el_max_height !== '0') {
        return el.offsetHeight;
      } // the element is hidden so:
      // making the el block so we can measure its height but still be hidden


      el.style.position = 'absolute';
      el.style.visibility = 'hidden';
      el.style.display = 'block';
      wanted_height = el.offsetHeight + 50; // adding a 50 pixel buffer to the height
      // reverting to the original values

      el.style.display = el_display;
      el.style.position = el_position;
      el.style.visibility = el_visibility;
      return wanted_height;
    },
    // On click of the parent row, slide down hidden row to reveal details
    expandRow: function expandRow(el) {
      var el_max_height = 0;
      el_max_height = this.getHeight(el) + 'px';
      el.style.maxHeight = '0';
      el.style.display = 'block'; // we use setTimeout to modify maxHeight later than display (so we have the transition effect)

      setTimeout(function () {
        el.style.maxHeight = el_max_height;
      }, 10);
    },
    // On click of the parent row, slide up row to hide the details
    collapseRow: function collapseRow(el) {
      el.style.maxHeight = '0'; // setting a timeout to remove inline attributes after the transition on the expanded row has fired.

      setTimeout(function () {
        el.removeAttribute('style');
      }, 600);
    },
    resizeIt: function resizeIt() {
      this.mobileTable(); // check width of the window so that resize won't trigger on scroll in mobile

      if (window.innerWidth !== this.width) {
        this.collapseIt();
        this.width = window.innerWidth;
      }
    },
    // handle scroll and resize events
    eventHandlers: function eventHandlers() {
      var throttledResize = _throttle(this.resizeIt, 100);

      window.addEventListener('resize', throttledResize.bind(this));
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23,"41":41}];
