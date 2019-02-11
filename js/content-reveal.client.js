window.modules["content-reveal.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

DS.controller('content-reveal', [function () {
  function Constructor() {}

  Constructor.prototype = {
    events: {
      '.content-reveal-btn click': 'checkAnswers'
    },
    checkAnswers: function checkAnswers(e) {
      var target = e.target,
          targetSlide = dom.closest(target, '.content-reveal'),
          result = targetSlide.querySelector('.reveal-content'),
          targetOption,
          targetData;

      if (target.classList.contains('content-reveal-btn')) {
        targetOption = target;
        targetData = target.dataset.answer;
      } else {
        targetOption = dom.closest(target, '.content-reveal-btn');
        targetData = targetOption.dataset.answer;
      }

      targetSlide.classList.add('disabled');
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
}, {"1":1}];
