window.modules["video-promo-for-articles.client"] = [function(require,module,exports){'use strict';

DS.controller('video-promo-for-articles', [function () {
  function Constructor(el) {
    this.el = el;
  }

  Constructor.prototype = {
    events: {
      'video-chosen': 'onVideoChosen',
      'video-not-found': 'onVideoNotFound'
    },
    onVideoChosen: function onVideoChosen(e) {
      // The player has selected a video, now we can set some display details
      if (e.detail && e.detail.videoHeadline) {
        this.el.querySelector('.promo-headline').innerHTML = e.detail.videoHeadline;
      }
    },
    onVideoNotFound: function onVideoNotFound() {
      // The player does not have a video set - abort
      this.el.classList.add('hidden');
    }
  };
  return Constructor;
}]);
}, {}];
