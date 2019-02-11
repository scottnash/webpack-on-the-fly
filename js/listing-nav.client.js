window.modules["listing-nav.client"] = [function(require,module,exports){'use strict';

DS.controller('listing-nav', [function () {
  function Constructor(el) {
    var btnExpand = el.querySelector('.btn-expand'),
        expanded = false;
    btnExpand.addEventListener('click', function () {
      expanded = !expanded;
      btnExpand.setAttribute('aria-expanded', expanded);
      el.classList.toggle('expanded');
    });
  }

  ;
  return Constructor;
}]);
}, {}];
