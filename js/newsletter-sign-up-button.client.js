window.modules["newsletter-sign-up-button.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

DS.controller('newsletter-sign-up-button', [function () {
  var constructor,
      url = '/newsletter/subscribe/new/',
      successClass = 'success',
      errorClass = 'error',
      onClass = 'on',
      ariaHidden = 'aria-hidden';
  /**
   * @param {Element} rootEl
   * @returns {string}
   */

  function getRequestUrl(rootEl) {
    var newsletterId = dom.find(rootEl, '[name="newsletterId"]').value,
        source = dom.find(rootEl, '[name="source"]').value,
        email = dom.find(rootEl, '[name="email"]').value;
    return url + '?source=' + source + '&newsletterId=' + newsletterId + '&email=' + email;
  }
  /**
   * @param {Element} el
   * @constructor
   * @property {Element} el
   */


  constructor = function constructor(el) {
    /**
     * Root element
     * @type {Element}
     */
    this.el = el;
    /**
     * Modal DOM node
     * @type {Element}
     */

    this.modal = dom.find(el, '.modal');
    /**
     * Title DOM node
     * @type {Element}
     */

    this.title = dom.find(el, '.title');
    /**
     * Error message DOM node
     * @type {Element}
     */

    this.errorMsg = dom.find(el, '.message.error');
    /**
     * Success message DOM node
     * @type {Element}
     */

    this.successMsg = dom.find(el, '.message.success');
    /**
     * A properly bound reference to the `this.keypress` function
     * @type {Function}
     */

    this.keypressHandler = this.keypress.bind(this);
    /**
     * Boolean tracker for if the close button has focus
     * @type {Boolean}
     */

    this.closeFocused = false;
  };

  constructor.prototype = {
    events: {
      '.open click': 'open',
      '.close click': 'close',
      '.modal-lightbox click': 'close',
      'form submit': 'submit',
      '.close focus': 'closeFocus'
    },

    /**
     * A function which toggles the `this.closeFocused` boolean
     * tracker. Only fires when the closed button has focus.
     * @param  {Event} e
     */
    closeFocus: function closeFocus() {
      this.closeFocused = true;
    },

    /**
     * Tests keyboard presses for certain buttons
     * @param  {Event} e
     */
    keypress: function keypress(e) {
      // If the `escape` key is pressed
      if (e.keyCode === 27) {
        this.close();
      } // If `tab` key is pressed


      if (e.keyCode === 9) {
        // If the close button is currently focused
        if (this.closeFocused) {
          this.title.focus();
          this.closeFocused = false;
        }
      }
    },

    /**
     * Opens modal
     * @param {Event} e
     */
    open: function open(e) {
      var classList = this.el.classList;

      if (!classList.contains(onClass)) {
        classList.add(onClass);
      } // Focuses on the title element


      this.title.focus(); // Toggles 'hidden' class

      this.modal.classList.remove('hidden'); // Add a keydown event listener for focus trapping and escape

      window.addEventListener('keydown', this.keypressHandler);
      dom.preventDefault(e);
    },

    /**
     * Closes modal
     * @param {Event} [e]
     */
    close: function close(e) {
      var el = this.el;
      el.classList.remove(onClass); // Hide the modal from screen readers again

      this.modal.classList.add('hidden'); // Focus back on the modal trigger button to re-establish focus within the page

      this.el.focus(); // Remove the keydown event listener

      window.removeEventListener('keydown', this.keypressHandler);
      dom.preventDefault(e);
      this.reset();
    },

    /**
     * Handles form submission and events
     * @param {Event} e
     */
    submit: function submit(e) {
      var request = new XMLHttpRequest(),
          el = this.el;
      dom.preventDefault(e);
      request.open('GET', getRequestUrl(el), true);
      request.addEventListener('load', this.onRequest.bind(this));
      request.addEventListener('error', this.onError.bind(this));
      request.send();
    },

    /**
     * Resets component to initial data
     */
    reset: function reset() {
      var el = this.el,
          modal = dom.find(el, '.modal'),
          form = dom.find(el, 'form');
      form.reset();
      modal.classList.remove(onClass);
      el.classList.remove(errorClass);
      el.classList.remove(successClass);
      this.errorMsg.setAttribute(ariaHidden, true);
      this.successMsg.setAttribute(ariaHidden, true);
    },

    /**
     * On a request completing
     * @param {Event} e
     */
    onRequest: function onRequest(e) {
      var status = (e.currentTarget || e.target).status;

      if (status >= 200 && status < 300) {
        this.onSuccess();
      } else {
        this.onError(e);
      }
    },

    /**
     * On an unsuccessful subscription
     * @param {Event} e
     */
    onError: function onError() {
      this.el.classList.add(errorClass);
      this.errorMsg.setAttribute(ariaHidden, false);
      this.errorMsg.focus();
    },

    /**
     * On a successful subscription
     */
    onSuccess: function onSuccess() {
      // Set a pixel on successful submit
      if (window.fbq) {
        window.fbq('track', 'Lead');
      }

      this.reset();
      this.el.classList.add(successClass);
      this.successMsg.setAttribute(ariaHidden, false);
      this.successMsg.focus();
    }
  };
  return constructor;
}]);
}, {"1":1}];
