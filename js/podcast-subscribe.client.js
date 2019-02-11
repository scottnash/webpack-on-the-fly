window.modules["podcast-subscribe.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    $gtm = require(41);

DS.controller('podcast-subscribe', ['$window', function ($window) {
  function Constructor(el) {
    this.el = el;
    this.eventLabel = 'on=' + $window.location.href;
    this.podcastNameEl = dom.find(this.el, '.podcast-name');
    this.podcastName = this.podcastNameEl.innerHTML;
  }

  Constructor.prototype = {
    events: {
      '.podcast-link click': 'trackInGa'
    },
    trackInGa: function trackInGa() {
      $gtm.reportCustomEvent({
        category: 'ecommerce',
        action: 'podcast-link',
        label: this.eventLabel
      }, {
        cd23: 'podcast-subscribe',
        podcastName: this.podcastName
      });
    }
  };
  return Constructor;
}]);
}, {"1":1,"41":41}];
