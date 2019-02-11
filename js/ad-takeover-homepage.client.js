window.modules["ad-takeover-homepage.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

DS.controller('ad-takeover-homepage', [function () {
  function Constructor(el) {
    this.el = el;
    this.leaderboardSlot = dom.find(el, '[data-label="homepageTakeover/TopLeaderboard"]');
    window.addEventListener('load', function () {
      this.containsLeaderboard = dom.find(this.leaderboardSlot, 'iframe[width="970"], iframe[width="728"], iframe[width="1100px"]');

      if (this.containsLeaderboard) {
        this.takeoverParent = this.el.parentNode, this.buffer = this.addBuffer();
        this.firstTime = true;
        this.stickAd();
        window.setTimeout(this.unStickAd.bind(this), 3000);
      }
    }.bind(this));
  }

  Constructor.prototype = {
    stickAd: function stickAd() {
      this.leaderboardHeight = this.el.clientHeight;
      this.adFrame = dom.find(this.el, 'iframe');

      if (this.firstTime) {
        this.buffer.style.height = this.leaderboardHeight + 'px';
        this.el.classList.add('sticky-leaderboard');
        this.firstTime = false;
      }
    },
    addBuffer: function addBuffer() {
      var bufferEl = document.createElement('div');
      bufferEl.classList.add('buffer');
      bufferEl.style.height = 0;
      this.takeoverParent.insertBefore(bufferEl, this.el);
      return bufferEl;
    },
    unStickAd: function unStickAd() {
      this.el.classList.remove('sticky-leaderboard');
      this.buffer.style.height = 0;
      this.el.style.marginLeft = 'auto';
    }
  };
  return Constructor;
}]);
}, {"1":1}];
