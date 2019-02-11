window.modules["newsletter-sign-up.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _require = require(5),
    get = _require.get;
/**
 * Newsletter Signup client script
 * @param {Element} el
 * @param {object} options
 * @param {function} options.onSuccess - invoked after successful signup
 */


module.exports = function (el, _ref) {
  var _ref$onSuccess = _ref.onSuccess,
      onSuccess = _ref$onSuccess === void 0 ? function () {} : _ref$onSuccess;
  var successClass = 'success',
      errorClass = 'error',
      ariaHidden = 'aria-hidden',
      errorMsg = dom.find(el, '.message.error'),
      successMsg = dom.find(el, '.message.success'),
      source = dom.find(el, '[name="source"]').value,
      email = dom.find(el, '[name="email"]').value,
      newsletterId = dom.find(el, '[name="newsletterId"]').value,
      form = dom.find(el, 'form'),
      url = form.getAttribute('action'); // -- Events

  form.addEventListener('submit', submit);
  /**
   * build a post url
   * @return {string}
   */

  function getRequestUrl() {
    return url + '?source=' + source + '&newsletterId=' + newsletterId + '&email=' + email;
  }

  ;
  /**
   * Handles form submission and events
   * @param {Event} e
   * @return {Promise}
   */

  function submit(e) {
    e.preventDefault();
    return get(getRequestUrl()).then(success).catch(error);
  }
  /**
   * Resets component to initial data
   */


  function reset() {
    form.reset();
    el.classList.remove(errorClass);
    el.classList.remove(successClass);
    errorMsg.setAttribute(ariaHidden, true);
    successMsg.setAttribute(ariaHidden, true);
  }
  /**
   * On an unsuccessful subscription
   * @param {Error} err
   */


  function error(err) {
    el.classList.add(errorClass);
    errorMsg.setAttribute(ariaHidden, false);
    errorMsg.focus();
    console.error(err);
  }

  function success() {
    // Set a pixel on successful submit
    if (window.fbq) {
      window.fbq('track', 'Lead');
    }

    reset();
    el.classList.add(successClass);
    successMsg.setAttribute(ariaHidden, false);
    successMsg.focus();
    onSuccess();
  }
};
}, {"1":1,"5":5}];
