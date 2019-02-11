window.modules["interactive-color-blind.client"] = [function(require,module,exports){'use strict';

DS.controller('interactive-color-blind', [function () {
  function closestClass(currentEl, className) {
    while ((currentEl = currentEl.parentElement) && !currentEl.classList.contains(className)) {
      ;
    }

    return currentEl;
  }

  function Constructor() {}

  Constructor.prototype = {
    events: {
      '.reveal click': 'revealInfo'
    },
    revealInfo: function revealInfo(e) {
      var currentEl = closestClass(e.target, 'color-test');
      currentEl.querySelector('.reveal').style.display = 'none';
      currentEl.querySelector('.results').style.display = 'block';
    }
  };
  return Constructor;
}]);
}, {}];
