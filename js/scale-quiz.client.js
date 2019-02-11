window.modules["scale-quiz.client"] = [function(require,module,exports){'use strict';

var _forEach = require(27),
    _map = require(37),
    dom = require(1);

DS.controller('scale-quiz', ['$window', function ($window) {
  var shareImg, shareURL, shareTitle, fbShareTxt, twitShareTxt;
  shareImg = dom.find('meta[property="og:image"]').getAttribute('content');
  shareURL = dom.find('meta[property="og:url"]').getAttribute('content');
  shareTitle = dom.find('meta[property="og:title"]').getAttribute('content');

  function Constructor(el) {
    this.el = el;
    this.scoreRubric = dom.findAll(el, '.quiz-scoring-rubric');
    this.questionsEl = dom.find(el, '.questions');
    this.resultsEl = dom.find(el, '.results');
    this.slides = dom.findAll(this.questionsEl, '.slide');
    this.description = dom.find(this.resultsEl, '.description');
    this.facebookShareMsg = el.getAttribute('data-facebookMessage');
    this.twitterShareMsg = el.getAttribute('data-twitterMessage');
    this.resultsHeadline = dom.find(this.resultsEl, '.results-headline');
    this.socialMessage = '';
    this.maxNum;
    this.minNum;
    this.setQuestionAttributes();
  }

  Constructor.prototype = {
    events: {
      '.questions input click': 'checkAnswers',
      '.submit-quiz click': 'getResults',
      '.custom-share-fb click': 'shareFacebook',
      '.custom-share-twitter click': 'shareTwitter'
    },
    // sets unique id, for, and name attributes for each input/label
    setQuestionAttributes: function setQuestionAttributes() {
      var slide,
          uniqueId,
          uniqueName,
          inputs,
          labels,
          questionList = dom.findAll(this.el, '.scale-quiz-question');

      _forEach(questionList, function (question, slideIdx) {
        slide = question.firstElementChild, inputs = dom.findAll(slide, 'input'), labels = dom.findAll(slide, 'label');

        _forEach(inputs, function (input, inputIdx) {
          uniqueId = 'Q-' + slideIdx + '-' + inputIdx;
          uniqueName = 'Q-' + slideIdx;
          input.setAttribute('id', uniqueId);
          input.setAttribute('name', uniqueName);
        });

        _forEach(labels, function (label, labelIdx) {
          uniqueId = 'Q-' + slideIdx + '-' + labelIdx;
          label.setAttribute('for', uniqueId);
        });
      });
    },
    checkAnswers: function checkAnswers() {
      var el = this.el,
          submitBtn = dom.find(el, '.submit-quiz'),
          questions = dom.findAll(el, '.question-wrapper'),
          answers = dom.findAll(el, 'input:checked');

      if (questions.length === answers.length) {
        submitBtn.removeAttribute('disabled');
      }

      submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
      });
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
    shareMessages: function shareMessages(msg) {
      fbShareTxt = msg + this.facebookShareMsg;
      twitShareTxt = msg + this.twitterShareMsg;
    },
    getCategorizedQuizResults: function getCategorizedQuizResults() {
      var i,
          categoryScoring = {},
          keysArr = [],
          valsArr,
          highestVal,
          additionalHeadline,
          additionalDescription,
          c; // gets all the 'keys' (categories) in each quiz-scoring-rubric

      _forEach(this.scoreRubric, function (rubric) {
        keysArr.push(rubric.attributes['data-key'].value);
      }); // initialize each category with a score of 0


      for (i = 0; i < keysArr.length; i++) {
        categoryScoring[keysArr[i]] = 0;
      } // totals up the score for each category


      _forEach(this.slides, function (scoreVal) {
        for (c in categoryScoring) {
          // using toUpperCase() for case insensitive comparison
          if (dom.find(scoreVal, '.category').innerHTML.toUpperCase() === c.toUpperCase()) {
            categoryScoring[c] += parseInt(dom.find(scoreVal, 'input:checked').value);
          }
        }
      });

      valsArr = Object.keys(categoryScoring).map(function (key) {
        return categoryScoring[key];
      });
      highestVal = Math.max.apply(null, valsArr); // displays results depending on the highest scoring category, displays all highest category results in case of a tie

      for (i = 0; i < keysArr.length; i++) {
        if (categoryScoring[keysArr[i]] === highestVal) {
          if (!this.description.innerHTML) {
            this.resultsHeadline.innerHTML = this.scoreRubric[i].attributes['data-headline'].value;
            this.resultsHeadline.classList.remove('hidden');
            this.description.innerHTML = this.scoreRubric[i].attributes['data-description'].value;
            this.description.classList.remove('hidden');
          } else {
            // creates additional results headline and description for every category result that has the highest score
            additionalHeadline = document.createElement('p');
            additionalHeadline.classList.add('additional-headline');
            additionalDescription = document.createElement('p');
            additionalDescription.classList.add('additional-description');
            additionalHeadline.innerHTML = this.scoreRubric[i].attributes['data-headline'].value;
            additionalDescription.innerHTML = this.scoreRubric[i].attributes['data-description'].value;
            this.description.appendChild(additionalHeadline);
            this.description.appendChild(additionalDescription);
          }

          this.socialMessage += this.scoreRubric[i].attributes['data-social'].value + ' ';
          this.shareMessages(this.socialMessage);
        }
      }
    },
    getResults: function getResults() {
      var isCategorized = this.el.getAttribute('data-categorized'),
          score = 0,
          i,
          keysArr = [];
      this.questionsEl.classList.add('hidden');
      this.resultsEl.classList.remove('hidden');
      this.resultsEl.focus();
      this.el.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      }); // categorized quizzes have a different scoring logic since scoring is based on 'categories' instead of score ranges

      if (isCategorized === 'true') {
        this.getCategorizedQuizResults();
      } else {
        // calculates score
        _forEach(this.slides, function (scoreVal) {
          score += parseInt(dom.find(scoreVal, 'input:checked').value);
        }); // gets all the 'keys' (score range) in each quiz-scoring-rubric


        _forEach(this.scoreRubric, function (rubric) {
          keysArr.push(rubric.attributes['data-key'].value);
        }); // finds the range that the score falls into and uses the corresponding result text and social message


        for (i = 0; i < keysArr.length; i++) {
          this.getRangeMaxMin(keysArr[i]);

          if (score <= this.maxNum && score >= this.minNum) {
            this.resultsHeadline.innerHTML = this.scoreRubric[i].attributes['data-headline'].value;
            this.resultsHeadline.classList.remove('hidden');
            this.description.innerHTML = this.scoreRubric[i].attributes['data-description'].value;
            this.description.classList.remove('hidden');
            this.socialMessage += this.scoreRubric[i].attributes['data-social'].value + ' ';
            this.shareMessages(this.socialMessage);
            break;
          }
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
