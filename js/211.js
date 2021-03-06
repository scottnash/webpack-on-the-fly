window.modules["211"] = [function(require,module,exports){/* global YT:false */
'use strict';

var _assign = require(57),
    VIDEO_ID_RE = /v=([\w-]+)/,
    videoQueue = [],
    state = 'initializing'; // Global client service for the YouTube player as primary video content playback.

/**
 * Adds a video configuration to the video queue
 * @param {Object} videoConfig
 * @param {string} videoConfig.videoContainerId
 * @param {string} videoConfig.videoId
 */


function addVideo(videoConfig) {
  if (videoConfig.videoContainerId && videoConfig.videoId) {
    videoQueue.push(videoConfig);
  } else {
    console.warn('Video is missing Id or container Id to be render');
  }
}
/**
 * Extract video id from YT url
 * @param {string} str
 * @returns {string} video Id
 */


function extractVideoIdFromUrl(str) {
  return VIDEO_ID_RE.test(str) ? VIDEO_ID_RE.exec(str)[1] : '';
}
/**
 * create the YouTube / YT player
 * @param {Object} videoConfig
 * @param {string} videoConfig.videoContainerId
 * @param {string} videoConfig.videoId
 * @param {object} videoConfig.playerParams
 */


function createPlayer(videoConfig) {
  var elementId = videoConfig.videoContainerId || '',
      videoId = videoConfig.videoId || '',
      player = null,
      // eslint-disable-line no-unused-vars
  playerParams = videoConfig.playerParams || {},
      customParams = videoConfig.customParams || {},
      playerEvents = {
    ready: new Event('player-ready-' + elementId),
    start: new Event('player-start-' + elementId),
    finish: new Event('player-finish-' + elementId)
  };

  if (elementId && videoId) {
    player = new YT.Player(elementId, {
      // eslint-disable-line no-unused-vars
      videoId: videoId,
      height: 'auto',
      width: '100%',
      playerVars: playerParams,
      events: {
        onReady: handleVideoReady(playerEvents.ready, customParams),
        onStateChange: videoStateChangeWrapper(customParams, playerEvents)
      }
    });
  }
}
/**
 * handleVideoReady
 * @param {Object} event
 * @param {string} customParams
 * @returns {Function}
 */


function handleVideoReady(event, customParams) {
  return function (e) {
    document.dispatchEvent(event);
    consumeNextVideoInQueue();

    if (customParams && customParams.customPlayer && customParams.templateid) {
      document.addEventListener("customPlayer-".concat(customParams.templateid), function () {
        e.target.playVideo();
      });
    }

    if (customParams && customParams.muted) {
      e.target.mute();
    }
  };
}
/**
 * Loads next video
 * @param {Object} evt - video event
 * @param {Boolean} shouldAutoplayNextVideo
 */


function loadNextVideo(evt, shouldAutoplayNextVideo) {
  if (shouldAutoplayNextVideo !== 'true') {
    evt.target.stopVideo();
  }
}
/**
 * Video state change wrapper
 * @param {Object} customParams - custom configuration object
 * @param {Object} playerEvents - YT player custom events
 * @return {Function} handles when the video state changes
 */


function videoStateChangeWrapper(customParams, playerEvents) {
  var hasVideoStarted = false;
  return function handleVideoStateChange(playerEvt) {
    if (playerEvt.data === YT.PlayerState.PLAYING && !hasVideoStarted) {
      document.dispatchEvent(_assign(playerEvents.start, {
        player: {
          videoId: extractVideoIdFromUrl(playerEvt.target.getVideoUrl()),
          videoDuration: Math.ceil(playerEvt.target.getDuration())
        }
      }));
      hasVideoStarted = true;
    }

    if (playerEvt.data === YT.PlayerState.ENDED) {
      document.dispatchEvent(playerEvents.finish);
      loadNextVideo(playerEvt, customParams.autoPlayNextVideo);
      hasVideoStarted = false;
    }
  };
}
/**
 * Consumes Next video in the queue
 */


function consumeNextVideoInQueue() {
  if (videoQueue.length) {
    createPlayer(videoQueue.shift());
  }
}
/**
 * Inits video player process
 * @param  {Object} videoConfig
 */


module.exports.init = function (videoConfig) {
  if (videoConfig) {
    addVideo(videoConfig);

    if (state === 'initializing') {
      consumeNextVideoInQueue();
    }
  }
};
}, {"57":57}];
