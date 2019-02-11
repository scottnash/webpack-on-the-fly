window.modules["curated-feed.client"] = [function(require,module,exports){'use strict';

module.exports = function (el) {
  var showMoreButtons = el.querySelectorAll('button.show-more');

  if (showMoreButtons) {
    showMoreButtons.forEach(function (showMoreButton) {
      showMoreButton.addEventListener('click', toggleExpandedCaption);
    });
  }

  function toggleExpandedCaption(e) {
    var currentTarget = e.currentTarget;

    if (currentTarget) {
      var parent = currentTarget.parentElement.parentElement;

      if (parent) {
        parent.querySelector('.content').classList.toggle('collapsed');
      }
    }
  }
};
}, {}];
