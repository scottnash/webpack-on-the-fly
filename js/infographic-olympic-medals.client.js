window.modules["infographic-olympic-medals.client"] = [function(require,module,exports){'use strict';

var _throttle = require(23);

DS.controller('infographic-olympic-medals', ['$document', function ($document) {
  function Constructor(el) {
    this.el = el;
    this.chart = el.querySelector('.bar-chart');
    this.legend = el.querySelector('.legend');
    this.stickyEnd = el.querySelector('.note');
    window.addEventListener('scroll', _throttle(this.onScroll.bind(this), 200));
  }

  ;
  Constructor.prototype = {
    events: {
      '.bar touchstart': 'viewInfo',
      '.bar touchend': 'viewInfo'
    },
    viewInfo: function viewInfo(e) {
      var bar = e.target;
      bar.classList.toggle('info-open');
    },
    onScroll: function onScroll() {
      var chart = this.chart,
          elTop = chart.offsetTop + 200,
          legend = this.legend,
          html = $document.documentElement.scrollTop || $document.body.scrollTop,
          stopNavEl = this.stickyEnd.offsetTop;

      if (html > elTop && html < stopNavEl) {
        legend.classList.add('sticky');
      } else {
        legend.classList.remove('sticky');
      }
    }
  };
  return Constructor;
}]);
}, {"23":23}];
