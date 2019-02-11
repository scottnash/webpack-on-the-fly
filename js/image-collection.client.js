window.modules["image-collection.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

module.exports = function (el) {
  var showMoreButton = el.querySelector('button.more-trigger'),
      attribution = el.querySelector('.mobile .attribution');

  if (showMoreButton) {
    showMoreButton.addEventListener('click', toggleExpandedCaption);
  }

  function toggleExpandedCaption() {
    if (dom.find(attribution, '.shortened')) {
      attribution.classList.toggle('truncated');
    }
  }
};
}, {"1":1}];
