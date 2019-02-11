window.modules["collection-videos.client"] = [function(require,module,exports){'use strict';

module.exports = function (el) {
  var videoWrap = el.querySelector('.video-wrapper') || '',
      imageWrap = el.querySelector('.info-wrapper') || '',
      playBtn = el.querySelector('.feed-callout') || '',
      videoId = el.querySelector('.youtube') ? el.querySelector('.youtube').getAttribute('data-element-id') : '',
      customPlayer = new Event("customPlayer-".concat(videoId)),
      videoPlayer = el.querySelector('.player'),
      videoElement = el.querySelector('.youtube');
  initialize();

  function initialize() {
    if (videoWrap && playBtn) {
      playBtn.addEventListener('click', displayVideo);
    }

    if (videoPlayer) {
      videoPlayer.children[0].tabIndex = -1;
    }
  }

  function displayVideo() {
    document.dispatchEvent(customPlayer);
    imageWrap.classList.add('hidden');
    videoElement.tabIndex = -1;
    videoElement.focus();
    videoPlayer.children[0].tabIndex = 0;
  }
};
}, {}];
