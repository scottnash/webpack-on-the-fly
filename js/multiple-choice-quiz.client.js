window.modules["multiple-choice-quiz.client"] = [function(require,module,exports){'use strict';

var _forEach = require(27),
    _map = require(37),
    dom = require(1);

DS.controller('multiple-choice-quiz', ['$window', function ($window) {
  var shareImg, shareURL, shareTitle, fbShareTxt, twitShareTxt;
  shareImg = dom.find('meta[property="og:image"]').getAttribute('content');
  shareURL = dom.find('meta[property="og:url"]').getAttribute('content');
  shareTitle = dom.find('meta[property="og:title"]').getAttribute('content');

  function Constructor(el) {
    var i, buttonsEl, contentRevealBtn, question;
    this.scoreRubric = dom.findAll(el, '.quiz-scoring-rubric');
    this.questionsEl = dom.find(el, '.questions');
    this.resultsEl = dom.find(el, '.results');
    this.slide = dom.findAll(this.questionsEl, '.slide');
    this.multChoiceQuestions = dom.findAll(el, '.question-wrapper');
    this.decisions = dom.findAll(el, '.decision');
    this.description = dom.find(this.resultsEl, '.mc-description');
    this.facebookShareMsg = el.getAttribute('data-facebookMessage');
    this.twitterShareMsg = el.getAttribute('data-twitterMessage');
    this.maxNum;
    this.minNum;
    this.score = 0;
    this.answered = 0; // Hacky way to add a class to a div in `multiple-choice-quiz-question` using a field in the `content-reveal-btn`.

    for (i = 0; i < this.decisions.length; i++) {
      buttonsEl = dom.find(this.decisions[i], '.buttons');
      contentRevealBtn = dom.find(buttonsEl, '.content-reveal-btn');
      question = dom.find(this.multChoiceQuestions[i], '.question');

      if (contentRevealBtn.classList.contains('has-image') && !question) {
        buttonsEl.classList.add('btn-has-image');
      }
    }
  }

  Constructor.prototype = {
    events: {
      '.questions .content-reveal-btn click': 'checkAnswers',
      '.custom-share-fb click': 'shareFacebook',
      '.custom-share-twitter click': 'shareTwitter'
    },
    checkAnswers: function checkAnswers(e) {
      var target = e.currentTarget,
          targetSlide = dom.closest(target, '.slide'),
          result = targetSlide.querySelector('.reveal-content'),
          inputs;

      if (target.getAttribute('data-answer') === 'correct') {
        target.classList.add('correct-choice');
        result.querySelector('.correct').classList.remove('hidden');
        result.querySelector('.correct-reveal').classList.remove('hidden');
        this.score += 1;
      } else {
        target.classList.add('incorrect-choice');
        result.querySelector('.incorrect').classList.remove('hidden');
        result.querySelector('.incorrect-reveal').classList.remove('hidden');
      }

      this.answered += 1;
      inputs = targetSlide.querySelectorAll('.content-reveal-btn'); // When an answer is clicked, disable all buttons in that question.

      _forEach(inputs, function (input) {
        input.classList.add('disabled');
      });

      target.style.opacity = 1;

      if (this.multChoiceQuestions.length === this.answered) {
        this.getResults();
      }
    },
    // gets the min and max of a range (e.g., "1-10")
    getRangeMaxMin: function getRangeMaxMin(range) {
      var stringArr = range.match(/(\d[\d\.]*)/g),
          numArr = [];

      _map(stringArr, function (num) {
        numArr.push(parseInt(num));
      });

      this.maxNum = Math.max.apply(Math, numArr);
      this.minNum = Math.min.apply(Math, numArr);
    },
    shareMessages: function shareMessages(socialMessage) {
      fbShareTxt = socialMessage + this.facebookShareMsg;
      twitShareTxt = socialMessage + this.twitterShareMsg;
    },
    getResults: function getResults() {
      var socialMessage = '',
          i,
          keysArr = [],
          additionalDescription,
          finalScore;
      this.resultsEl.classList.remove('hidden');
      this.resultsEl.focus(); // gets all the 'keys' (score range) in each quiz-scoring-rubric

      _forEach(this.scoreRubric, function (rubric) {
        keysArr.push(rubric.attributes['data-key'].value);
      });

      for (i = 0; i < keysArr.length; i++) {
        this.getRangeMaxMin(keysArr[i]);

        if (this.score <= this.maxNum && this.score >= this.minNum) {
          finalScore = this.score + '/' + this.multChoiceQuestions.length;
          this.description.innerHTML = 'You scored ' + finalScore + '. ';
          additionalDescription = document.createElement('div');
          additionalDescription.className = 'additional-description';
          additionalDescription.innerHTML = this.scoreRubric[i].attributes['data-description'].value;
          this.description.appendChild(additionalDescription);
          this.description.classList.remove('hidden');
          socialMessage += 'I scored ' + finalScore + '. ';
          this.shareMessages(socialMessage);
          break;
        }
      }
    },
    shareFacebook: function shareFacebook(e) {
      e.preventDefault();
      FB.ui({
        method: 'feed',
        link: shareURL + '?mid=facebook-share-quiz',
        picture: shareImg,
        name: shareTitle,
        caption: ' ',
        description: fbShareTxt
      });
    },
    shareTwitter: function shareTwitter(e) {
      var message = twitShareTxt + ' ' + shareURL + '?mid=twitter-share-quiz',
          positionLeft = Math.ceil($window.innerWidth / 2 - 300),
          positionTop = Math.ceil($window.innerHeight / 2 - 127);
      e.preventDefault();
      $window.open('https://twitter.com/intent/tweet?source=tweetbutton&amp;text=' + encodeURIComponent(message), 'Tweet Your Score', 'width=600,height=300,left=' + positionLeft + ',top=' + positionTop);
    }
  };
  return Constructor;
}]);
}, {"1":1,"27":27,"37":37}];
