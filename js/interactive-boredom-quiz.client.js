window.modules["interactive-boredom-quiz.client"] = [function(require,module,exports){'use strict';

var _map = require(37);

DS.controller('interactive-boredom-quiz', ['$document', '$window', function ($document, $window) {
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

  function shareMessages(socialMessage) {
    fbShareTxt = socialMessage + 'Take the Science of Us boredom quiz to see how you score.';
    twitShareTxt = socialMessage + 'Take @thescienceofus boredom quiz to see how you score.';
    smsShareTxt = socialMessage + 'Let me know how you score:';
  }

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
          slide = questionsEl.querySelectorAll('.slide input:checked'),
          score = 0,
          description = resultsEl.querySelectorAll('.description'),
          smsShare = resultsEl.querySelector('.custom-share-sms'),
          socialMessage;
      questionsEl.style.display = 'none';
      resultsEl.style.display = 'block';
      el.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      });

      _map(slide, function (scoreVal) {
        score = score + parseInt(scoreVal.dataset.value);
      });

      if (score <= 11) {
        socialMessage = 'I don’t get bored easily. ';
        description[0].style.display = 'block';
        shareMessages(socialMessage);
      } else if (score > 11 && score < 17) {
        socialMessage = 'My tolerance for boredom is about average. ';
        description[1].style.display = 'block';
        shareMessages(socialMessage);
      } else {
        socialMessage = 'I get bored easily. ';
        description[2].style.display = 'block';
        shareMessages(socialMessage);
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
