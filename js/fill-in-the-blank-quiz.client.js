window.modules["fill-in-the-blank-quiz.client"] = [function(require,module,exports){'use strict';

var _map = require(37),
    _forEach = require(27),
    dom = require(1);

DS.controller('fill-in-the-blank-quiz', ['$document', '$window', function ($document, $window) {
  var ua = navigator.userAgent.toLowerCase(),
      shareImg,
      canonicalEl,
      shareURL,
      shareTitle,
      fbShareTxt,
      twitShareTxt,
      smsShareTxt,
      smsMessage,
      totalCorrect = 0,
      numClicked;
  canonicalEl = dom.find('link[rel="canonical"]');
  shareURL = canonicalEl && canonicalEl.getAttribute('href');
  shareImg = dom.find('meta[property="og:image"]').getAttribute('content');
  shareTitle = dom.find('meta[property="og:title"]').getAttribute('content');

  function Constructor(el) {
    this.el = el;
    this.scoreRubric = dom.findAll(el, '.quiz-scoring-rubric');
    this.facebookShareMsg = el.getAttribute('data-facebookMessage');
    this.twitterShareMsg = el.getAttribute('data-twitterMessage');
    this.smsShareMsg = el.getAttribute('data-smsMessage');
    this.mediaEl = dom.findAll(el, '.media-element');
    this.maxNum;
    this.minNum;
    this.hideMediaEl(this.mediaEl);
  }

  Constructor.prototype = {
    events: {
      'input[type=text] keyup': 'showSubmitBtn',
      '.submit click': 'checkAnswer',
      '.custom-share-fb click': 'shareFacebook',
      '.custom-share-twitter click': 'shareTwitter'
    },
    // hide/show the elements based on whether or not they contain child elements
    hideMediaEl: function hideMediaEl(el) {
      var i;

      for (i = 0; i < el.length; i++) {
        if (el[i].lastElementChild === null) {
          el[i].style.display = 'none';
        } else {
          el[i].style.display = 'block';
        }
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
    // Show the quiz results
    showResults: function showResults(el, value, slideEl, submitBtn) {
      var textField = slideEl.querySelector('input[type=text]'),
          correct = slideEl.getAttribute('data-answer'),
          answerDiv = slideEl.querySelector('.answer-correct'),
          wrongIcon = slideEl.querySelector('.icon.icon-wrong'),
          cutWrongIcon = slideEl.querySelector('.cut-icon.icon-wrong'),
          correctIcon = slideEl.querySelector('.icon.icon-correct'),
          cutCorrectIcon = slideEl.querySelector('.cut-icon.icon-correct'),
          submitIcon = slideEl.querySelector('.icon.icon-submit'),
          cutSubmitIcon = slideEl.querySelector('.cut-icon.icon-submit'),
          resultsEl = dom.find('.results'),
          finalScore = dom.find('.score'),
          description = dom.find('.description'),
          smsShare = dom.find('.custom-share-sms'),
          keysArr = [],
          i,
          correctArray,
          answerMatch,
          socialMessage = '',
          altCorrectArray;
      textField.readOnly = true;
      submitIcon.classList.remove('visible');
      cutSubmitIcon.classList.remove('visible');
      slideEl.classList.add('done'); // gets all the 'keys' (score range) in each quiz-scoring-rubric

      _forEach(this.scoreRubric, function (rubric) {
        keysArr.push(rubric.attributes['data-key'].value);
      }); // make all of the terms lowercase to match the values


      answerMatch = correct.toLowerCase(); // turn the altered answer key into an array

      altCorrectArray = answerMatch.split('; '); // unaltered array
      // all values remain as they were
      // used in the 'ANSWER: ' result

      correctArray = correct.split('; '); // check if the value given matches terms in the array

      if (altCorrectArray.indexOf(value) > -1) {
        submitBtn.classList.add('correct');
        correctIcon.classList.add('visible');
        cutCorrectIcon.classList.add('visible');
        totalCorrect += 1;
      } else {
        submitBtn.classList.add('wrong');
        wrongIcon.classList.add('visible');
        cutWrongIcon.classList.add('visible');
        answerDiv.classList.add('visible');
        answerDiv.innerHTML = 'ANSWER: ' + correctArray[0];
      }

      if (numClicked === dom.findAll('.fill-in-the-blank-quiz-questions').length) {
        resultsEl.style.display = 'block';
        finalScore.innerHTML = 'You scored ' + totalCorrect + '/' + numClicked + '.';

        for (i = 0; i < keysArr.length; i++) {
          this.getRangeMaxMin(keysArr[i]);

          if (totalCorrect <= this.maxNum && totalCorrect >= this.minNum) {
            socialMessage += this.scoreRubric[i].attributes['data-social'].value + ' ';
            description.innerHTML = this.scoreRubric[i].attributes['data-description'].value;
          }
        }

        this.shareMessages(socialMessage);
      }

      if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1) {
        smsMessage = 'sms:&body=' + smsShareTxt + ' ' + shareURL + '?mid=sms-share-' + shareTitle.toLowerCase();
      } else {
        smsMessage = 'sms:?body=' + smsShareTxt + ' ' + shareURL + '?mid=sms-share-' + shareTitle.toLowerCase();
      }

      smsShare.setAttribute('href', smsMessage);
    },
    shareMessages: function shareMessages(socialMessage) {
      fbShareTxt = socialMessage + this.facebookShareMsg;
      twitShareTxt = this.twitterShareMsg;
      smsShareTxt = socialMessage + this.smsShareMsg;
    },
    // Check each quiz answer and then call 'showResults' once the quiz is done.
    checkAnswer: function checkAnswer(e) {
      var el = this.el,
          submitBtn = e.currentTarget,
          answerEl = dom.closest(submitBtn, '.answer'),
          slideEl = dom.closest(submitBtn, '.fill-in-the-blank-quiz-questions'),
          value = answerEl.querySelector('input[type=text]').value.toLowerCase();
      numClicked = dom.findAll('.done').length + 1;
      this.showResults(el, value, slideEl, submitBtn);
    },
    showSubmitBtn: function showSubmitBtn(e) {
      var el = this.el,
          textBox = e.target,
          answerEl = dom.closest(textBox, '.answer'),
          slideEl = dom.closest(textBox, '.fill-in-the-blank-quiz-questions'),
          submitBtn = answerEl.querySelector('.submit'),
          submitIcons = answerEl.querySelectorAll('.icon-submit'),
          value = textBox.value.toLowerCase(),
          i;
      numClicked = dom.findAll('.done').length + 1;

      if (textBox.value) {
        if (!submitBtn.classList.contains('done')) {
          submitBtn.classList.add('visible');

          for (i = 0; i < submitIcons.length; i++) {
            submitIcons[i].classList.add('visible');
          }
        }
      } else {
        submitBtn.classList.remove('visible');

        for (i = 0; i < submitIcons.length; i++) {
          submitIcons[i].classList.remove('visible');
        }
      } // enter key submits the answer


      if (e.keyCode == 13) {
        if (!submitBtn.classList.contains('done')) {
          if (submitBtn.classList.contains('visible')) {
            this.showResults(el, value, slideEl, submitBtn);
          }
        }
      }
    },
    shareFacebook: function shareFacebook(e) {
      e.preventDefault();
      FB.ui({
        method: 'feed',
        link: shareURL + '?mid=facebook-share' + shareTitle.toLowerCase(),
        picture: shareImg,
        name: shareTitle,
        caption: ' ',
        description: fbShareTxt
      });
    },
    shareTwitter: function shareTwitter(e) {
      var message = twitShareTxt + ' ' + shareURL + '?mid=twitter-share-' + shareTitle.toLowerCase(),
          positionLeft = Math.ceil($window.innerWidth / 2 - 300),
          positionTop = Math.ceil($window.innerHeight / 2 - 127);
      e.preventDefault();
      $window.open('http://twitter.com/intent/tweet?source=tweetbutton&amp;text=' + encodeURIComponent(message), 'Tweet Your Score', 'width=600,height=300,left=' + positionLeft + ',top=' + positionTop);
    }
  };
  return Constructor;
}]);
}, {"1":1,"27":27,"37":37}];
