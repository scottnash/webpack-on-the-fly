window.modules["tags.client"] = [function(require,module,exports){'use strict';

var _forEach = require(27);

DS.controller('tags', [function () {
  function Constructor(el) {
    this.el = el;
  }

  Constructor.prototype = {
    events: {
      'a.more click': 'showAll'
    },
    showAll: function showAll(e) {
      var button = e.target,
          hiddenTags = this.el.querySelectorAll('li.hidden');

      _forEach(hiddenTags, function (hiddenTag) {
        hiddenTag.classList.remove('hidden');
      });

      button.parentNode.removeChild(button);
      e.preventDefault();
    }
  };
  return Constructor;
}]);
}, {"27":27}];
