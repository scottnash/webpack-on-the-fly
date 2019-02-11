window.modules["growl.client"] = [function(require,module,exports){'use strict';

require(119);

var _some = require(118),
    dom = require(1),
    localStorageKeyRoot = 'slideout-',
    _require = require(65),
    getLocalStorage = _require.getLocalStorage,
    setLocalStorage = _require.setLocalStorage;
/**
 * @param {Element} el
 * @param {object} opts
 * @param {Element|DocumentFragment} opts.content - add an HTML element or Document Fragment
 * @param {function|null} opts.onShow - function to execute when the growl is shown
 * @param {number} opts.scrollDepth - how far down the page for the initial state of the growl
 * @param {string} opts.id - unique localStorage identifier for suppression purposes
 * @listens growl:dismiss
 */


module.exports = function (el, opts) {
  var content = opts.content,
      onShow = opts.onShow,
      _opts$scrollDepth = opts.scrollDepth,
      scrollDepth = _opts$scrollDepth === void 0 ? 50 : _opts$scrollDepth,
      _opts$dismissable = opts.dismissable,
      dismissable = _opts$dismissable === void 0 ? false : _opts$dismissable,
      depth = Number(scrollDepth || el.getAttribute('data-display-at-page-scroll-percentage')),
      modal = dom.find(el, '.modal'),
      id = opts.id || el.getAttribute('id'),
      localStorageKey = localStorageKeyRoot + id,
      dismissed = getLocalStorage(localStorageKey); // early return if localhost has marked this growl as seen

  if (dismissable && dismissed) {
    el.remove();
    return;
  } // if html is defined in settings, append it


  content && el.querySelector('[data-content]').appendChild(content); // if scrollDepth is defined in settings, create show trigger

  depth && createModalVisibilityTrigger(depth); // event listeners

  el.querySelector('.dismiss-modal').addEventListener('click', function () {
    return dismissable ? dismissModal() : hideModal();
  });
  el.addEventListener('growl:hide', hideModal);
  el.addEventListener('growl:dismiss', dismissModal);
  /**
   * Set an initial height so that when the viewport passes the modal, it displays
   * @param {number} initialPos - percent user has scrolled down (0-100)
   */

  function createModalVisibilityTrigger() {
    var initialPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;
    var observer = new IntersectionObserver(function (entries) {
      if (_some(entries, 'isIntersecting')) {
        showModal();
        observer.unobserve(modal);
      }
    });
    modal.style.top = "".concat(document.querySelector('body').scrollHeight / (100 / initialPos), "px");
    observer.observe(modal);
  } // show the modal


  function showModal() {
    modal.style.top = 'inherit';
    modal.classList.remove('hidden', 'initial');

    if (typeof onShow === 'function') {
      onShow();
    }
  } // hide the modal


  function hideModal() {
    modal.classList.add('hidden');
  } // dismiss modal record user/modal interaction state


  function dismissModal() {
    setLocalStorage(localStorageKey, true);
    hideModal();
  }
};
}, {"1":1,"65":65,"118":118,"119":119}];
