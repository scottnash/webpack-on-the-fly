window.modules["interactive-revenge.client"] = [function(require,module,exports){'use strict';

var _map = require(37);

DS.controller('interactive-revenge', ['$document', '$window', function ($document, $window) {
  var ua = navigator.userAgent.toLowerCase(),
      shareImg,
      shareURL,
      shareTitle,
      fbShareTxt,
      twitShareTxt,
      smsShareTxt,
      smsMessage;
  shareImg = $document.querySelector('meta[property="og:image"]').getAttribute('content');
  shareURL = $document.querySelector('meta[property="og:url"]').getAttribute('content');
  shareTitle = $document.querySelector('meta[property="og:title"]').getAttribute('content');

  function Constructor(el) {
    this.el = el;
  }

  Constructor.prototype = {
    events: {
      '.questions input click': 'checkAnswers',
      '.submit click': 'getResults',
      '.custom-share-fb click': 'shareFacebook',
      '.custom-share-twitter click': 'shareTwitter'
    },
    checkAnswers: function checkAnswers() {
      var el = this.el,
          submitBtn = el.querySelector('.submit'),
          questions = el.querySelectorAll('.question'),
          answers = el.querySelectorAll('input:checked');

      if (questions.length === answers.length) {
        submitBtn.classList.remove('is-disabled');
      }
    },
    getResults: function getResults() {
      var el = this.el,
          questionsEl = el.querySelector('.questions'),
          resultsEl = el.querySelector('.results'),
          answersAvoidance = questionsEl.querySelectorAll('.avoidance input:checked'),
          avoidanceScore = 0,
          answersRevenge = questionsEl.querySelectorAll('.revenge input:checked'),
          revengeScore = 0,
          highRHighA = resultsEl.querySelector('.highRhighA'),
          highR = resultsEl.querySelector('.highR'),
          highA = resultsEl.querySelector('.highA'),
          lowRLowA = resultsEl.querySelector('.lowRlowA'),
          average = resultsEl.querySelector('.average'),
          smsShare = resultsEl.querySelector('.custom-share-sms');
      questionsEl.style.display = 'none';
      resultsEl.style.display = 'block';
      el.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      });

      _map(answersAvoidance, function (avoidanceVal) {
        avoidanceScore = avoidanceScore + parseInt(avoidanceVal.dataset.value);
      });

      _map(answersRevenge, function (revengeVal) {
        revengeScore = revengeScore + parseInt(revengeVal.dataset.value);
      });

      if (revengeScore >= 14 && avoidanceScore >= 24) {
        highRHighA.style.display = 'block';
        fbShareTxt = 'I have a high revenge and high avoidance conflict style. Take the Science of Us revenge quiz to see how you score.';
        twitShareTxt = 'I have a high revenge and high avoidance conflict style. Take @thescienceofus revenge quiz to see how you score.';
        smsShareTxt = 'I have a high revenge and high avoidance conflict style. Let me know how you score:';
      } else if (revengeScore >= 14 && avoidanceScore < 24) {
        highR.style.display = 'block';
        fbShareTxt = 'I have a high revenge conflict style. Take the Science of Us revenge quiz to see how you score.';
        twitShareTxt = 'I have a high revenge conflict style. Take @thescienceofus revenge quiz to see how you score.';
        smsShareTxt = 'I have a high revenge conflict style. Let me know how you score:';
      } else if (revengeScore < 14 && avoidanceScore >= 24) {
        highA.style.display = 'block';
        fbShareTxt = 'I have a high avoidance conflict style. Take the Science of Us revenge quiz to see how you score.';
        twitShareTxt = 'I have a high avoidance conflict style. Take @thescienceofus revenge quiz to see how you score.';
        smsShareTxt = 'I have a high avoidance conflict style. Let me know how you score:';
      } else if (revengeScore <= 8 && avoidanceScore <= 13) {
        lowRLowA.style.display = 'block';
        fbShareTxt = 'I have a low revenge and low avoidance conflict style. Take the Science of Us revenge quiz to see how you score.';
        twitShareTxt = 'I have a low revenge and low avoidance conflict style. Take @thescienceofus revenge quiz to see how you score.';
        smsShareTxt = 'I have a low revenge and low avoidance conflict style. Let me know how you score:';
      } else {
        average.style.display = 'block';
        fbShareTxt = 'I have an average revenge and average avoidance conflict style. Take the Science of Us revenge quiz to see how you score.';
        twitShareTxt = 'I have an average revenge and average avoidance conflict style. Take @thescienceofus revenge quiz to see how you score.';
        smsShareTxt = 'I have an average revenge and average avoidance conflict style. Let me know how you score:';
      }

      if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1) {
        smsMessage = 'sms:&body=' + smsShareTxt + ' ' + shareURL + '?mid=sms-share-quiz-scienceofus';
      } else {
        smsMessage = 'sms:?body=' + smsShareTxt + ' ' + shareURL + '?mid=sms-share-quiz-scienceofus';
      }

      smsShare.setAttribute('href', smsMessage);
    },
    shareFacebook: function shareFacebook(e) {
      e.preventDefault();
      FB.ui({
        method: 'feed',
        link: shareURL + '?mid=facebook-share-quiz-scienceofus',
        picture: shareImg,
        name: shareTitle,
        caption: ' ',
        description: fbShareTxt
      });
    },
    shareTwitter: function shareTwitter(e) {
      var message = twitShareTxt + ' ' + shareURL + '?mid=twitter-share-quiz-scienceofus',
          positionLeft = Math.ceil($window.innerWidth / 2 - 300),
          positionTop = Math.ceil($window.innerHeight / 2 - 127);
      e.preventDefault();
      $window.open('http://twitter.com/intent/tweet?source=tweetbutton&amp;text=' + encodeURIComponent(message), 'Tweet Your Score', 'width=600,height=300,left=' + positionLeft + ',top=' + positionTop);
    }
  };
  return Constructor;
}]);
}, {"37":37}];
