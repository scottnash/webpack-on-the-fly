window.modules["quiz-personality.client"] = [function(require,module,exports){'use strict';

var _forEach = require(27),
    _map = require(37),
    dom = require(1);

DS.controller('quiz-personality', ['$document', '$window', function ($document, $window) {
  var shareImg, shareURL, shareTitle, fbShareTxt, twitShareTxt;
  shareImg = $document.querySelector('meta[property="og:image"]').getAttribute('content');
  shareURL = $document.querySelector('meta[property="og:url"]').getAttribute('content');
  shareTitle = $document.querySelector('meta[property="og:title"]').getAttribute('content');

  function Constructor(el) {
    this.el = el;
    this.scoreObject = JSON.parse(this.el.getAttribute('data-answers'));
    this.quizType = this.el.getAttribute('data-type');
    this.multChoiceQuestions = dom.findAll(this.el, '.decision-question');
    this.questionsEl = dom.find(this.el, '.questions');
    this.resultsEl = dom.find(this.el, '.results');
    this.slide = this.questionsEl.querySelectorAll('.slide');
    this.facebookShareMsg = this.el.getAttribute('data-facebookMessage');
    this.twitterShareMsg = this.el.getAttribute('data-twitterMessage');
    this.description = this.resultsEl.querySelector('.description');
    this.rangeMax, this.rangeMin;
  }

  Constructor.prototype = {
    events: {
      '.questions input click': 'checkAnswers',
      '.submit-quiz click': 'getResults',
      '.custom-share-fb click': 'shareFacebook',
      '.custom-share-twitter click': 'shareTwitter'
    },
    checkAnswers: function checkAnswers(e) {
      var el = this.el,
          submitBtn = dom.find(el, '.submit-quiz'),
          questions = dom.findAll(el, '.question'),
          decisionQuestions = dom.findAll(el, '.decision-question'),
          answers = dom.findAll(el, 'input:checked'),
          target = e.target,
          targetSlide = dom.closest(target, '.slide'),
          result = targetSlide.querySelector('.reveal-content'),
          incorrectSelection = '#ff244e',
          inputs;

      if (this.quizType === 'multiple choice') {
        if (target.value === 'true') {
          result.querySelector('.correct').classList.remove('hidden');
        } else {
          target.nextSibling.style.backgroundColor = incorrectSelection;
          result.querySelector('.incorrect').classList.remove('hidden');
        }

        inputs = targetSlide.querySelectorAll('input');

        _forEach(inputs, function (input) {
          input.disabled = true;
        });

        target.disabled = false;
        target.nextSibling.style.color = '#fff';
        target.nextSibling.style.fontWeight = 'bold';

        if (this.multChoiceQuestions.length === answers.length) {
          this.getResults();
        }
      } else {
        if (questions.length === answers.length || decisionQuestions.length === answers.length) {
          submitBtn.removeAttribute('disabled');
        }

        submitBtn.addEventListener('click', function (e) {
          e.preventDefault();
        });
      }
    },
    // gets the min and max of a range (e.g., "1-10")
    getRangeMaxMin: function getRangeMaxMin(index) {
      var keys = Object.keys(this.scoreObject.results),
          stringArr = keys[index].match(/(\d[\d\.]*)/g),
          numArr = [];

      _map(stringArr, function (num) {
        numArr.push(parseInt(num));
      });

      this.rangeMax = Math.max.apply(Math, numArr);
      this.rangeMin = Math.min.apply(Math, numArr);
    },
    shareMessages: function shareMessages(socialMessage) {
      fbShareTxt = socialMessage + this.facebookShareMsg;
      twitShareTxt = socialMessage + this.twitterShareMsg;
    },
    getCategoryQuizResults: function getCategoryQuizResults() {
      var keysArr = Object.keys(this.scoreObject.results),
          socialMessage = '',
          categoryScoring = {},
          valsArr,
          highestVal,
          additionalDescription; // initialize each category with a score of 0

      for (var i = 0; i < keysArr.length; i++) {
        categoryScoring[keysArr[i]] = 0;
      } // totals up the score for each category


      _forEach(this.slide, function (scoreVal) {
        for (var c in categoryScoring) {
          if (scoreVal.querySelector('.category').innerHTML === c) {
            categoryScoring[c] += parseInt(scoreVal.querySelector('input:checked').value);
          }
        }
      });

      valsArr = Object.keys(categoryScoring).map(function (key) {
        return categoryScoring[key];
      });
      highestVal = Math.max.apply(null, valsArr); // displays results depending on the highest scoring category, displays all highest category results in case of a tie

      for (var _i = 0; _i < keysArr.length; _i++) {
        if (categoryScoring[keysArr[_i]] === highestVal) {
          if (!this.description.innerHTML) {
            this.description.innerHTML = this.scoreObject.results[keysArr[_i]][0];
            this.description.classList.remove('hidden');
          } else {
            additionalDescription = document.createElement('div');
            additionalDescription.innerHTML = this.scoreObject.results[keysArr[_i]][0];
            this.description.appendChild(additionalDescription);
          }

          socialMessage += this.scoreObject.results[keysArr[_i]][1] + ' ';
          this.shareMessages(socialMessage);
        }
      }
    },
    multipleChoiceResults: function multipleChoiceResults() {
      var keysArr = Object.keys(this.scoreObject.results),
          socialMessage = '',
          multChoiceDescription = this.resultsEl.querySelector('.mc-description'),
          additionalDescription,
          finalScore,
          score = 0;

      _map(this.slide, function (scoreVal) {
        if (scoreVal.querySelector('input:checked').value === 'true') {
          score += 1;
        }
      });

      for (var i = 0; i < keysArr.length; i++) {
        this.getRangeMaxMin(i);

        if (score <= this.rangeMax && score >= this.rangeMin) {
          finalScore = score + '/' + this.multChoiceQuestions.length;
          multChoiceDescription.innerHTML = 'You scored ' + finalScore + '. ';
          additionalDescription = document.createElement('div');
          additionalDescription.className = 'additional-description';
          additionalDescription.innerHTML = this.scoreObject.results[keysArr[i]][0];
          multChoiceDescription.appendChild(additionalDescription);
          multChoiceDescription.classList.remove('hidden');
          socialMessage += 'I scored ' + finalScore + '. ';
          this.shareMessages(socialMessage);
          break;
        }
      }
    },
    getResults: function getResults() {
      var el = this.el,
          keysArr = Object.keys(this.scoreObject.results),
          socialMessage = '',
          score = 0,
          i;

      if (this.quizType === 'multiple choice') {
        this.resultsEl.classList.remove('hidden');
        this.resultsEl.focus();
      } else {
        this.questionsEl.classList.add('hidden');
        this.resultsEl.classList.remove('hidden');
        this.resultsEl.focus();
        el.scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        });
      } // category quizzes have a different scoring logic than regular scale and decision quizzes


      if (this.quizType === 'category') {
        this.getCategoryQuizResults();
      } else if (this.quizType === 'multiple choice') {
        this.multipleChoiceResults();
      } else {
        _map(this.slide, function (scoreVal) {
          score = score + parseInt(scoreVal.querySelector('input:checked').value);
        }); // checks for which range the score is in


        for (i = 0; i < keysArr.length; i++) {
          this.getRangeMaxMin(i);

          if (score <= this.rangeMax && score >= this.rangeMin) {
            this.description.innerHTML = this.scoreObject.results[keysArr[i]][0];
            this.description.classList.remove('hidden');
            socialMessage += this.scoreObject.results[keysArr[i]][1] + ' ';
            this.shareMessages(socialMessage);
            break;
          }
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
      $window.open('https://twitter.com/intent/tweet?source=tweetbutton&amp;text=' + encodeURIComponent(message), 'Tweet Your Score', 'width=600,height=300,left=' + positionLeft + ',top=' + positionTop);
    }
  };
  return Constructor;
}]);
}, {"1":1,"27":27,"37":37}];
