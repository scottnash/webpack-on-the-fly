window.modules["governors-scrollviz-2018.client"] = [function(require,module,exports){/* global d3:false */
'use strict';

var dom = require(1),
    _throttle = require(23);

var data = require(117),
    no_elections = ['washington', 'utah', 'montana', 'north-dakota', 'missouri', 'louisiana', 'mississippi', 'indiana', 'kentucky', 'west-virginia', 'north carolina', 'virginia', 'new-jersey', 'delaware'];

DS.controller('governors-scrollviz-2018', [function () {
  var paths = data.paths; // Smooth transitions between two paths with different numbers of points
  // Modified from https://bl.ocks.org/mbostock/3916621

  function pathTween(d1, precision) {
    return function () {
      var path0 = this,
          path1 = path0.cloneNode(),
          n0 = path0.getTotalLength(),
          n1 = (path1.setAttribute('d', d1), path1).getTotalLength(),
          // Uniform sampling of distance based on specified precision.
      distances = [0],
          i = 0,
          dt = precision / Math.max(n0, n1),
          points;

      while ((i += dt) < 1) {
        distances.push(i);
      }

      distances.push(1); // Compute point-interpolators at each distance.

      points = distances.map(function (t) {
        var p0 = path0.getPointAtLength(t * n0),
            p1 = path1.getPointAtLength(t * n1);
        return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
      });
      return function (t) {
        return t < 1 ? 'M' + points.map(function (p) {
          return p(t);
        }).join('L') : d1;
      };
    };
  }

  function Constructor(el) {
    this.el = el;
    this.title = dom.find(this.el, '.title');
    this.mapSvgGroup = d3.select('.map').select('.states');
    this.svg = dom.find(this.el, '.svg');
    this.isMapTransformed = false;
    this.allStates = this.mapSvgGroup.selectAll('path')['_parents'][0]['childNodes'];
    this.labels = dom.find(this.svg, '.cartogram-state-labels');
    this.legend = dom.find(this.el, '.legend');
    this.init();
  }

  Constructor.prototype = {
    drawMap: function drawMap(data) {
      this.mapSvgGroup.selectAll('path').data(data, function (d) {
        return d;
      }).enter().append('path').attr('class', function (d) {
        return 'state ' + d.party + ' ' + d.state;
      }).attr('d', function (d) {
        return d.d0;
      });
      this.addNoElectionClass();
    },
    // Add a "no-election" class on all states in array no_elections
    addNoElectionClass: function addNoElectionClass() {
      var i, x, statePathAll;

      for (i = 0; i < no_elections.length; i++) {
        statePathAll = dom.findAll(this.svg, 'path.' + no_elections[i]);

        for (x = 0; x < statePathAll.length; x++) {
          statePathAll[x].classList.add('no-election');
        }
      }
    },
    // Transition state polygon to a circle
    stateToCircle: function stateToCircle(state, d1) {
      if (d1) {
        this.mapSvgGroup.select(state).classed('state', false).classed('circle', true).transition().ease(d3.easeQuad).duration(400).attrTween('d', pathTween(d1, 4));
      }
    },
    // Transition circle back to state polygon
    circleToState: function circleToState(state, d0) {
      this.mapSvgGroup.select(state).classed('circle', false).classed('state', true).transition().ease(d3.easeQuad).duration(400).attrTween('d', pathTween(d0, 4));
    },
    // Some states have more than 1 polygon
    // We want them to disappear when the polygons shift to circles
    hideMultipolygons: function hideMultipolygons() {
      var hasNumber = /\d/,
          i,
          stateClass,
          stateMulti;

      for (i = 0; i < this.allStates.length; i++) {
        stateClass = this.allStates[i].getAttribute('class').split(' ')[2];

        if (hasNumber.test(stateClass)) {
          stateMulti = dom.find(this.svg, 'path.' + stateClass);
          stateMulti.classList.remove('show');
          stateMulti.classList.add('hide');
        }
      }
    },
    showMultipolygons: function showMultipolygons() {
      var hasNumber = /\d/,
          i,
          stateClass,
          stateMulti;

      for (i = 0; i < this.allStates.length; i++) {
        stateClass = this.allStates[i].getAttribute('class').split(' ')[2];

        if (hasNumber.test(stateClass)) {
          stateMulti = dom.find(this.svg, 'path.' + stateClass);
          stateMulti.classList.remove('hide');
          stateMulti.classList.add('show');
        }
      }
    },
    getTopDist: function getTopDist(element) {
      // Get distance of an element from the top of the window
      var topDist = element.getBoundingClientRect().top;
      return topDist;
    },
    rollThatScroll: function rollThatScroll() {
      var titleTop = this.getTopDist(this.title),
          i,
          state,
          pathClass,
          d0,
          d1;

      if (titleTop < 0 && !this.isMapTransformed) {
        for (i = 0; i < paths.length; i++) {
          state = 'path.' + paths[i].state;
          pathClass = dom.find(this.svg, state).getAttribute('class');
          d1 = paths[i].d1; // Only transform the paths if not already transformed correctly

          if (pathClass.includes('state')) {
            this.stateToCircle(state, d1);
          }
        }

        this.hideMultipolygons();
        this.labels.classList.add('show');
        this.legend.classList.add('show');
        this.isMapTransformed = true;
      } else if (titleTop > 40 && this.isMapTransformed) {
        for (i = 0; i < paths.length; i++) {
          state = 'path.' + paths[i].state;
          pathClass = dom.find(this.svg, state).getAttribute('class');
          d0 = paths[i].d0; // Only transform the paths if not already transformed correctly

          if (pathClass.includes('circle')) {
            this.circleToState(state, d0);
          }
        }

        this.showMultipolygons();
        this.labels.classList.remove('show');
        this.legend.classList.remove('show');
        this.isMapTransformed = false;
      }
    },
    // Init functions
    init: function init() {
      this.drawMap(paths);
      this.eventHandlers();
    },
    // Handling scroll
    eventHandlers: function eventHandlers() {
      var throttledScroll = _throttle(this.rollThatScroll, 150);

      window.addEventListener('scroll', throttledScroll.bind(this));
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23,"117":117}];
