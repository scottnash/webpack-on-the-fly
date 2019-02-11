window.modules["interactive-personality-quiz.client"] = [function(require,module,exports){'use strict';

var dom = require(1);
/* eslint max-nested-callbacks:[2,5] */


DS.controller('interactive-personality-quiz', ['$document', '$window', function ($document, $window) {
  var ua = navigator.userAgent.toLowerCase(),
      shareImg,
      shareURL,
      shareTitle,
      fbShareTxt,
      twitShareTxt,
      smsShareTxt,
      smsMessage,
      userGuess = {},
      scoreObj = {};
  shareImg = $document.querySelector('meta[property="og:image"]').getAttribute('content');
  shareURL = $document.querySelector('meta[property="og:url"]').getAttribute('content');
  shareTitle = $document.querySelector('meta[property="og:title"]').getAttribute('content');

  function shareMessages(socialMessage) {
    fbShareTxt = socialMessage + 'Take the Science of Us quiz to see how well you understand your personality.';
    twitShareTxt = 'Take @thescienceofus\'s personality quiz to see how well you know yourself.';
    smsShareTxt = socialMessage + 'Let me know how you score:';
  }

  function add(a, b) {
    return a + b;
  }

  function adjustPosition(num, numEl) {
    if (num < 10) {
      numEl.querySelector('.number').style.left = '-6px';
    }
  }

  function calcScore(el, trait) {
    var questionsEl = el.querySelector('.all-questions'),
        selections = questionsEl.querySelectorAll('.' + trait + ' input:checked'),
        result = el.querySelector('.result-' + trait + ' .score'),
        guess = el.querySelector('.result-' + trait + ' .guess'),
        rawScoreObj = {
      extraversion: [],
      agreeableness: [],
      conscientiousness: [],
      neuroticism: [],
      'open-mindedness': []
    },
        question,
        answer,
        finalScore,
        i,
        sum;

    for (i = 0; i < selections.length; i++) {
      question = dom.closest(selections[i], '.q-container');

      if (question.classList.contains('reverse')) {
        answer = parseInt(selections[i].getAttribute('data-value'));

        switch (answer) {
          case 1:
            answer += 4;
            break;

          case 2:
            answer += 2;
            break;

          case 4:
            answer -= 2;
            break;

          case 5:
            answer -= 4;
            break;

          default:
            answer = 3;
        }
      } else {
        answer = parseInt(selections[i].getAttribute('data-value'));
      }

      rawScoreObj[trait].push(answer);
    }

    sum = rawScoreObj[trait].reduce(add);
    finalScore = Math.round((sum - 6) * 4.17);
    scoreObj[trait] = finalScore;
    result.style.left = finalScore + '%';
    result.querySelector('.number').innerHTML = finalScore;
    adjustPosition(finalScore, result);
    guess.style.left = userGuess[trait] + '%';
    guess.querySelector('.number').innerHTML = userGuess[trait];
    adjustPosition(userGuess[trait], guess);
  }

  function moveScale(rangeEl, trait, input) {
    var numberEl = rangeEl.querySelector('.number'),
        scaleVal = parseInt(input.value);

    if (rangeEl.classList.contains('range-' + trait)) {
      numberEl.innerHTML = scaleVal;

      if (scaleVal < 10) {
        numberEl.style.left = scaleVal - 0.5 + '%';
      } else {
        if (ua.indexOf('iphone') > -1) {
          numberEl.style.left = scaleVal - 5 + '%';
        } else {
          numberEl.style.left = scaleVal - 2.5 + '%';
        }
      }

      userGuess[trait] = scaleVal;
    }
  }

  function showDescription(el, trait, num) {
    var resultsEl = el.querySelector('.all-results'),
        traitTxt = resultsEl.querySelector('.result-' + trait + ' .description'),
        num = parseInt(num);

    if (scoreObj[trait] <= num) {
      traitTxt.innerHTML = 'You scored very low on ' + trait + '. This puts you in approximately the 1st to 20th percentile of people who have taken this version of the Big Five personality test.';
    } else if (scoreObj[trait] > num + 1 && scoreObj[trait] <= num + 10) {
      traitTxt.innerHTML = 'You scored low on ' + trait + '. This puts you in approximately the 21st to 40th percentile of people who have taken this version of the Big Five personality test.';
    } else if (scoreObj[trait] > num + 11 && scoreObj[trait] <= num + 20) {
      traitTxt.innerHTML = 'You scored average on ' + trait + '. This puts you in approximately the 41st to 60th percentile of people who have taken this version of the Big Five personality test.';
    } else if (scoreObj[trait] > num + 21 && scoreObj[trait] <= num + 30) {
      traitTxt.innerHTML = 'You scored high on ' + trait + '. This puts you in approximately the 61st to 80th percentile of people who have taken this version of the Big Five personality test.';
    } else {
      traitTxt.innerHTML = 'You scored very high on ' + trait + '. This puts you in approximately the 81st to 99th percentile of people who have taken this version of the Big Five personality test.';
    }
  }

  function Constructor(el) {
    this.el = el;
  }

  Constructor.prototype = {
    events: {
      'input[type=range] input': 'changeScale',
      '.save click': 'saveGuesses',
      '.option click': 'checkAnswers',
      '.submit click': 'getResults',
      '.custom-share-fb click': 'shareFacebook',
      '.custom-share-twitter click': 'shareTwitter'
    },
    changeScale: function changeScale(e) {
      var el = this.el,
          input = e.currentTarget,
          rangeEl = dom.closest(input, '.trait-range'),
          saveBtn = el.querySelector('.save'),
          icon = el.querySelector('.icon');
      setTimeout(function () {
        icon.style.opacity = 0;
      }, 500);
      moveScale(rangeEl, 'extraversion', input);
      moveScale(rangeEl, 'agreeableness', input);
      moveScale(rangeEl, 'conscientiousness', input);
      moveScale(rangeEl, 'neuroticism', input);
      moveScale(rangeEl, 'open-mindedness', input);

      if (Object.keys(userGuess).length == 5) {
        saveBtn.classList.remove('is-disabled');
        saveBtn.classList.add('active');
      }
    },
    saveGuesses: function saveGuesses() {
      var el = this.el,
          saveBtn = el.querySelector('.save'),
          predictEl = el.querySelector('.predict'),
          questionsEl = el.querySelector('.all-questions');

      if (saveBtn.classList.contains('active')) {
        saveBtn.classList.add('loading');
        saveBtn.innerHTML = 'Loading Part 2...';
        setTimeout(function () {
          predictEl.style.display = 'none';
          questionsEl.style.display = 'block';
          el.scrollIntoView({
            behavior: 'smooth'
          });
        }, 1500);
      }
    },
    checkAnswers: function checkAnswers(e) {
      var el = this.el,
          optionBtn = e.currentTarget,
          allQuestions = el.querySelectorAll('.q-container'),
          currentQuestion = dom.closest(optionBtn, '.q-container'),
          submitBtn = el.querySelector('.submit'),
          numAnswered;
      currentQuestion.classList.add('done');
      numAnswered = el.querySelectorAll('.done');

      if (allQuestions.length === numAnswered.length) {
        submitBtn.classList.remove('is-disabled');
        submitBtn.classList.add('active');
      }
    },
    getResults: function getResults() {
      var el = this.el,
          submitBtn = el.querySelector('.submit'),
          questionsEl = el.querySelector('.all-questions'),
          resultsEl = el.querySelector('.all-results'),
          smsShare = resultsEl.querySelector('.custom-share-sms'),
          socialMessage = 'Think you know yourself? ';

      if (submitBtn.classList.contains('active')) {
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = 'Loading results...';
        calcScore(el, 'extraversion');
        calcScore(el, 'agreeableness');
        calcScore(el, 'conscientiousness');
        calcScore(el, 'neuroticism');
        calcScore(el, 'open-mindedness');
        setTimeout(function () {
          questionsEl.style.display = 'none';
          submitBtn.style.display = 'none';
          resultsEl.style.display = 'block';
          el.scrollIntoView({
            behavior: 'smooth'
          });
        }, 1500);
      }

      showDescription(el, 'extraversion', 40);
      showDescription(el, 'agreeableness', 50);
      showDescription(el, 'conscientiousness', 45);
      showDescription(el, 'neuroticism', 30);
      showDescription(el, 'open-mindedness', 50);
      shareMessages(socialMessage);

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
}, {"1":1}];
