window.modules["senate-scrollviz-2018.client"] = [function(require,module,exports){/* global d3:false */
'use strict';

var dom = require(1),
    _throttle = require(23);

var data = require(184);

DS.controller('senate-scrollviz-2018', [function () {
  var positions = data.positions,
      demDotsEl = d3.select('.senate-democrat'),
      gopDotsEl = d3.select('.senate-republican'),
      indDotEl = d3.select('.senate-independent');

  function drawDots(dotsEl, data) {
    dotsEl.selectAll('circle').data(data, function (d) {
      return d;
    }).enter().append('circle').attr('class', 'dot').attr('r', 11.5).attr('cx', function (d) {
      return d.x1;
    }).attr('cy', function (d) {
      return d.y1;
    });
  }

  drawDots(demDotsEl, positions.dem);
  drawDots(gopDotsEl, positions.gop);
  drawDots(indDotEl, positions.independent);

  function Constructor(el) {
    this.el = el;
    this.title = dom.find(this.el, '.title');
    this.svg = dom.find(this.el, '.senate-svg');
    this.labels = dom.find(this.el, '.senate-labels');
    this.mobileLabels = dom.find(this.el, '.mobile-labels');
    this.init();
  }

  Constructor.prototype = {
    moveDots: function moveDots(dotsEl) {
      dotsEl.selectAll('circle').transition().ease(d3.easeLinear).duration(225).attr('cx', function (d) {
        return d.x2;
      }).attr('cy', function (d) {
        return d.y2;
      });
      this.contrastDots();
      this.labels.classList.add('show');
      this.mobileLabels.classList.add('show');
    },
    revertDots: function revertDots(dotsEl) {
      dotsEl.selectAll('circle').classed('competitive', false).transition().ease(d3.easeLinear).duration(200).attr('cx', function (d) {
        return d.x1;
      }).attr('cy', function (d) {
        return d.y1;
      });
      this.labels.classList.remove('show');
      this.mobileLabels.classList.remove('show');
    },
    // Dots should switch to a lighter color if they are the competitive seats
    // This is not great because we cannot add people and delete people as easily without a release.
    contrastDots: function contrastDots() {
      var democrat = dom.find(this.svg, '.senate-democrat'),
          gop = dom.find(this.svg, '.senate-republican'),
          demComp = dom.findAll(democrat, '.dot:nth-last-child(-n+9)'),
          // There are 9 competitive Democratic seats
      gopComp = dom.findAll(gop, '.dot:nth-last-child(-n+2)'),
          // There are 30 competitive Republican seats
      i,
          x;

      for (i = 0; i < demComp.length; i++) {
        demComp[i].classList.add('competitive');
      }

      for (x = 0; x < gopComp.length; x++) {
        gopComp[x].classList.add('competitive');
      }
    },
    getTopDist: function getTopDist(element) {
      // Get distance of an element from the top of the window
      var topDist = element.getBoundingClientRect().top;
      return topDist;
    },
    rollThatScroll: function rollThatScroll() {
      var titleTop = this.getTopDist(this.title);

      if (titleTop < 0) {
        this.moveDots(demDotsEl, positions.dem);
        this.moveDots(gopDotsEl, positions.gop);
        this.moveDots(indDotEl, positions.independent);
      } else if (titleTop > 40) {
        this.revertDots(demDotsEl, positions.dem);
        this.revertDots(gopDotsEl, positions.gop);
        this.revertDots(indDotEl, positions.independent);
      }
    },
    // Init functions
    init: function init() {
      this.eventHandlers();
    },
    // Handling scroll
    eventHandlers: function eventHandlers() {
      var throttledScroll = _throttle(this.rollThatScroll, 100);

      window.addEventListener('scroll', throttledScroll.bind(this));
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23,"184":184}];
