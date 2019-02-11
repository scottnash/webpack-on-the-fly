window.modules["interactive-freud-quiz.client"] = [function(require,module,exports){'use strict';

DS.controller('interactive-freud-quiz', [function () {
  function closestClass(currentEl, className) {
    while ((currentEl = currentEl.parentElement) && !currentEl.classList.contains(className)) {
      ;
    }

    return currentEl;
  }

  function Constructor() {}

  Constructor.prototype = {
    events: {
      '.option click': 'checkAnswers'
    },
    checkAnswers: function checkAnswers(e) {
      var target = e.target,
          targetSlide = closestClass(target, 'slide'),
          result = targetSlide.querySelector('.results'),
          targetOption,
          targetData;

      if (target.classList.contains('option')) {
        targetOption = target;
        targetData = target.dataset.answer;
      } else {
        targetOption = closestClass(target, 'option');
        targetData = targetOption.dataset.answer;
      }

      targetSlide.classList.add('disable');
      result.style.display = 'block';

      switch (targetData) {
        case 'correct':
          result.querySelector('.correct').style.display = 'block';
          targetOption.classList.add('answer-correct');
          break;

        default:
          result.querySelector('.incorrect').style.display = 'block';
          targetOption.classList.add('answer-incorrect');
          break;
      }
    }
  };
  return Constructor;
}]);
}, {}];
