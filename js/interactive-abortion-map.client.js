window.modules["interactive-abortion-map.client"] = [function(require,module,exports){/* global d3:false */
'use strict';

var _forEach = require(27),
    _find = require(71);

var SHOW_CLASS = 'interactive-abortion-map-state-show'; // polyfill for customEvent in IE9+

(function () {
  if (typeof window.CustomEvent === 'function') return false;

  function CustomEvent(event, params) {
    var evt = document.createEvent('CustomEvent');
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

DS.controller('interactive-abortion-map', [function () {
  function Constructor(el) {
    var sitePath = el.getAttribute('data-site-path'),
        jsonDataUrl = '//' + window.location.host + sitePath + '/media/components/interactive-abortion-map/usa_d3.json',
        // import library previously used in `interactive-tiles`
    styleSelect = require(130);

    this.initialize(el, styleSelect).setupD3().drawJson(jsonDataUrl).initializeToState('New-York'); // fix for IE not having an event constructor

    window.Eventify.on('interactive-change', function (data) {
      var fakeEvent = {
        target: {
          value: data
        }
      };
      this.changeHandler(fakeEvent);
    }.bind(this));
  }

  Constructor.prototype = {
    /**
     * displays information corresponding to the selected state
     * @param {Object} e
     */
    changeHandler: function changeHandler(e) {
      var targetValue = e.target.value.split(' ').join('-'),
          stateEl = this.getStateEl(targetValue),
          mapStateEl = this.el.querySelector('.map #' + targetValue);
      this.displayStateInfo(stateEl);
      stateEl != this.previousSelectedState && this.hidePreviousStateInfo();
      this.previousSelectedState = stateEl; // emit event that bar-line-chart component will be listening to for drawing data

      this.emitCustomEvent(stateEl); // update parts of the template

      this.updateStaticContent(stateEl); // update state that is outlined on map

      this.outlineState(mapStateEl);
    },

    /**
     * updates the value select tag to match the clicked state and dispatches change event
     * @param {Object} e
     */
    clickHandler: function clickHandler(e) {
      var clickedState = e.target.id,
          viewportIsSmall = window.innerWidth < 600;

      if (clickedState && !viewportIsSmall) {
        this.setSelectValueAndTriggerChange(clickedState);
        this.outlineState(e.target);
        this.selectInDropdown(clickedState);
      }
    },

    /**
     * colors in the map according to the hostility level of each state
     */
    customizeMap: function customizeMap() {
      var states = this.el.querySelectorAll('.map-container .state'),
          self = this;

      _forEach(states, function (state) {
        var name = state.id;
        state.style.fill = self.retrieveStateFillColor(name);
      });
    },

    /**
     * un-hides the information for a selected state
     * @param {Object} el
     */
    displayStateInfo: function displayStateInfo(el) {
      el.classList.add(SHOW_CLASS);
    },

    /**
     * renders a d3 map of the USA
     * @param {Object} data
     * @returns {Object}
     */
    drawMapOfUsa: function drawMapOfUsa(data) {
      this.svg.append('g').selectAll('path').data(data.features).enter().append('path').attr('d', this.path).attr('class', 'state').attr('id', function (d) {
        return d.properties.name.split(' ').join('-');
      });
      this.outlineNewYork();
      return this;
    },
    outlineNewYork: function outlineNewYork() {
      var g = this.el.querySelector('g'),
          newYork = this.el.querySelector('#New-York'),
          previous = g.querySelector('.selected');
      previous && previous.classList.remove('selected');
      g.appendChild(newYork);
      newYork.classList.add('selected');
    },

    /**
     * retrieves JSON data and draws US map from data
     * @param {string} url
     * @returns {Object}
     */
    drawJson: function drawJson(url) {
      d3.json(url, function (error, data) {
        if (error) throw error;
        this.drawMapOfUsa(data).customizeMap();
      }.bind(this));
      return this;
    },

    /**
     * Emit a custom event that the bar-line-chart will be listening for
     * @param {Object} stateElement
     */
    emitCustomEvent: function emitCustomEvent(stateElement) {
      var stateAbbr = stateElement.getAttribute('data-abbr');
      window.Eventify.trigger('update-chart', null, 'abortion-interactive-' + stateAbbr);
    },
    events: {
      'select change': 'changeHandler',
      '.map-container .map click': 'clickHandler'
    },

    /**
     * retrieves the number of state-imposed restrictions
     * @param {string} state
     * @returns {integer}
     */
    getNumberOfRestrictions: function getNumberOfRestrictions(state) {
      var stateEl;
      state = state.split(' ').join('-');
      stateEl = this.getStateEl(state);
      return parseInt(stateEl.dataset.numberofrestrictions);
    },

    /**
     * retrieves the element corresponding to name of a U.S. state/district
     * @param {string} name
     * @returns {Object}
     */
    getStateEl: function getStateEl(name) {
      return _find(this.embeddedComponents, function (component) {
        return component.dataset.name === name;
      });
    },

    /**
     * hides the previously selected state
     */
    hidePreviousStateInfo: function hidePreviousStateInfo() {
      this.previousSelectedState && this.previousSelectedState.classList.remove(SHOW_CLASS);
    },

    /**
     * initialize instance
     * @param {Object} el
     * @param {Function} styleSelect
     * @returns {Object}
     */
    initialize: function initialize(el, styleSelect) {
      this.el = el;
      this.previousSelectedState = null;
      this.embeddedComponents = el.querySelectorAll('.interactive-abortion-map-state');
      this.selectEl = el.querySelector('select'); // "Fake" this select element in JS/CSS so that it can be fully styled. See http://mikemaccana.github.io/styleselect

      styleSelect(this.selectEl);
      this.ssSelectedOption = el.querySelector('.ss-selected-option');
      this.state = el.querySelector('.state');
      window.addEventListener('resize', this.resizeMap.bind(this));
      return this;
    },

    /**
     * initialize state selection
     * @param {string} state
     */
    initializeToState: function initializeToState(state) {
      var stateEl = this.getStateEl(state),
          ssOption;
      this.displayStateInfo(stateEl);
      this.setSelectValueAndTriggerChange(state);
      this.updateStaticContent(stateEl); // remove initial ss-option styling

      if (this.ssSelectedOption) {
        ssOption = this.el.querySelector('.ss-dropdown .ticked');
        ssOption.classList.remove('ticked');
        ssOption.classList.remove('highlighted');
      }

      this.previousSelectedState = stateEl;
    },

    /**
     * maps hostility level to fill color for each state
     * @param {string} state
     * @returns {string}
     */
    retrieveStateFillColor: function retrieveStateFillColor(state) {
      var hostilityLevel = this.getNumberOfRestrictions(state),
          color;

      if (hostilityLevel >= 6) {
        color = '#760d17';
      } else if (hostilityLevel > 4) {
        color = '#a51220';
      } else if (hostilityLevel > 2) {
        color = '#ee3142';
      } else {
        color = '#f9bac0';
      }

      return color;
    },
    outlineState: function outlineState(stateEl) {
      var g = stateEl.parentNode,
          previous = g.querySelector('.selected');
      previous && previous.classList.remove('selected');
      g.appendChild(stateEl);
      stateEl.classList.add('selected');
    },

    /**
     * set display to state
     * @param {string} state (may contain dashes)
     */
    setSelectValueAndTriggerChange: function setSelectValueAndTriggerChange(state) {
      var name = state.split('-').join(' '); // update style-select if it is exists on the DOM
      // (i.e. if user is not on a mobile device)

      if (this.ssSelectedOption) {
        this.ssSelectedOption.dataset.value = name;
        this.ssSelectedOption.innerHTML = name;
      }

      this.selectEl.value = name;
      window.Eventify.trigger('interactive-change', name, name);
    },

    /**
     * initializes variables used for d3 mapping
     * @returns {Object}
     */
    setupD3: function setupD3() {
      var margin = {
        top: 10,
        left: -70,
        bottom: 10,
        right: -70
      },
          preWidth = parseInt(d3.select('.map-container').style('width')),
          width = preWidth - margin.left - margin.right,
          mapRatio = 0.5,
          height = width * mapRatio;
      this.width = width;
      this.projection = d3.geoAlbersUsa().scale(width).translate([width / 2, height / 2]);
      this.path = d3.geoPath().projection(this.projection);
      this.svg = d3.select('.map').append('svg').attr('width', width).attr('height', height);
      return this;
    },
    resizeMap: function resizeMap() {
      var width = parseInt(d3.select('.map-container').style('width')) + 140,
          height = width * 0.5;
      this.projection.translate([width / 2, height / 2]).scale(width);
      this.svg.style('width', width + 'px').style('height', height + 'px');
      this.svg.selectAll('.state').attr('d', d3.geoPath().projection(this.projection));
    },

    /**
     * style selected state in dropdown
     * @param {string} stateName
     */
    selectInDropdown: function selectInDropdown(stateName) {
      var ssOption; // remove styling from last selected

      ssOption = this.el.querySelector('.ss-dropdown .ticked');

      if (ssOption) {
        ssOption.classList.remove('ticked');
        ssOption.classList.remove('highlighted');
      }

      ssOption = this.el.querySelector('.ss-dropdown [data-value="' + stateName.split('-').join(' ') + '"]');
      ssOption.classList.add('ticked');
      ssOption.classList.add('highlighted');
    },

    /**
     * targeted update of content
     * @param {Object} stateEl
     */
    updateStaticContent: function updateStaticContent(stateEl) {
      var providersByYear = this.el.querySelector('.providers-by-year'),
          rateOfAbortion = this.el.querySelector('.rate-of-abortion'),
          stateNames = this.el.querySelectorAll('.state-name'),
          // stateHeader = this.el.querySelector('.state-name-header'),
      data = {
        providersByYearDecreased: stateEl.getAttribute('data-providersdecreased'),
        rateOfAbortion: stateEl.getAttribute('data-rateofabortion'),
        stateName: stateEl.getAttribute('data-name').split('-').join(' ')
      };
      providersByYear.innerHTML = data.providersByYearDecreased;
      rateOfAbortion.innerHTML = data.rateOfAbortion;

      _forEach(stateNames, function (stateName) {
        stateName.innerHTML = data.stateName;
      });
    }
  };
  return Constructor;
}]);
}, {"27":27,"71":71,"130":130}];
