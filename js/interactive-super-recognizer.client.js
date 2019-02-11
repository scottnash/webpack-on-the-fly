window.modules["interactive-super-recognizer.client"] = [function(require,module,exports){'use strict';

DS.controller('interactive-super-recognizer', ['$document', '$window', function ($document, $window) {
  var slideIndex = 0,
      score = 0,
      ua = navigator.userAgent.toLowerCase(),
      shareImg = $document.querySelector('meta[property="og:image"]').getAttribute('content'),
      shareURL = $document.querySelector('meta[property="og:url"]').getAttribute('content'),
      shareTitle = $document.querySelector('meta[property="og:title"]').getAttribute('content'),
      fbShareTxt,
      twitShareTxt,
      smsShareTxt,
      smsMessage;

  function highScoreResults(highScore, score, scoreRangeTxt) {
    scoreRangeTxt.textContent = score;
    highScore.classList.remove('isr-none');
    fbShareTxt = 'I might be a super-recognizer. Take the Science of Us super-recognizer test to see how you score.';
    twitShareTxt = 'I might be a super-recognizer. Take @thescienceofus super-recognizer test to see how you score.';
    smsShareTxt = 'Apparently I might be a super-recognizer. Let me know how you score:';
  }

  function averageScoreResults(averageScore, score, scoreRangeTxt) {
    scoreRangeTxt.textContent = score;
    averageScore.classList.remove('isr-none');
    fbShareTxt = 'I’m about average at recognizing faces. Take the Science of Us super-recognizer test to see how you score.';
    twitShareTxt = 'I’m about average at recognizing faces. Take @thescienceofus super-recognizer test to see how you score.';
    smsShareTxt = 'As if you didn’t already know, I’m about average at recognizing faces. Let me know how you score:';
  }

  function lowScoreResults(lowScore, scoreRangeTxt) {
    scoreRangeTxt.textContent = 'between 0 and 6';
    lowScore.classList.remove('isr-none');
    fbShareTxt = 'I’m pretty bad with faces. Take the Science of Us super-recognizer test to see how you score.';
    twitShareTxt = 'I’m pretty bad with faces. Take @thescienceofus super-recognizer test to see how you score.';
    smsShareTxt = 'As if you didn’t already know, I’m pretty bad with faces. Let me know how you score:';
  }

  function Constructor(el) {
    this.slides = el.querySelectorAll('.question');
    this.el = el;
  }

  Constructor.prototype = {
    events: {
      '.start-test click': 'startTest',
      '.timer-bar webkitAnimationEnd': 'timerEnds',
      '.timer-bar animationend': 'timerEnds',
      '.options button click': 'selectOption',
      '.custom-share-fb click': 'shareFacebook',
      '.custom-share-twitter click': 'shareTwitter'
    },
    startTest: function startTest() {
      var el = this.el,
          introScreen = el.querySelector('.intro'),
          questionSlide = this.slides;
      introScreen.classList.add('isr-none');
      questionSlide[0].classList.remove('isr-none');
      questionSlide[0].querySelector('.timer-bar').classList.add('on');
    },
    timerEnds: function timerEnds() {
      var questionSlide = this.slides,
          currentSlide = questionSlide[slideIndex],
          currentSlideTarget = currentSlide.querySelector('.target'),
          currentSlideOptions = currentSlide.querySelector('.options');
      currentSlideTarget.classList.add('isr-none');
      currentSlideOptions.classList.remove('isr-none');
    },
    selectOption: function selectOption(e) {
      var el = this.el,
          questionSlide = this.slides,
          questionSlideLength = questionSlide.length,
          selected = e.target.parentNode,
          nextSlide = slideIndex + 1,
          results = el.querySelector('.results'),
          scoreTxt = results.querySelector('.score'),
          scoreRangeTxt = results.querySelector('.score-range'),
          lowScore = results.querySelector('.low'),
          averageScore = results.querySelector('.average'),
          highScore = results.querySelector('.high'),
          percentScore = results.querySelector('.percent-score'),
          percentScorePlus = results.querySelector('.percent-score-plus'),
          smsShare = results.querySelector('.custom-share-sms'),
          lowScoreArr = {
        percentScoreTxt: '6.73%',
        percentScorePlusTxt: '100%'
      };

      if (selected.dataset.answer === 'match') {
        score++;
      }

      if (questionSlideLength > nextSlide) {
        questionSlide[slideIndex].classList.add('isr-none');
        questionSlide[nextSlide].classList.remove('isr-none');
        questionSlide[nextSlide].querySelector('.timer-bar').classList.add('on');
        slideIndex++;
      } else {
        questionSlide[slideIndex].classList.add('isr-none');
        results.classList.remove('isr-none');
        scoreTxt.textContent = score;
        var scorePercent = {
          14: {
            percentScoreTxt: '.71%',
            percentScorePlusTxt: '.71%'
          },
          13: {
            percentScoreTxt: '4.13%',
            percentScorePlusTxt: '4.84%'
          },
          12: {
            percentScoreTxt: '11.27%',
            percentScorePlusTxt: '16.11%'
          },
          11: {
            percentScoreTxt: '18.57%',
            percentScorePlusTxt: '34.68%'
          },
          10: {
            percentScoreTxt: '21.18%',
            percentScorePlusTxt: '55.86%'
          },
          9: {
            percentScoreTxt: '18.38%',
            percentScorePlusTxt: '74.24%'
          },
          8: {
            percentScoreTxt: '12.73%',
            percentScorePlusTxt: '86.97%'
          },
          7: {
            percentScoreTxt: '6.3%',
            percentScorePlusTxt: '93.27%'
          },
          6: lowScoreArr,
          5: lowScoreArr,
          4: lowScoreArr,
          3: lowScoreArr,
          2: lowScoreArr,
          1: lowScoreArr,
          0: lowScoreArr
        };
        percentScore.textContent = scorePercent[score].percentScoreTxt;
        percentScorePlus.textContent = scorePercent[score].percentScorePlusTxt;

        if (score >= 12) {
          highScoreResults(highScore, score, scoreRangeTxt);
        } else if (score < 12 && score > 6) {
          averageScoreResults(averageScore, score, scoreRangeTxt);
        } else {
          lowScoreResults(lowScore, scoreRangeTxt);
        }

        if ($window.innerWidth <= 600) {
          if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1) {
            smsMessage = 'sms:&body=' + smsShareTxt + ' ' + shareURL + '?mid=sms-share-quiz-scienceofus';
          } else {
            smsMessage = 'sms:?body=' + smsShareTxt + ' ' + shareURL + '?mid=sms-share-quiz-scienceofus';
          }

          smsShare.setAttribute('href', smsMessage);
        }
      }
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
}, {}];
