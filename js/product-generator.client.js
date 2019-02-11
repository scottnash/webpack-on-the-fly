window.modules["product-generator.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

DS.controller('product-generator', [function () {
  function Constructor(el) {
    this.el = el;
    this.questionsEl = dom.find(el, '.questions');
    this.submitButton = dom.find(el, '.submit-button');
    this.productsEl = dom.find(el, '.product-generator-products');
    this.productList = dom.findAll(el, '.product-generator-product');
    this.quizQuestions = dom.findAll(el, '.question-wrapper');
    this.questionsAnswered = 0;
    this.quizCompleted = false;
  }

  Constructor.prototype = {
    events: {
      '.submit-button click': 'handleSubmit',
      '.product-generator-reveal-btn click': 'handleRevealBtnClick'
    },
    handleSubmit: function handleSubmit() {
      this.showProducts(); // disable further interaction with reveal buttons

      this.quizCompleted = true;
      this.el.classList.add('completed');
    },
    showProducts: function showProducts() {
      var selectedAnswers = dom.findAll('.product-generator-reveal-btn.selected'),
          selectedAnswersSelections = [],
          i;

      if (this.quizQuestions.length === selectedAnswers.length) {
        this.submitButton.classList.add('hide');
        this.submitButton.removeEventListener('click', this.showProducts);
        this.productsEl.classList.add('show-group');

        for (i = 0; i < selectedAnswers.length; i++) {
          selectedAnswersSelections.push(selectedAnswers[i].getAttribute('data-answer').toLowerCase());
        }

        for (i = 0; i < this.productList.length; i++) {
          if (selectedAnswersSelections.includes(this.productList[i].getAttribute('data-corresponding-answer').toLowerCase())) {
            this.productList[i].classList.add('show');
          }
        }
      }
    },
    handleRevealBtnClick: function handleRevealBtnClick(e) {
      if (!this.quizCompleted) {
        this.updateButtonStates(e);
      }
    },
    updateButtonStates: function updateButtonStates(e) {
      var parentNode = e.target.parentNode,
          revealButtons = dom.findAll(parentNode, '.product-generator-reveal-btn'),
          incrementQuestionsAnswered = true,
          i;

      for (i = 0; i < revealButtons.length; i++) {
        if (revealButtons[i].classList.contains('selected')) {
          revealButtons[i].classList.remove('selected');
          revealButtons[i].setAttribute('aria-selected', 'false'); // don't increment if user has changed their answer

          incrementQuestionsAnswered = false;
        }
      }

      e.target.classList.add('selected');
      e.target.setAttribute('aria-selected', 'true');

      if (incrementQuestionsAnswered) {
        this.questionsAnswered++;
      }

      if (this.questionsAnswered === this.quizQuestions.length) {
        this.submitButton.classList.remove('initial-state');
      }
    }
  };
  return Constructor;
}]);
}, {"1":1}];
