window.modules["uservoice-feedback.client"] = [function(require,module,exports){'use strict'; // UserVoice Widget Documentation – https://developer.uservoice.com/docs/widgets/overview/

DS.controller('uservoice-feedback', ['$window', '$document', function ($window, $document) {
  var Constructor, userVoiceScript, firstScriptElement;

  Constructor = function Constructor() {
    initUserVoice();
  };
  /**
   * Setup UserVoice
   */


  function initUserVoice() {
    userVoiceScript = $document.createElement('script');
    userVoiceScript.type = 'text/javascript';
    userVoiceScript.async = true;
    userVoiceScript.src = 'http://widget.uservoice.com/mKyEyw91EdUMgj8QnJyjvA.js';
    firstScriptElement = $document.getElementsByTagName('script')[0];
    firstScriptElement.parentNode.insertBefore(userVoiceScript, firstScriptElement);

    userVoiceScript.onload = function () {
      $window.UserVoice = $window.UserVoice || [];
      $window.UserVoice.push(['set', {
        accent_color: '#00bcf1',
        screenshot_enabled: false,
        smartvote_enabled: false,
        post_suggestion_enabled: false,
        strings: {
          contact_menu_label: 'What do you like or dislike about our new video experience?',
          contact_title: 'What do you like or dislike about our new video experience?',
          contact_message_placeholder: 'Type your answer…'
        }
      }]);
    };
  }

  return Constructor;
}]);
}, {}];
