window.modules["health-warning.client"] = [function(require,module,exports){'use strict';

module.exports = function (el) {
  if (!document.body) {
    return;
  } // remove the element from its current parent and throw it on the top of the body


  el.remove();
  document.body.insertBefore(el, document.body.firstChild);
};
}, {}];
