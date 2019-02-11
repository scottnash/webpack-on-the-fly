window.modules["obama-item.client"] = [function(require,module,exports){'use strict';

DS.controller('obama-item', [function () {
  function closestClass(currentEl, className) {
    while ((currentEl = currentEl.parentElement) && !currentEl.classList.contains(className)) {
      ;
    }

    return currentEl;
  }

  function Constructor() {}

  Constructor.prototype = {
    events: {
      '.article-info click': 'expandItem',
      '.read-less click': 'collapseItem'
    },
    expandItem: function expandItem(e) {
      var targetEl = closestClass(e.target, 'read-more');

      if (!targetEl.classList.contains('open')) {
        targetEl.classList.add('open');
      }
    },
    collapseItem: function collapseItem(e) {
      var targetEl = closestClass(e.target, 'read-more');
      targetEl.classList.remove('open');
    }
  };
  return Constructor;
}]);
}, {}];
