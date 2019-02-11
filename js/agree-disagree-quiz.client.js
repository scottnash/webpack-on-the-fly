window.modules["agree-disagree-quiz.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _map = require(37),
    _forEach = require(27);

DS.controller('agree-disagree-quiz', ['$window', function ($window) {
  var shareImg, shareURL, shareTitle, fbShareTxt, twitShareTxt;
  shareImg = dom.find('meta[property="og:image"]').getAttribute('content');
  shareURL = dom.find('meta[property="og:url"]').getAttribute('content');
  shareTitle = dom.find('meta[property="og:title"]').getAttribute('content');

  function Constructor(el) {
    this.el = el;
    this.scoreRubric = dom.findAll(this.el, '.quiz-scoring-rubric');
    this.questionsEl = dom.find(this.el, '.questions');
    this.resultsEl = dom.find(this.el, '.results');
    this.slides = dom.findAll(this.questionsEl, '.slide');
    this.description = dom.find(this.resultsEl, '.description');
    this.facebookShareMsg = this.el.getAttribute('data-facebookMessage');
    this.twitterShareMsg = this.el.getAttribute('data-twitterMessage');
    this.maxNum;
    this.minNum;
  }

  Constructor.prototype = {
    events: {
      '.questions input click': 'checkAnswers',
      '.submit-quiz click': 'getResults',
      '.custom-share-fb click': 'shareFacebook',
      '.custom-share-twitter click': 'shareTwitter'
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
    shareMessages: function shareMessages(socialMessage) {
      fbShareTxt = socialMessage + this.facebookShareMsg;
      twitShareTxt = socialMessage + this.twitterShareMsg;
    },
    getResults: function getResults() {
      var el = this.el,
          keysArr = [],
          socialMessage = '',
          resultsHeadline = dom.find(this.resultsEl, '.results-headline'),
          score = 0,
          i;
      this.questionsEl.classList.add('hidden');
      this.resultsEl.classList.remove('hidden');
      this.resultsEl.focus();
      el.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      }); // calculates score

      _forEach(this.slides, function (scoreVal) {
        score += parseInt(dom.find(scoreVal, 'input:checked').value);
      }); // gets all the 'keys' (score range) in each quiz-scoring-rubric


      _forEach(this.scoreRubric, function (rubric) {
        keysArr.push(rubric.attributes['data-key'].value);
      }); // finds the range that the score falls into and uses the corresponding result text and social message


      for (i = 0; i < keysArr.length; i++) {
        this.getRangeMaxMin(keysArr[i]);

        if (score <= this.maxNum && score >= this.minNum) {
          resultsHeadline.innerHTML = this.scoreRubric[i].attributes['data-headline'].value;
          resultsHeadline.classList.remove('hidden');
          this.description.innerHTML = this.scoreRubric[i].attributes['data-description'].value;
          this.description.classList.remove('hidden');
          socialMessage += this.scoreRubric[i].attributes['data-social'].value + ' ';
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
